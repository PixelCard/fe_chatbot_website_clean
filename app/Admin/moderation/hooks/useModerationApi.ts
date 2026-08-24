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
      const rawResolved = typeof window !== "undefined" ? localStorage.getItem("smartelec_resolved_moderation_ids") : null;
      const resolvedList: string[] = rawResolved ? JSON.parse(rawResolved) : [];

      const activeItems = result.items.filter((item) => !resolvedList.includes(item.id));

      setState({
        items: activeItems,
        summary: {
          dangerousSessions: activeItems.filter((i) => i.type === "dangerous-session").length,
          negativeReviews: activeItems.filter((i) => i.type === "negative-review").length,
          dislikedAiLogs: activeItems.filter((i) => i.type === "disliked-ai").length,
        },
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

  const resolveItem = useCallback(async (id: string) => {
    try {
      await moderationAdminService.resolveModerationItem(id);

      try {
        const rawResolved = localStorage.getItem("smartelec_resolved_moderation_ids");
        const resolvedList: string[] = rawResolved ? JSON.parse(rawResolved) : [];
        if (!resolvedList.includes(id)) {
          localStorage.setItem(
            "smartelec_resolved_moderation_ids",
            JSON.stringify([...resolvedList, id]),
          );
        }
      } catch {
        // ignore localStorage error
      }

      setState((prev) => {
        const updatedItems = prev.items.filter((item) => item.id !== id);
        return {
          ...prev,
          items: updatedItems,
          summary: {
            dangerousSessions: updatedItems.filter((i) => i.type === "dangerous-session").length,
            negativeReviews: updatedItems.filter((i) => i.type === "negative-review").length,
            dislikedAiLogs: updatedItems.filter((i) => i.type === "disliked-ai").length,
          },
        };
      });
    } catch {
      // ignore error
    }
  }, []);

  useEffect(() => {
    void fetchModerationQueue();
  }, [fetchModerationQueue]);

  return {
    ...state,
    refetch: fetchModerationQueue,
    resolveItem,
  };
}
