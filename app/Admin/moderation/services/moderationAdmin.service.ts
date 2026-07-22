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
};
