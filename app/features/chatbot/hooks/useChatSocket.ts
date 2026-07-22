"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type {
  ChatMessage,
  ChatMessageType,
  DeviceSwitchDetectedPayload,
} from "../types/chat.types";
import { isChatMessage, isDeviceSwitchDetected } from "../types/chat.types";

type MessageDeliveredPayload = {
  tempId?: string;
  savedMessage?: ChatMessage;
  message?: ChatMessage;
};

type SocketMessagePayload = {
  sessionId: number;
  content: string;
  type?: ChatMessageType;
  deviceType?: string;
  symptom?: string;
  metadata?: Record<string, unknown>;
  tempId?: string;
};

type UseChatSocketOptions = {
  enabled?: boolean;
  token?: string | null;
  onNewMessage?: (message: ChatMessage) => void;
  onMessageDelivered?: (payload: MessageDeliveredPayload) => void;
  onInboxUpdate?: (payload: unknown) => void;
  onJobStatusChanged?: (payload: unknown) => void;
  onQuoteUpdated?: (payload: unknown) => void;
  onDeviceSwitchDetected?: (payload: DeviceSwitchDetectedPayload) => void;
  onError?: (message: string, raw?: unknown) => void;
};

function resolveSocketUrl() {
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();
  if (baseUrl) {
    return baseUrl.replace(/\/api\/?$/i, "").replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

function getErrorMessage(payload: unknown) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (
    payload &&
    typeof payload === "object" &&
    typeof (payload as { message?: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }

  return "Không thể kết nối realtime cho phiên chat.";
}

export function useChatSocket(options: UseChatSocketOptions) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const optionsRef = useRef(options);

  optionsRef.current = options;

  useEffect(() => {
    if (!options.enabled || !options.token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = io(resolveSocketUrl(), {
      auth: { token: options.token },
      autoConnect: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleNewMessage = (payload: unknown) => {
      if (isChatMessage(payload)) {
        optionsRef.current.onNewMessage?.(payload);
      }
    };
    const handleMessageDelivered = (payload: unknown) => {
      const safePayload =
        payload && typeof payload === "object" ? (payload as MessageDeliveredPayload) : {};
      optionsRef.current.onMessageDelivered?.(safePayload);
    };
    const handleInboxUpdate = (payload: unknown) => {
      optionsRef.current.onInboxUpdate?.(payload);
    };
    const handleJobStatusChanged = (payload: unknown) => {
      optionsRef.current.onJobStatusChanged?.(payload);
    };
    const handleQuoteUpdated = (payload: unknown) => {
      optionsRef.current.onQuoteUpdated?.(payload);
    };
    const handleDeviceSwitchDetected = (payload: unknown) => {
      if (isDeviceSwitchDetected(payload)) {
        optionsRef.current.onDeviceSwitchDetected?.(payload);
      }
    };
    const handleErrorMessage = (payload: unknown) => {
      optionsRef.current.onError?.(getErrorMessage(payload), payload);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("new_message", handleNewMessage);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("inbox_update", handleInboxUpdate);
    socket.on("job_status_changed", handleJobStatusChanged);
    socket.on("quote_updated", handleQuoteUpdated);
    socket.on("device_switch_detected", handleDeviceSwitchDetected);
    socket.on("error_message", handleErrorMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("new_message", handleNewMessage);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("inbox_update", handleInboxUpdate);
      socket.off("job_status_changed", handleJobStatusChanged);
      socket.off("quote_updated", handleQuoteUpdated);
      socket.off("device_switch_detected", handleDeviceSwitchDetected);
      socket.off("error_message", handleErrorMessage);
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      setConnected(false);
    };
  }, [options.enabled, options.token]);

  const joinSession = useCallback((sessionId: number) => {
    socketRef.current?.emit("join_room", { sessionId });
  }, []);

  const leaveSession = useCallback((sessionId: number) => {
    socketRef.current?.emit("leave_room", { sessionId });
  }, []);

  const sendSocketMessage = useCallback((payload: SocketMessagePayload) => {
    const metadata = payload.tempId
      ? { ...(payload.metadata ?? {}), tempId: payload.tempId }
      : payload.metadata;

    socketRef.current?.emit("send_message", {
      sessionId: payload.sessionId,
      content: payload.content,
      type: payload.type ?? "TEXT",
      deviceType: payload.deviceType,
      symptom: payload.symptom,
      metadata,
    });
  }, []);

  const markAsRead = useCallback((sessionId: number, messageId?: number) => {
    if (!messageId) return;
    socketRef.current?.emit("mark_as_read", { sessionId, messageId });
  }, []);

  return {
    socket: socketRef.current,
    connected,
    joinSession,
    leaveSession,
    sendSocketMessage,
    markAsRead,
  };
}
