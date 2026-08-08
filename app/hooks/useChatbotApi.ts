"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatbotResponse } from "@/app/services/chatbot.service";
import { chatbotService } from "@/app/services/chatbot.service";
import type { ApiError } from "@/app/services/apiClient";
import type { AiConversationState } from "@/app/services/common";
import type {
  ChatUiMessage,
  DeviceSwitchPrompt,
  HydrateSessionInput,
  UploadSessionMediaSuccess,
} from "./chatbot/chatbot.types";
import type { DeviceSwitchResult } from "./chatbot/chatbot.types";
import { buildUploadSessionMediaFormData } from "./chatbot/helpers/chatbotMedia";
import {
  buildHistory,
  buildSessionSignature,
  canCreateSessionFromState,
  createFallbackChatSession,
} from "./chatbot/helpers/chatbotSession";
import {
  buildDeviceSwitchPrompt,
  deriveFeedbackState,
  mergeConversationState,
} from "./chatbot/helpers/chatbotState";
import {
  cleanText,
  extractDeviceFromText,
  normalizeDeviceType,
  normalizeSymptom,
} from "./chatbot/helpers/chatbotText";

export type {
  ChatUiMessage,
  DeviceSwitchResult,
  HydrateSessionInput,
  UploadSessionMediaSuccess,
} from "./chatbot/chatbot.types";

type UseChatbotApiState = {
  sessionId: number | null;
  bookingTriggered: boolean;
  chatClosed: boolean;
  feedbackPending: boolean;
  feedbackSubmitted: boolean;
  lastAiLogId: number | null;
  lastAiFeedback: "LIKE" | "DISLIKE" | null;
  conversationState: AiConversationState | null;
  deviceSwitchPrompt: DeviceSwitchPrompt | null;
  isSubmitting: boolean;
  isUploadingMedia: boolean;
  isSubmittingFeedback: boolean;
  error: ApiError | null;
};

/** Hook chính điều phối state của chatbot AI web và các side-effect liên quan. */
export function useChatbotApi() {
  const [state, setState] = useState<UseChatbotApiState>({
    sessionId: null,
    bookingTriggered: false,
    chatClosed: false,
    feedbackPending: false,
    feedbackSubmitted: false,
    lastAiLogId: null,
    lastAiFeedback: null,
    conversationState: null,
    deviceSwitchPrompt: null,
    isSubmitting: false,
    isUploadingMedia: false,
    isSubmittingFeedback: false,
    error: null,
  });
  const creatingSessionPromiseRef = useRef<Promise<number | null> | null>(null);
  const lastCreatedSessionSignatureRef = useRef<string | null>(null);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const resetSession = useCallback(() => {
    creatingSessionPromiseRef.current = null;
    lastCreatedSessionSignatureRef.current = null;
    setState({
      sessionId: null,
      bookingTriggered: false,
      chatClosed: false,
      feedbackPending: false,
      feedbackSubmitted: false,
      lastAiLogId: null,
      lastAiFeedback: null,
      conversationState: null,
      deviceSwitchPrompt: null,
      isSubmitting: false,
      isUploadingMedia: false,
      isSubmittingFeedback: false,
      error: null,
    });
  }, []);

  /** Đồng bộ metadata của một session đã có sẵn vào local state của chatbot. */
  const hydrateSession = useCallback((session: HydrateSessionInput) => {
    creatingSessionPromiseRef.current = null;
    lastCreatedSessionSignatureRef.current = buildSessionSignature(
      session.deviceType,
      session.symptom,
    );

    setState((prev) => {
      const snapshot = session.aiStateSnapshot ?? null;
      const lastAiLogId =
        typeof session.latestAiLogId === "number" ? session.latestAiLogId : null;
      const lastAiFeedback = session.latestAiFeedback ?? null;
      const chatClosed = session.status
        ? session.status !== "AI_CONSULTING"
        : false;
      const feedbackState = deriveFeedbackState({
        chatClosed,
        lastAiLogId,
        lastAiFeedback,
      });

      return {
        ...prev,
        sessionId: session.id,
        bookingTriggered: chatClosed,
        chatClosed,
        ...feedbackState,
        lastAiLogId,
        lastAiFeedback,
        conversationState: {
          ...(snapshot ?? {}),
          ...(prev.conversationState ?? {
            phase: "COLLECTING",
            risk: "UNKNOWN",
            flags: [],
          }),
          device:
            cleanText(snapshot?.device) ||
            cleanText(session.deviceType) ||
            prev.conversationState?.device ||
            null,
          symptom:
            cleanText(snapshot?.symptom) ||
            cleanText(session.symptom) ||
            prev.conversationState?.symptom ||
            null,
          risk:
            snapshot?.risk ??
            prev.conversationState?.risk ??
            "UNKNOWN",
          phase:
            snapshot?.phase ??
            prev.conversationState?.phase ??
            "COLLECTING",
          flags:
            snapshot?.flags ??
            prev.conversationState?.flags ??
            [],
        },
        deviceSwitchPrompt: null,
        isSubmitting: false,
        isUploadingMedia: false,
        isSubmittingFeedback: false,
        error: null,
      };
    });
  }, []);

  /** Đánh dấu phiên đã đặt thợ thành công để khóa chat và bật panel feedback. */
  const markBookingConfirmed = useCallback((session?: HydrateSessionInput) => {
    setState((prev) => {
      const nextSessionId = session?.id ?? prev.sessionId;
      const nextFeedback = prev.lastAiFeedback;
      const nextLogId =
        typeof session?.latestAiLogId === "number"
          ? session.latestAiLogId
          : prev.lastAiLogId;
      const feedbackState = deriveFeedbackState({
        chatClosed: true,
        lastAiLogId: nextLogId,
        lastAiFeedback: nextFeedback,
      });

      return {
        ...prev,
        sessionId: nextSessionId,
        bookingTriggered: true,
        chatClosed: true,
        ...feedbackState,
        lastAiLogId: nextLogId,
        conversationState: {
          ...(prev.conversationState ?? {
            phase: "COLLECTING",
            risk: "RED",
            flags: [],
          }),
          device:
            cleanText(session?.deviceType) ||
            prev.conversationState?.device ||
            null,
          symptom:
            cleanText(session?.symptom) ||
            prev.conversationState?.symptom ||
            null,
        },
        deviceSwitchPrompt: null,
        error: null,
      };
    });
  }, []);

  /** Gửi feedback hữu ích/không hữu ích cho AI log cuối cùng của phiên. */
  const submitFeedback = useCallback(
    async (feedback: "LIKE" | "DISLIKE") => {
      if (state.isSubmittingFeedback || !state.lastAiLogId) {
        return null;
      }

      const accessToken =
        typeof window !== "undefined"
          ? window.localStorage.getItem("accessToken")
          : null;

      if (!accessToken) {
        const error: ApiError = {
          message: "Bạn cần đăng nhập trước khi gửi đánh giá.",
          status: 401,
        };
        setState((prev) => ({
          ...prev,
          error,
        }));
        throw error;
      }

      setState((prev) => ({
        ...prev,
        isSubmittingFeedback: true,
        error: null,
      }));

      try {
        const response = await chatbotService.saveFeedback(
          state.lastAiLogId,
          { feedback },
          accessToken,
        );
        const resolvedFeedback = response.feedback ?? feedback;

        setState((prev) => ({
          ...prev,
          lastAiFeedback: resolvedFeedback,
          feedbackPending: false,
          feedbackSubmitted: true,
          isSubmittingFeedback: false,
          error: null,
        }));

        return response;
      } catch (error) {
        const apiError = error as ApiError;
        setState((prev) => ({
          ...prev,
          isSubmittingFeedback: false,
          error: apiError,
        }));
        throw apiError;
      }
    },
    [state.isSubmittingFeedback, state.lastAiLogId],
  );

  /** Tạo ChatSession fallback đúng 1 lần khi AI state đã đủ device + symptom. */
  const ensureChatSessionFromState = useCallback(
    async (input: {
      accessToken: string;
      latestUserMessage: string;
      responseSessionId?: number | null;
      currentSessionId?: number | null;
      nextState: AiConversationState | null;
      deviceSwitchPrompt: DeviceSwitchPrompt | null;
    }) => {
      const sessionGuard = canCreateSessionFromState({
        latestUserMessage: input.latestUserMessage,
        responseSessionId: input.responseSessionId,
        currentSessionId: input.currentSessionId,
        nextState: input.nextState,
        deviceSwitchPrompt: input.deviceSwitchPrompt,
        lastCreatedSessionSignature: lastCreatedSessionSignatureRef.current,
      });

      if (!sessionGuard.canCreate) {
        return input.responseSessionId ?? input.currentSessionId ?? null;
      }

      if (creatingSessionPromiseRef.current) {
        return creatingSessionPromiseRef.current;
      }

      creatingSessionPromiseRef.current = (async () => {
        try {
          const result = await createFallbackChatSession({
            accessToken: input.accessToken,
            deviceType: sessionGuard.deviceType!,
            symptom: sessionGuard.symptom!,
            firstMessage: cleanText(input.latestUserMessage),
          });

          if (!result.ok) {
            const errorObject = result.raw as Partial<ApiError> & {
              message?: unknown;
            };

            console.warn(
              "Không thể tự tạo ChatSession từ AI state.",
              {
                status: result.status,
                message:
                  typeof errorObject?.message === "string"
                    ? errorObject.message
                    : "POST /api/chats/sessions thất bại.",
              },
            );
            return null;
          }

          if (result.sessionId && sessionGuard.signature) {
            lastCreatedSessionSignatureRef.current = sessionGuard.signature;
          }

          return result.sessionId;
        } catch (error) {
          console.warn(
            "Lỗi khi tự tạo ChatSession fallback cho web chatbot.",
            error,
          );
          return null;
        }
      })();

      try {
        return await creatingSessionPromiseRef.current;
      } finally {
        creatingSessionPromiseRef.current = null;
      }
    },
    [],
  );

  /** Gửi text lên chatbot AI cũ, merge state mới và tạo fallback session nếu cần. */
  const sendMessage = useCallback(
    async (message: string, messages: ChatUiMessage[]): Promise<ChatbotResponse> => {
      const accessToken =
        typeof window !== "undefined"
          ? window.localStorage.getItem("accessToken")
          : null;

      if (!accessToken) {
        const error: ApiError = {
          message: "Bạn cần đăng nhập trước khi dùng chatbot.",
          status: 401,
        };
        setState((prev) => ({ ...prev, error }));
        throw error;
      }

      if (state.chatClosed) {
        const error: ApiError = {
          message: "Phiên tư vấn đã kết thúc sau khi đặt thợ.",
          status: 400,
        };
        setState((prev) => ({ ...prev, error }));
        throw error;
      }

      const previousDevice = normalizeDeviceType(state.conversationState?.device);
      const incomingDevice = extractDeviceFromText(message);

      if (previousDevice && incomingDevice && previousDevice !== incomingDevice) {
        const deviceSwitchPrompt = buildDeviceSwitchPrompt({
          currentDevice: previousDevice,
          detectedDevice: incomingDevice,
          originalContent: message,
        });

        setState((prev) => ({
          ...prev,
          deviceSwitchPrompt,
          isSubmitting: false,
          error: null,
        }));

        return {
          text: deviceSwitchPrompt.message,
          state: state.conversationState ?? null,
          sessionId: state.sessionId,
          is_booking_triggered: false,
        };
      }

      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

      try {
        const response = await chatbotService.sendMessage(
          {
            message,
            sessionId: state.sessionId,
            history: buildHistory(messages),
            state: state.conversationState ?? undefined,
          },
          accessToken,
        );

        const {
          nextState: nextConversationState,
          deviceSwitchPrompt,
        } = mergeConversationState(
          state.conversationState,
          response.state ?? null,
          message,
        );

        const ensuredSessionId = await ensureChatSessionFromState({
          accessToken,
          latestUserMessage: message,
          responseSessionId: response.sessionId,
          currentSessionId: state.sessionId,
          nextState: nextConversationState,
          deviceSwitchPrompt,
        });

        setState((prev) => ({
          ...prev,
          sessionId: response.sessionId ?? ensuredSessionId ?? prev.sessionId,
          bookingTriggered:
            response.is_booking_triggered === true || prev.bookingTriggered,
          lastAiLogId:
            typeof response.logId === "number"
              ? response.logId
              : prev.lastAiLogId,
          conversationState: nextConversationState ?? prev.conversationState,
          deviceSwitchPrompt,
          isSubmitting: false,
          error: null,
        }));

        return {
          ...response,
          sessionId: response.sessionId ?? ensuredSessionId ?? null,
          state: nextConversationState ?? response.state ?? null,
        };
      } catch (error) {
        const apiError = error as ApiError;
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: apiError,
        }));
        throw apiError;
      }
    },
    [
      ensureChatSessionFromState,
      state.chatClosed,
      state.conversationState,
      state.sessionId,
    ],
  );

  /** Upload ảnh/video vào session AI hiện tại và giữ device/symptom context cho backend. */
  const uploadSessionMedia = useCallback(
    async (
      file: File,
      options?: { deviceType?: string; symptom?: string },
    ): Promise<UploadSessionMediaSuccess | DeviceSwitchResult> => {
      const accessToken =
        typeof window !== "undefined"
          ? window.localStorage.getItem("accessToken")
          : null;

      if (!accessToken) {
        const apiError: ApiError = {
          message: "Bạn cần đăng nhập trước khi dùng chatbot.",
          status: 401,
        };
        setState((prev) => ({ ...prev, error: apiError }));
        throw apiError;
      }

      if (state.chatClosed) {
        const apiError: ApiError = {
          message: "Phiên tư vấn đã kết thúc sau khi đặt thợ.",
          status: 400,
        };
        setState((prev) => ({ ...prev, error: apiError }));
        throw apiError;
      }

      if (!state.sessionId) {
        const apiError: ApiError = {
          message: "Bạn cần mô tả thiết bị và lỗi trước để tạo phiên tư vấn.",
          status: 400,
        };
        setState((prev) => ({ ...prev, error: apiError }));
        throw apiError;
      }

      setState((prev) => ({ ...prev, isUploadingMedia: true, error: null }));

      try {
        const contextDevice =
          normalizeDeviceType(options?.deviceType) ??
          normalizeDeviceType(state.conversationState?.device) ??
          "";
        const contextSymptom =
          normalizeSymptom(options?.symptom, true) ??
          normalizeSymptom(state.conversationState?.symptom, true) ??
          "";

        const formData = buildUploadSessionMediaFormData({
          file,
          deviceType: contextDevice,
          symptom: contextSymptom,
        });

        const response = await fetch(`/api/chats-web/${state.sessionId}/image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        const raw = (await response.json()) as unknown;

        if (!response.ok) {
          const errorObject = raw as Partial<ApiError> & { message?: unknown };
          const apiError: ApiError = {
            message:
              typeof errorObject?.message === "string"
                ? errorObject.message
                : "Không thể tải tệp lên phiên chat.",
            status: response.status,
            details: raw,
          };
          throw apiError;
        }

        const maybeSwitch = raw as Partial<DeviceSwitchResult>;
        if (maybeSwitch.deviceSwitchDetected === true) {
          return maybeSwitch as DeviceSwitchResult;
        }

        return raw as UploadSessionMediaSuccess;
      } catch (error) {
        const apiError = error as ApiError;
        setState((prev) => ({
          ...prev,
          isUploadingMedia: false,
          error: apiError,
        }));
        throw apiError;
      } finally {
        setState((prev) => ({ ...prev, isUploadingMedia: false }));
      }
    },
    [state.chatClosed, state.conversationState, state.sessionId],
  );

  return {
    ...state,
    clearError,
    hydrateSession,
    markBookingConfirmed,
    resetSession,
    sendMessage,
    submitFeedback,
    uploadSessionMedia,
  };
}
