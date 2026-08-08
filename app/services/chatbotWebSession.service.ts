import { apiClient } from "@/app/services/apiClient";
import type {
  BookTechnicianPayload,
  BookTechnicianResponse,
  ChatSessionItem,
  MessageItem,
} from "@/app/services/common";

export type CreateChatbotWebSessionPayload = {
  deviceType: string;
  symptom: string;
  firstMessage?: string;
};

export const chatbotWebSessionService = {
  /** Tạo ChatSession riêng cho web chatbot qua cụm chats-web. */
  createSession(payload: CreateChatbotWebSessionPayload) {
    return apiClient.post<ChatSessionItem>("/api/chats-web/sessions", payload);
  },

  /** Lấy metadata một phiên chatbot web để hydrate lại header, panel và trạng thái. */
  getSessionById(sessionId: number) {
    return apiClient.get<ChatSessionItem>(`/api/chats-web/${sessionId}`);
  },

  /** Lấy transcript của một phiên chatbot web đã tồn tại. */
  getMessages(sessionId: number) {
    return apiClient.get<MessageItem[]>(`/api/chats-web/${sessionId}/messages`);
  },

  /** Chuyển phiên AI web sang bước gọi thợ. */
  bookTechnician(sessionId: number, payload?: BookTechnicianPayload) {
    return apiClient.post<BookTechnicianResponse>(
      `/api/chats-web/${sessionId}/book`,
      payload,
    );
  },
};
