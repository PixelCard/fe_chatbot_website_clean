"use client";

import { apiClient } from "@/app/services/apiClient";
import type {
  AiReasoningFilterState,
  AiReasoningLogItem,
  UpdateAiUsefulnessReviewPayload,
} from "../types/aiReasoning.types";

export type AiReasoningAdminQuery = Partial<AiReasoningFilterState>;

const ADMIN_AI_REASONING_BASE = "/api/admin/ai-reasoning-logs";

export const aiReasoningAdminService = {
  /** Gọi API danh sách log suy luận AI để admin theo dõi chất lượng trả lời. */
  getLogs(query?: AiReasoningAdminQuery) {
    return apiClient.get<AiReasoningLogItem[]>(ADMIN_AI_REASONING_BASE, query);
  },
  updateUsefulnessReview(logId: number, payload: UpdateAiUsefulnessReviewPayload) {
    return apiClient.patch<AiReasoningLogItem>(
      `${ADMIN_AI_REASONING_BASE}/${logId}/usefulness-review`,
      payload,
    );
  },
};
