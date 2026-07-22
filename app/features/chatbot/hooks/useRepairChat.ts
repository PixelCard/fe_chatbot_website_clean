"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import {
  getClientTokenFromDocument,
  syncStoredSessionToCookie,
} from "@/app/auth/utils/session";
import { chatApi } from "../api/chatApi";
import {
  deriveChatSessionTitle,
  isChatMessage,
  isDeviceSwitchDetected,
  type ChatMessage,
  type ChatSession,
  type CreateChatSessionPayload,
  type DeviceSwitchDetectedPayload,
} from "../types/chat.types";
import { useChatSocket } from "./useChatSocket";

type SendTextOptions = {
  deviceType?: string;
  symptom?: string;
  useSocket?: boolean;
};

type UploadMediaOptions = {
  deviceType?: string;
  symptom?: string;
};

function normalizeErrorMessage(error: unknown) {
  const apiError = error as ApiError | undefined;

  if (apiError?.status === 401 || apiError?.status === 403) {
    return "Phiên đăng nhập không hợp lệ hoặc bạn không có quyền.";
  }

  if (apiError?.status === 404) {
    return "Phiên chat không tồn tại.";
  }

  return apiError?.message ?? "Không thể xử lý yêu cầu chat lúc này.";
}

function mergeSessionList(sessions: ChatSession[], session: ChatSession) {
  const nextSession = {
    ...session,
    title: deriveChatSessionTitle(session),
  };
  const filtered = sessions.filter((item) => item.id !== session.id);
  return [nextSession, ...filtered];
}

function appendUniqueMessage(messages: ChatMessage[], message: ChatMessage) {
  if (messages.some((item) => item.id === message.id)) {
    return messages.map((item) => (item.id === message.id ? { ...item, ...message } : item));
  }

  return [...messages, message];
}

function updateSessionLastMessage(
  sessions: ChatSession[],
  sessionId: number,
  message: ChatMessage,
  unreadCount?: number,
) {
  return sessions.map((session) =>
    session.id === sessionId
      ? {
          ...session,
          title: deriveChatSessionTitle(session),
          lastMessage: message,
          unreadCount,
          updatedAt: message.updatedAt ?? message.createdAt,
        }
      : session,
  );
}

export function useRepairChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSessionState] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceSwitchPrompt, setDeviceSwitchPrompt] =
    useState<DeviceSwitchDetectedPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const activeSessionIdRef = useRef<number | null>(null);
  const loadSessionsRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    const session = syncStoredSessionToCookie();
    setToken(session.token ?? getClientTokenFromDocument());
  }, []);

  const updateActiveSession = useCallback((session: ChatSession | null) => {
    activeSessionIdRef.current = session?.id ?? null;
    setActiveSessionState(session ? { ...session, title: deriveChatSessionTitle(session) } : null);
  }, []);

  const socketCallbacks = useMemo(
    () => ({
      onNewMessage: (message: ChatMessage) => {
        setSessions((prev) => updateSessionLastMessage(prev, message.sessionId, message));
        if (message.sessionId !== activeSessionIdRef.current) {
          return;
        }

        setMessages((prev) => appendUniqueMessage(prev, message));
      },
      onMessageDelivered: (payload: {
        tempId?: string;
        savedMessage?: ChatMessage;
        message?: ChatMessage;
      }) => {
        const delivered = payload.savedMessage ?? payload.message;
        if (!delivered || !isChatMessage(delivered)) return;

        setSessions((prev) => updateSessionLastMessage(prev, delivered.sessionId, delivered));
        if (delivered.sessionId !== activeSessionIdRef.current) {
          return;
        }

        setMessages((prev) => appendUniqueMessage(prev, delivered));
      },
      onInboxUpdate: (payload: unknown) => {
        if (
          payload &&
          typeof payload === "object" &&
          typeof (payload as { sessionId?: unknown }).sessionId === "number" &&
          isChatMessage((payload as { lastMessage?: unknown }).lastMessage)
        ) {
          const data = payload as { sessionId: number; lastMessage: ChatMessage };
          setSessions((prev) => updateSessionLastMessage(prev, data.sessionId, data.lastMessage));
          return;
        }

        void loadSessionsRef.current();
      },
      onJobStatusChanged: (payload: unknown) => {
        if (
          !payload ||
          typeof payload !== "object" ||
          typeof (payload as { sessionId?: unknown }).sessionId !== "number"
        ) {
          return;
        }

        const nextSessionId = (payload as { sessionId: number }).sessionId;
        const nextStatus =
          typeof (payload as { status?: unknown }).status === "string"
            ? (payload as { status: string }).status
            : undefined;

        if (!nextStatus) return;

        setSessions((prev) =>
          prev.map((session) =>
            session.id === nextSessionId ? { ...session, status: nextStatus } : session,
          ),
        );
        setActiveSessionState((current) => {
          if (!current || current.id !== nextSessionId) {
            return current;
          }

          return {
            ...current,
            status: nextStatus,
          };
        });
      },
      onQuoteUpdated: (payload: unknown) => {
        const message =
          payload &&
          typeof payload === "object" &&
          isChatMessage((payload as { message?: unknown }).message)
            ? (payload as { message: ChatMessage }).message
            : null;

        if (!message) return;

        setSessions((prev) => updateSessionLastMessage(prev, message.sessionId, message));
        if (message.sessionId !== activeSessionIdRef.current) {
          return;
        }

        setMessages((prev) => appendUniqueMessage(prev, message));
      },
      onDeviceSwitchDetected: (payload: DeviceSwitchDetectedPayload) => {
        setDeviceSwitchPrompt(payload);
      },
      onError: (message: string) => {
        setError(message);
      },
    }),
    [updateActiveSession],
  );

  const {
    connected,
    joinSession,
    leaveSession,
    sendSocketMessage,
    markAsRead,
  } = useChatSocket({
    enabled: Boolean(token),
    token,
    ...socketCallbacks,
  });

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    setError(null);

    try {
      const nextSessions = await chatApi.getSessions();
      setSessions(nextSessions.map((session) => ({
        ...session,
        title: deriveChatSessionTitle(session),
      })));

      setActiveSessionState((current) => {
        if (!current) return current;
        const matched = nextSessions.find((session) => session.id === current.id) ?? null;
        activeSessionIdRef.current = matched?.id ?? null;
        return matched ? { ...matched, title: deriveChatSessionTitle(matched) } : null;
      });
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  loadSessionsRef.current = loadSessions;

  const selectSession = useCallback(
    async (sessionId: number) => {
      const previousSessionId = activeSessionIdRef.current;
      if (previousSessionId && previousSessionId !== sessionId) {
        leaveSession(previousSessionId);
      }

      setLoadingMessages(true);
      setError(null);

      try {
        const [session, sessionMessages] = await Promise.all([
          chatApi.getSession(sessionId),
          chatApi.getMessages(sessionId),
        ]);

        updateActiveSession(session);
        setMessages(sessionMessages);
        setSessions((prev) => mergeSessionList(prev, session));
        joinSession(sessionId);

        await chatApi.markAllAsRead(sessionId).catch(() => undefined);
        setSessions((prev) =>
          prev.map((item) => (item.id === sessionId ? { ...item, unreadCount: 0 } : item)),
        );
      } catch (requestError) {
        setError(normalizeErrorMessage(requestError));
      } finally {
        setLoadingMessages(false);
      }
    },
    [joinSession, leaveSession, updateActiveSession],
  );

  const createNewSession = useCallback(
    async (payload?: CreateChatSessionPayload) => {
      setLoadingMessages(true);
      setError(null);

      try {
        const session = await chatApi.createSession(payload);
        setSessions((prev) => mergeSessionList(prev, session));
        await selectSession(session.id);
        return session;
      } catch (requestError) {
        setError(normalizeErrorMessage(requestError));
        throw requestError;
      } finally {
        setLoadingMessages(false);
      }
    },
    [selectSession],
  );

  const refreshActiveSession = useCallback(async () => {
    if (!activeSessionIdRef.current) return;

    try {
      const session = await chatApi.getSession(activeSessionIdRef.current);
      updateActiveSession(session);
      setSessions((prev) => mergeSessionList(prev, session));
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    }
  }, [updateActiveSession]);

  const sendTextMessage = useCallback(
    async (content: string, extra?: SendTextOptions) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      setSending(true);
      setError(null);

      try {
        if (!activeSessionIdRef.current) {
          await createNewSession({
            firstMessage: trimmed,
            deviceType: extra?.deviceType,
            symptom: extra?.symptom,
          });
          return;
        }

        if (extra?.useSocket) {
          sendSocketMessage({
            sessionId: activeSessionIdRef.current,
            content: trimmed,
            type: "TEXT",
            deviceType: extra.deviceType,
            symptom: extra.symptom,
          });
          return;
        }

        const response = await chatApi.sendMessage(activeSessionIdRef.current, {
          content: trimmed,
          type: "TEXT",
          deviceType: extra?.deviceType,
          symptom: extra?.symptom,
        });

        if (isDeviceSwitchDetected(response)) {
          setDeviceSwitchPrompt(response);
          return;
        }

        setMessages((prev) => appendUniqueMessage(prev, response));
        setSessions((prev) =>
          updateSessionLastMessage(prev, response.sessionId, response, 0),
        );
      } catch (requestError) {
        setError(normalizeErrorMessage(requestError));
      } finally {
        setSending(false);
      }
    },
    [createNewSession, sendSocketMessage],
  );

  const uploadMedia = useCallback(
    async (file: File, extra?: UploadMediaOptions) => {
      if (!activeSessionIdRef.current) {
        setError("Vui lòng tạo hoặc chọn phiên chat trước khi gửi tệp.");
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const response = await chatApi.uploadMedia(activeSessionIdRef.current, file, {
          deviceType: extra?.deviceType,
          symptom: extra?.symptom,
        });

        if (isDeviceSwitchDetected(response)) {
          setDeviceSwitchPrompt(response);
          return;
        }

        setMessages((prev) => appendUniqueMessage(prev, response));
        setSessions((prev) =>
          updateSessionLastMessage(prev, response.sessionId, response, 0),
        );
      } catch (requestError) {
        setError(normalizeErrorMessage(requestError));
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  const dismissDeviceSwitch = useCallback(() => {
    setDeviceSwitchPrompt(null);
  }, []);

  const confirmCreateSessionFromSwitch = useCallback(async () => {
    if (!deviceSwitchPrompt) return;

    const payload: CreateChatSessionPayload = {
      deviceType: deviceSwitchPrompt.detectedDevice ?? undefined,
      firstMessage: deviceSwitchPrompt.originalContent ?? undefined,
    };

    setDeviceSwitchPrompt(null);
    await createNewSession(payload);
  }, [createNewSession, deviceSwitchPrompt]);

  const deleteSession = useCallback(
    async (sessionId: number) => {
      setError(null);

      try {
        await chatApi.deleteSession(sessionId);
        if (activeSessionIdRef.current === sessionId) {
          leaveSession(sessionId);
          updateActiveSession(null);
          setMessages([]);
        }

        setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      } catch (requestError) {
        setError(normalizeErrorMessage(requestError));
      }
    },
    [leaveSession, updateActiveSession],
  );

  const markActiveSessionAsRead = useCallback(async () => {
    if (!activeSessionIdRef.current) return;

    try {
      await chatApi.markAllAsRead(activeSessionIdRef.current);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionIdRef.current
            ? { ...session, unreadCount: 0 }
            : session,
        ),
      );

      const latestMessage = messages[messages.length - 1];
      if (latestMessage) {
        markAsRead(activeSessionIdRef.current, latestMessage.id);
      }
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    }
  }, [markAsRead, messages]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  useEffect(
    () => () => {
      if (activeSessionIdRef.current) {
        leaveSession(activeSessionIdRef.current);
      }
    },
    [leaveSession],
  );

  return {
    sessions,
    activeSession,
    messages,
    loadingSessions,
    loadingMessages,
    sending,
    uploading,
    error,
    deviceSwitchPrompt,
    connected,
    loadSessions,
    createNewSession,
    selectSession,
    sendTextMessage,
    uploadMedia,
    dismissDeviceSwitch,
    confirmCreateSessionFromSwitch,
    deleteSession,
    refreshActiveSession,
    markActiveSessionAsRead,
    setActiveSession: updateActiveSession,
    clearError,
  };
}
