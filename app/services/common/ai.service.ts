import { apiClient } from "@/app/services/apiClient";
import type { AiChatPayload, AiChatResponse, AiFeedbackPayload, AiFeedbackResponse } from "./types";

export const aiService = {
  /** Gọi POST /ai/chat để gửi một yêu cầu tới luồng chẩn đoán AI. */
  chat(payload: AiChatPayload) {
    return apiClient.post<AiChatResponse>("/api/ai/chat", payload);
  },

  /** Gọi PATCH /ai/messages/:logId/feedback để lưu phản hồi LIKE hoặc DISLIKE cho một bản ghi AI. */
  saveFeedback(logId: number, payload: AiFeedbackPayload) {
    return apiClient.patch<AiFeedbackResponse>(`/api/ai/messages/${logId}/feedback`, payload);
  },
};
