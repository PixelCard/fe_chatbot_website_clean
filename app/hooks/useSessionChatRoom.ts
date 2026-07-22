'use client';

import { useCallback, useEffect, useState } from 'react';
import { chatsService, type ChatSessionItem, type MessageItem } from '@/app/services/common';
import type { ApiError } from '@/app/services/apiClient';
import { normalizeMessageList, type ChatViewerRole } from '@/app/components/chat-room/chatRoom.utils';

type UseSessionChatRoomOptions = {
  sessionId: number;
  viewerRole: ChatViewerRole;
};

type QuotePayload = {
  title: string;
  amount: number;
};

export function useSessionChatRoom({ sessionId }: UseSessionChatRoomOptions) {
  const [session, setSession] = useState<ChatSessionItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingQuoteMessageId, setPendingQuoteMessageId] = useState<number | null>(null);

  const fetchChatRoom = useCallback(
    async () =>
      Promise.all([
        chatsService.getSessionById(sessionId),
        chatsService.getMessages(sessionId, { limit: 100 }),
      ]),
    [sessionId],
  );

  const loadChatRoom = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [nextSession, nextMessages] = await fetchChatRoom();

      setSession(nextSession);
      setMessages(normalizeMessageList(nextMessages));
    } catch (requestError) {
      setError(requestError as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, [fetchChatRoom]);

  useEffect(() => {
    let isMounted = true;

    const runInitialLoad = async () => {
      try {
        const [nextSession, nextMessages] = await fetchChatRoom();

        if (!isMounted) return;

        setSession(nextSession);
        setMessages(normalizeMessageList(nextMessages));
      } catch (requestError) {
        if (!isMounted) return;

        setError(requestError as ApiError);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void runInitialLoad();

    return () => {
      isMounted = false;
    };
  }, [fetchChatRoom]);

  useEffect(() => {
    void chatsService.markAllAsRead(sessionId).catch(() => undefined);
  }, [sessionId, messages.length]);

  const sendTextMessage = useCallback(
    async (content: string) => {
      setIsSending(true);
      setError(null);

      try {
        await chatsService.sendMessage(sessionId, {
          type: 'TEXT',
          content: content.trim(),
        });
        await loadChatRoom();
      } catch (requestError) {
        setError(requestError as ApiError);
        throw requestError;
      } finally {
        setIsSending(false);
      }
    },
    [loadChatRoom, sessionId],
  );

  const createQuote = useCallback(
    async ({ title, amount }: QuotePayload) => {
      setIsCreatingQuote(true);
      setError(null);

      try {
        await chatsService.createQuote(sessionId, { title: title.trim(), amount });
        await loadChatRoom();
      } catch (requestError) {
        setError(requestError as ApiError);
        throw requestError;
      } finally {
        setIsCreatingQuote(false);
      }
    },
    [loadChatRoom, sessionId],
  );

  const respondToQuote = useCallback(
    async (messageId: number, status: 'ACCEPTED' | 'REJECTED') => {
      setPendingQuoteMessageId(messageId);
      setError(null);

      try {
        await chatsService.updateQuoteStatus(messageId, { status });
        await loadChatRoom();
      } catch (requestError) {
        setError(requestError as ApiError);
        throw requestError;
      } finally {
        setPendingQuoteMessageId(null);
      }
    },
    [loadChatRoom],
  );

  const uploadMedia = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);

      try {
        await chatsService.uploadMediaMessage(sessionId, file);
        await loadChatRoom();
      } catch (requestError) {
        setError(requestError as ApiError);
        throw requestError;
      } finally {
        setIsUploading(false);
      }
    },
    [loadChatRoom, sessionId],
  );

  return {
    session,
    messages,
    isLoading,
    error,
    isSending,
    isCreatingQuote,
    isUploading,
    pendingQuoteMessageId,
    reload: loadChatRoom,
    sendTextMessage,
    createQuote,
    respondToQuote,
    uploadMedia,
  };
}
