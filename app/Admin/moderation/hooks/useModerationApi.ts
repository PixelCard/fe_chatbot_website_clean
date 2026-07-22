"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import { moderationAdminService } from "../services";
import type { ModerationQueueItem, ModerationSummary } from "../types/moderation.types";

type ModerationState = {
  items: ModerationQueueItem[];
  summary: ModerationSummary;
  isLoading: boolean;
  error: ApiError | null;
};

const emptySummary: ModerationSummary = {
  dangerousSessions: 0,
  negativeReviews: 0,
  dislikedAiLogs: 0,
};

/** Tải hàng chờ moderation thật từ backend để admin xử lý các điểm nóng. */
export function useModerationApi() {
  const [state, setState] = useState<ModerationState>({
    items: [],
    summary: emptySummary,
    isLoading: true,
    error: null,
  });

  /** Gọi service moderation tổng hợp và cập nhật dữ liệu hiển thị cho page. */
  const fetchModerationQueue = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await moderationAdminService.getModerationQueue();
      setState({
        items: result.items,
        summary: result.summary,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        items: [],
        summary: emptySummary,
        isLoading: false,
        error: error as ApiError,
      });
    }
  }, []);

  useEffect(() => {
    void fetchModerationQueue();
  }, [fetchModerationQueue]);

  return {
    ...state,
    refetch: fetchModerationQueue,
  };
}
