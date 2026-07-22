import { apiClient } from "@/app/services/apiClient";
import type { ChatHistoryItem, ChatHistoryPayload, ChatHistorySaveResponse } from "./types";

export const chatHistoryService = {
  /** Gọi POST /chats/save để lưu một mục lịch sử chẩn đoán của người dùng hiện tại. */
  saveHistory(payload: ChatHistoryPayload) {
    return apiClient.post<ChatHistorySaveResponse>("/api/chats/save", payload);
  },

  /** Gọi GET /chats/history để lấy lịch sử chẩn đoán đã lưu của người dùng hiện tại. */
  getHistory() {
    return apiClient.get<ChatHistoryItem[]>("/api/chats/history");
  },
};
