"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import type { ChatSession } from "../types/chat.types";
import { adminChatsService, type ChatSessionListQuery } from "../services";

type UseChatsState = {
  items: ChatSession[];
  isLoading: boolean;
  error: ApiError | null;
};

export function useChatsApi(initialQuery?: ChatSessionListQuery) {
  const [query, setQuery] = useState<ChatSessionListQuery | undefined>(initialQuery);
  const [state, setState] = useState<UseChatsState>({
    items: [],
    isLoading: true,
    error: null,
  });
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  const fetchSessions = useCallback(async (nextQuery?: ChatSessionListQuery) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const items = await adminChatsService.getSessions(nextQuery ?? query);
      setSelectedSession((prev) =>
        prev ? items.find((item) => item.id === prev.id) ?? prev : prev,
      );
      setState({ items, isLoading: false, error: null });
      return items;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as ApiError,
      }));
      return [];
    }
  }, [query]);

  useEffect(() => {
    void fetchSessions(initialQuery);
  }, [fetchSessions, initialQuery]);

  const updateQuery = useCallback((nextQuery: ChatSessionListQuery) => {
    setQuery(nextQuery);
    void fetchSessions(nextQuery);
  }, [fetchSessions]);

  const refetch = useCallback(() => fetchSessions(query), [fetchSessions, query]);

  const loadSessionDetail = useCallback(async (sessionId: string) => {
    const existing = state.items.find((item) => item.id === sessionId);

    if (existing) {
      setSelectedSession(existing);
    }

    try {
      const detail = await adminChatsService.getSessionById(sessionId);
      setSelectedSession(detail);
      setState((prev) => ({
        ...prev,
        items: prev.items.some((item) => item.id === detail.id)
          ? prev.items.map((item) => (item.id === detail.id ? detail : item))
          : [...prev.items, detail],
      }));
      return detail;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as ApiError,
      }));
      return existing ?? null;
    }
  }, [state.items]);

  return {
    ...state,
    selectedSession,
    updateQuery,
    refetch,
    loadSessionDetail,
  };
}
