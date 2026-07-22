"use client";

import { useCallback, useRef, useState } from "react";
import { chatbotService, type ChatbotHistoryItem, type ChatbotResponse, type ChatbotStatePayload } from "@/app/services/chatbot.service";
import type { ApiError } from "@/app/services/apiClient";
import { aiService } from "@/app/services/common";
import type { AiConversationContextAnswers, AiConversationState, ChatSessionItem } from "@/app/services/common";

export type DeviceSwitchResult = {
  deviceSwitchDetected: true;
  currentDevice?: string | null;
  detectedDevice?: string | null;
  originalContent?: string;
  message: string;
  actions?: Array<{
    action: "CREATE_NEW_SESSION" | "CONTINUE_CURRENT_SESSION" | string;
    label: string;
  }>;
};

export type UploadSessionMediaSuccess = {
  message: string;
  fileUrl: string;
  data: {
    id: number;
    type?: string;
    content?: string;
    metadata?: Record<string, unknown> | null;
  };
};

export type ChatUiMessage = {
  id: string;
  type: "text" | "image" | "video" | "device-switch";
  role: "user" | "assistant" | "system";
  content: string;
  mediaUrl?: string;
  deviceSwitch?: DeviceSwitchResult;
};

type DeviceSwitchPrompt = {
  currentDevice: string;
  detectedDevice: string;
  originalContent: string;
  message: string;
};

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

type CreateChatSessionResponse = {
  id: number;
  deviceType?: string | null;
  symptom?: string | null;
};

type HydrateSessionInput = {
  id: number;
  deviceType?: string | null;
  symptom?: string | null;
  status?: ChatSessionItem["status"] | null;
  latestAiLogId?: number | null;
  latestAiFeedback?: "LIKE" | "DISLIKE" | null;
};

const DEVICE_ALIASES: Record<string, string> = {
  "lo vi song": "\u004C\u00F2 vi s\u00F3ng",
  "lo nuong": "\u004C\u00F2 n\u01B0\u1EDBng",
  microwave: "\u004C\u00F2 vi s\u00F3ng",
  "may rua bat": "M\u00E1y r\u1EEDa b\u00E1t",
  "may rua chen": "M\u00E1y r\u1EEDa b\u00E1t",
  dishwasher: "M\u00E1y r\u1EEDa b\u00E1t",
  "may lanh": "\u0110i\u1EC1u h\u00F2a",
  "dieu hoa": "\u0110i\u1EC1u h\u00F2a",
  "air conditioner": "\u0110i\u1EC1u h\u00F2a",
  "tu lanh": "T\u1EE7 l\u1EA1nh",
  "tu dong": "T\u1EE7 l\u1EA1nh",
  "cai tu": "T\u1EE7 l\u1EA1nh",
  fridge: "T\u1EE7 l\u1EA1nh",
  refrigerator: "T\u1EE7 l\u1EA1nh",
  "may nuoc nong": "M\u00E1y n\u01B0\u1EDBc n\u00F3ng",
  "binh nong lanh": "M\u00E1y n\u01B0\u1EDBc n\u00F3ng",
  "may say": "M\u00E1y s\u1EA5y",
  "may giat": "M\u00E1y gi\u1EB7t",
  "washing machine": "M\u00E1y gi\u1EB7t",
  "bep tu": "B\u1EBFp t\u1EEB",
  "bep dien": "B\u1EBFp \u0111i\u1EC7n",
  "noi chien khong dau": "N\u1ED3i chi\u00EAn kh\u00F4ng d\u1EA7u",
  "noi chien": "N\u1ED3i chi\u00EAn kh\u00F4ng d\u1EA7u",
  "noi com dien": "N\u1ED3i c\u01A1m \u0111i\u1EC7n",
  "may pha ca phe": "M\u00E1y pha c\u00E0 ph\u00EA",
  "may hut mui": "M\u00E1y h\u00FAt m\u00F9i",
  "may hut bui": "M\u00E1y h\u00FAt b\u1EE5i",
  "robot hut bui": "Robot h\u00FAt b\u1EE5i",
  "may lau nha": "M\u00E1y lau nh\u00E0",
  "may loc khong khi": "M\u00E1y l\u1ECDc kh\u00F4ng kh\u00ED",
  "may hut am": "M\u00E1y h\u00FAt \u1EA9m",
  "may tao am": "M\u00E1y t\u1EA1o \u1EA9m",
  "may loc nuoc": "M\u00E1y l\u1ECDc n\u01B0\u1EDBc",
  tivi: "Tivi",
  tv: "Tivi",
  "man hinh": "M\u00E0n h\u00ECnh",
  loa: "Loa",
};

const SESSION_CREATION_BLOCKING_FLAGS = new Set([
  "DEVICE_SYMPTOM_CONFLICT",
  "NEEDS_DEVICE_CONFIRMATION",
  "DEVICE_SWITCH_DETECTED",
]);

const SYMPTOM_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /\b(?:khong|ko|k|kh)\s+lanh\b|\b(?:khong|ko|k|kh)\s+mat\b|\bkhong\s+lam\s+mat\b|\bphong\s+ham\s+ham\b|\bchang\s+thay\s+mat\b/, value: "Không lạnh" },
  { pattern: /\bkhong\s+nong\b|\bkhong\s+lam\s+nong(?:\s+thuc\s+an)?\b|\bdo\s+an\s+van\s+nguoi\b|\bquay\s+xong\s+van\s+nguoi\b/, value: "Không nóng" },
  { pattern: /\bkhong\s+dong\s+da\b/, value: "Không đông đá" },
  { pattern: /\bkhong\s+vat\b/, value: "Không vắt" },
  { pattern: /\bkhong\s+len\s+nguon\b/, value: "Không lên nguồn" },
  { pattern: /\bkhong\s+chay\b/, value: "Không chạy" },
  { pattern: /\bkhong\s+hoat\s+dong\b/, value: "Không hoạt động" },
  { pattern: /\bbi\s+hu\b/, value: "Bị hư" },
  { pattern: /\bhu\s+roi\b/, value: "Hư rồi" },
];

function buildHistory(messages: ChatUiMessage[]): ChatbotHistoryItem[] {
  return messages
    .filter(
      (message): message is ChatUiMessage & { role: "user" | "assistant" } =>
        message.role === "user" || message.role === "assistant",
    )
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

function cleanText(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function toComparableText(value?: string | null) {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findCanonicalDevice(value?: string | null) {
  const comparable = toComparableText(value);

  if (!comparable) {
    return null;
  }

  for (const [alias, canonical] of Object.entries(DEVICE_ALIASES)) {
    const matcher = new RegExp(`(?:^|\\s)${escapeRegExp(alias)}(?:\\s|$)`);
    if (matcher.test(comparable)) {
      return canonical;
    }
  }

  return null;
}

function inferDeviceLabel(value?: string | null) {
  const cleaned = cleanText(value);
  if (!cleaned) {
    return null;
  }

  return findCanonicalDevice(cleaned) ?? cleaned;
}

function extractSymptomCandidate(value?: string | null) {
  const comparable = toComparableText(value);

  if (!comparable) {
    return null;
  }

  for (const symptom of SYMPTOM_PATTERNS) {
    if (symptom.pattern.test(comparable)) {
      return symptom.value;
    }
  }

  return null;
}

function normalizeDeviceType(value?: string | null) {
  return inferDeviceLabel(value);
}

function normalizeSymptom(value?: string | null, allowFreeText: boolean = false) {
  const cleaned = cleanText(value);
  const explicitSymptom = extractSymptomCandidate(cleaned);

  if (!allowFreeText && explicitSymptom) return explicitSymptom;

  if (!cleaned || findCanonicalDevice(cleaned)) {
    return null;
  }

  if (!allowFreeText) return null;

  const hasDangerDetail =
    /(mùi khét|khét|cháy|bốc khói|tia lửa|rò điện|điện giật|chập|nóng bất thường|rò gas|rò nước)/i.test(
      cleaned,
    );
  const isLongDescription =
    cleaned.length >= 24 || cleaned.split(/\s+/).length >= 6;
  const extractedIsTooShort =
    explicitSymptom != null &&
    explicitSymptom.trim().length <= cleaned.length * 0.55;

  if (hasDangerDetail || (isLongDescription && extractedIsTooShort)) {
    return cleaned;
  }

  return explicitSymptom || cleaned;
}

function extractDeviceFromText(value?: string | null) {
  return findCanonicalDevice(value);
}

function extractSymptomFromText(value?: string | null) {
  return extractSymptomCandidate(value);
}

function pickBetterSymptom(input: {
  previous?: string | null;
  fromBackend?: string | null;
  userText?: string | null;
}) {
  const prev = cleanText(input.previous);
  const backend = cleanText(input.fromBackend);
  const user = cleanText(input.userText);
  const dangerPattern =
    /(mùi khét|khét|cháy|bốc khói|tia lửa|rò điện|điện giật|chập|nóng bất thường|rò gas|rò nước)/i;

  if (user && dangerPattern.test(user)) return user;
  if (backend && dangerPattern.test(backend)) return backend;
  if (user && backend && user.toLowerCase().includes(backend.toLowerCase())) {
    return user.length > backend.length ? user : backend;
  }

  return [prev, backend, user].filter(Boolean).sort((a, b) => b.length - a.length)[0] || "";
}

function buildDeviceSwitchPrompt(input: {
  currentDevice: string;
  detectedDevice: string;
  originalContent: string;
}): DeviceSwitchPrompt {
  return {
    currentDevice: input.currentDevice,
    detectedDevice: input.detectedDevice,
    originalContent: input.originalContent,
    message: `Phi\u00EAn n\u00E0y \u0111ang t\u01B0 v\u1EA5n cho ${input.currentDevice}. V\u1EA5n \u0111\u1EC1 ${input.detectedDevice} n\u00EAn t\u1EA1o phi\u00EAn m\u1EDBi \u0111\u1EC3 kh\u00F4ng l\u1EABn th\u00F4ng tin ch\u1EA9n \u0111o\u00E1n.`,
  };
}

function hasBlockingStateFlag(state?: ChatbotStatePayload | AiConversationState | null) {
  if (!Array.isArray(state?.flags)) {
    return false;
  }

  return state.flags.some((flag) => SESSION_CREATION_BLOCKING_FLAGS.has(flag));
}

function deriveFeedbackState(input: {
  chatClosed: boolean;
  lastAiLogId: number | null;
  lastAiFeedback: "LIKE" | "DISLIKE" | null;
}) {
  const feedbackSubmitted = input.lastAiFeedback === "LIKE" || input.lastAiFeedback === "DISLIKE";
  return {
    feedbackSubmitted,
    feedbackPending: input.chatClosed && input.lastAiLogId !== null && !feedbackSubmitted,
  };
}

function mergeConversationState(
  previousState: AiConversationState | null,
  responseState: ChatbotStatePayload | AiConversationState | null | undefined,
  latestUserMessage: string,
): { nextState: AiConversationState | null; deviceSwitchPrompt: DeviceSwitchPrompt | null } {
  const previousDevice = normalizeDeviceType(previousState?.device);
  const responseDevice = hasBlockingStateFlag(responseState)
    ? previousDevice
    : normalizeDeviceType(responseState?.device);
  const latestMessageDevice = extractDeviceFromText(latestUserMessage);

  const previousSymptom = normalizeSymptom(previousState?.symptom, true);
  const responseSymptom = pickBetterSymptom({
    previous: previousState?.symptom,
    fromBackend: normalizeSymptom(responseState?.symptom, true),
    userText: latestUserMessage,
  });
  const latestMessageSymptom = extractSymptomFromText(latestUserMessage);

  const mergedDevice =
    responseDevice ??
    (hasBlockingStateFlag(responseState) ? null : latestMessageDevice) ??
    previousDevice ??
    null;
  const mergedSymptom =
    responseSymptom ?? latestMessageSymptom ?? previousSymptom ?? null;

  if (previousDevice && mergedDevice && previousDevice !== mergedDevice) {
    return {
      nextState: previousState,
      deviceSwitchPrompt: buildDeviceSwitchPrompt({
        currentDevice: previousDevice,
        detectedDevice: mergedDevice,
        originalContent: latestUserMessage,
      }),
    };
  }

  if (!previousState && !responseState && !mergedDevice && !mergedSymptom) {
    return { nextState: null, deviceSwitchPrompt: null };
  }

  const mergedContextAnswers = mergeContextAnswers(
    previousState?.contextAnswers,
    responseState?.contextAnswers,
  );

  return {
    nextState: {
      ...(previousState ?? {}),
      ...(responseState ?? {}),
      device: mergedDevice,
      symptom: mergedSymptom,
      phase: responseState?.phase ?? previousState?.phase ?? "COLLECTING",
      risk: responseState?.risk ?? previousState?.risk ?? "UNKNOWN",
      flags: responseState?.flags ?? previousState?.flags ?? [],
      contextAnswers: mergedContextAnswers,
      contextQuestionsAsked:
        responseState?.contextQuestionsAsked ?? previousState?.contextQuestionsAsked,
      contextQuestionSet:
        responseState?.contextQuestionSet ?? previousState?.contextQuestionSet ?? null,
      askedFollowupKey:
        responseState?.contextQuestionSet &&
        responseState.contextQuestionSet !== previousState?.contextQuestionSet
          ? responseState?.askedFollowupKey ?? null
          : responseState?.askedFollowupKey ?? previousState?.askedFollowupKey ?? null,
    },
    deviceSwitchPrompt: null,
  };
}

function mergeContextAnswers(
  previousValue?: AiConversationContextAnswers | null,
  nextValue?: AiConversationContextAnswers | null,
) {
  const merged: AiConversationContextAnswers = { ...(previousValue ?? {}) };

  for (const [key, value] of Object.entries(nextValue ?? {})) {
    if (typeof value === "string" && value.trim()) {
      merged[key as keyof AiConversationContextAnswers] = value.trim();
    }
  }

  return merged;
}

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

  const hydrateSession = useCallback((session: HydrateSessionInput) => {
    creatingSessionPromiseRef.current = null;
    lastCreatedSessionSignatureRef.current =
      normalizeDeviceType(session.deviceType) && normalizeSymptom(session.symptom, true)
        ? `${normalizeDeviceType(session.deviceType)}::${normalizeSymptom(session.symptom, true)}`
        : null;

    setState((prev) => {
      const lastAiLogId =
        typeof session.latestAiLogId === "number" ? session.latestAiLogId : null;
      const lastAiFeedback = session.latestAiFeedback ?? null;
      const chatClosed = session.status ? session.status !== "AI_CONSULTING" : false;
      const feedbackState = deriveFeedbackState({
        chatClosed,
        lastAiLogId,
        lastAiFeedback,
      });

      return ({
      ...prev,
      sessionId: session.id,
      bookingTriggered: chatClosed,
      chatClosed,
      ...feedbackState,
      lastAiLogId,
      lastAiFeedback,
      conversationState: {
        ...(prev.conversationState ?? {
          phase: "COLLECTING",
          risk: "UNKNOWN",
          flags: [],
        }),
        device: session.deviceType?.trim() || null,
        symptom: session.symptom?.trim() || null,
      },
      deviceSwitchPrompt: null,
      isSubmitting: false,
      isUploadingMedia: false,
      isSubmittingFeedback: false,
      error: null,
      });
    });
  }, []);

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
            risk: "UNKNOWN",
            flags: [],
          }),
          device: session?.deviceType?.trim() || prev.conversationState?.device || null,
          symptom: session?.symptom?.trim() || prev.conversationState?.symptom || null,
        },
        deviceSwitchPrompt: null,
        error: null,
      };
    });
  }, []);

  const submitFeedback = useCallback(
    async (feedback: "LIKE" | "DISLIKE") => {
      if (state.isSubmittingFeedback || !state.lastAiLogId) {
        return null;
      }

      setState((prev) => ({
        ...prev,
        isSubmittingFeedback: true,
        error: null,
      }));

      try {
        const response = await aiService.saveFeedback(state.lastAiLogId, { feedback });
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

  const ensureChatSessionFromState = useCallback(
    async (input: {
      accessToken: string;
      latestUserMessage: string;
      responseSessionId?: number | null;
      currentSessionId?: number | null;
      nextState: AiConversationState | null;
      deviceSwitchPrompt: DeviceSwitchPrompt | null;
    }) => {
      if (input.responseSessionId || input.currentSessionId || input.deviceSwitchPrompt) {
        return input.responseSessionId ?? input.currentSessionId ?? null;
      }

      if (hasBlockingStateFlag(input.nextState)) {
        return null;
      }

      const normalizedDevice = normalizeDeviceType(input.nextState?.device);
      const normalizedSymptom = normalizeSymptom(input.nextState?.symptom, true);
      const latestUserMessage = cleanText(input.latestUserMessage);

      if (!normalizedDevice || !normalizedSymptom || !latestUserMessage) {
        return null;
      }

      const sessionSignature = `${normalizedDevice}::${normalizedSymptom}`;

      if (lastCreatedSessionSignatureRef.current === sessionSignature) {
        return null;
      }

      if (creatingSessionPromiseRef.current) {
        return creatingSessionPromiseRef.current;
      }

      creatingSessionPromiseRef.current = (async () => {
        try {
          const response = await fetch("/api/chats/sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${input.accessToken}`,
            },
            body: JSON.stringify({
              deviceType: normalizedDevice,
              symptom: normalizedSymptom,
              firstMessage: latestUserMessage,
            }),
          });

          const raw = (await response.json()) as unknown;

          if (!response.ok) {
            const errorObject = raw as Partial<ApiError> & { message?: unknown };
            console.warn("Kh\u00F4ng th\u1EC3 t\u1EF1 t\u1EA1o ChatSession t\u1EEB AI state.", {
              status: response.status,
              message:
                typeof errorObject?.message === "string"
                  ? errorObject.message
                  : "POST /api/chats/sessions th\u1EA5t b\u1EA1i.",
            });
            return null;
          }

          const createdSession = raw as CreateChatSessionResponse;
          const createdSessionId =
            typeof createdSession.id === "number" ? createdSession.id : null;

          if (createdSessionId) {
            lastCreatedSessionSignatureRef.current = sessionSignature;
          }

          return createdSessionId;
        } catch (error) {
          console.warn("L\u1ED7i khi t\u1EF1 t\u1EA1o ChatSession fallback cho web chatbot.", error);
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

  const sendMessage = useCallback(
    async (message: string, messages: ChatUiMessage[]): Promise<ChatbotResponse> => {
      const accessToken =
        typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;

      if (!accessToken) {
        const error: ApiError = {
          message: "B\u1EA1n c\u1EA7n \u0111\u0103ng nh\u1EADp tr\u01B0\u1EDBc khi d\u00F9ng chatbot.",
          status: 401,
        };
        setState((prev) => ({ ...prev, error }));
        throw error;
      }

      if (state.chatClosed) {
        const error: ApiError = {
          message: "Phi\u00EAn t\u01B0 v\u1EA5n \u0111\u00E3 k\u1EBFt th\u00FAc sau khi \u0111\u1EB7t th\u1EE3.",
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

        const { nextState: nextConversationState, deviceSwitchPrompt } = mergeConversationState(
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
          bookingTriggered: response.is_booking_triggered === true || prev.bookingTriggered,
          lastAiLogId:
            typeof response.logId === "number" ? response.logId : prev.lastAiLogId,
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
    [ensureChatSessionFromState, state.chatClosed, state.conversationState, state.sessionId],
  );

  const uploadSessionMedia = useCallback(
    async (
      file: File,
      options?: { deviceType?: string; symptom?: string },
    ): Promise<UploadSessionMediaSuccess | DeviceSwitchResult> => {
      const accessToken =
        typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;

      if (!accessToken) {
        const apiError: ApiError = {
          message: "B\u1EA1n c\u1EA7n \u0111\u0103ng nh\u1EADp tr\u01B0\u1EDBc khi d\u00F9ng chatbot.",
          status: 401,
        };
        setState((prev) => ({ ...prev, error: apiError }));
        throw apiError;
      }

      if (state.chatClosed) {
        const apiError: ApiError = {
          message: "Phi\u00EAn t\u01B0 v\u1EA5n \u0111\u00E3 k\u1EBFt th\u00FAc sau khi \u0111\u1EB7t th\u1EE3.",
          status: 400,
        };
        setState((prev) => ({ ...prev, error: apiError }));
        throw apiError;
      }

      if (!state.sessionId) {
        const apiError: ApiError = {
          message: "B\u1EA1n c\u1EA7n m\u00F4 t\u1EA3 thi\u1EBFt b\u1ECB v\u00E0 l\u1ED7i tr\u01B0\u1EDBc \u0111\u1EC3 t\u1EA1o phi\u00EAn t\u01B0 v\u1EA5n.",
          status: 400,
        };
        setState((prev) => ({ ...prev, error: apiError }));
        throw apiError;
      }

      setState((prev) => ({ ...prev, isUploadingMedia: true, error: null }));

      try {
        const formData = new FormData();
        // TODO: Cần vision/image classification nếu muốn cảnh báo ảnh không cùng thiết bị.
        const contextDevice =
          normalizeDeviceType(options?.deviceType) ??
          normalizeDeviceType(state.conversationState?.device) ??
          "";
        const contextSymptom =
          normalizeSymptom(options?.symptom, true) ??
          normalizeSymptom(state.conversationState?.symptom, true) ??
          "";

        formData.append("file", file);
        formData.append("deviceType", contextDevice);
        formData.append("symptom", contextSymptom);

        const response = await fetch(`/api/chats/${state.sessionId}/image`, {
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
                : "Kh\u00F4ng th\u1EC3 t\u1EA3i t\u1EC7p l\u00EAn phi\u00EAn chat.",
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
