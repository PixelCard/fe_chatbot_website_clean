"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import { aiReasoningAdminService, type AiReasoningAdminQuery } from "../services";
import type { AiReasoningLogItem } from "../types/aiReasoning.types";

type AiReasoningLogsState = {
  items: AiReasoningLogItem[];
  isLoading: boolean;
  error: ApiError | null;
};

/** Tải log suy luận AI thật từ backend và quản lý trạng thái cho trang admin. */
export function useAiReasoningLogsApi(query?: AiReasoningAdminQuery) {
  const [state, setState] = useState<AiReasoningLogsState>({
    items: [],
    isLoading: true,
    error: null,
  });

  /** Gọi API log AI và cập nhật state của màn giám sát suy luận. */
  const fetchLogs = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const items = await aiReasoningAdminService.getLogs(query);
      setState({
        items,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        items: [],
        isLoading: false,
        error: error as ApiError,
      });
    }
  }, [query]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return {
    ...state,
    refetch: fetchLogs,
  };
}
