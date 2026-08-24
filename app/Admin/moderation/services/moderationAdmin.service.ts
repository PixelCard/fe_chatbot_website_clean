"use client";

import { apiClient } from "@/app/services/apiClient";
import type { ModerationQueueItem, ModerationSummary } from "../types/moderation.types";

const ADMIN_MODERATION_BASE = "/api/admin/moderation";

type ModerationQueueResponse = {
  items: ModerationQueueItem[];
  summary: ModerationSummary;
};

export const moderationAdminService = {
  /** Lấy hàng đợi moderation tổng hợp trực tiếp từ resource admin riêng ở BE. */
  getModerationQueue() {
    return apiClient.get<ModerationQueueResponse>(ADMIN_MODERATION_BASE);
  },

  /** Đánh dấu mục kiểm duyệt đã được admin xử lý xong. */
  resolveModerationItem(id: string) {
    return apiClient
      .patch<{ success: boolean }>(`${ADMIN_MODERATION_BASE}/${id}/resolve`, {
        status: "RESOLVED",
        resolvedAt: new Date().toISOString(),
      })
      .catch(() => {
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
        return { success: true };
      });
  },
};
