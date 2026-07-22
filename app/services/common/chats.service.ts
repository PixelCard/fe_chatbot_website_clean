import { apiClient } from "@/app/services/apiClient";
import type {
  BookTechnicianPayload,
  BookTechnicianResponse,
  BroadcastJobItem,
  ChatSessionItem,
  CreateQuoteResponse,
  CreateQuotePayload,
  JobActionResponse,
  MessageItem,
  ReadAllMessagesResponse,
  ReviewPayload,
  ReviewSubmitResponse,
  SendMessagePayload,
  UpdateQuoteStatusResponse,
  UpdateQuoteStatusPayload,
} from "./types";

export type MessageListQuery = {
  cursor?: number;
  limit?: number;
};

export type BulkSessionPayload = {
  ids: number[];
};

export const chatsService = {
  /** Gọi GET /chats để lấy các phiên chat mà người dùng hiện tại được phép thấy. */
  getSessions() {
    return apiClient.get<ChatSessionItem[]>("/api/chats");
  },

  /** Gọi GET /chats/active/running để lấy các phiên sửa chữa đang hoạt động của người dùng hiện tại. */
  getActiveRunningSessions() {
    return apiClient.get<ChatSessionItem[]>("/api/chats/active/running");
  },

  /** Gọi GET /chats/user/history để lấy lịch sử sửa chữa của khách hàng hiện tại. */
  getUserRepairHistory() {
    return apiClient.get<ChatSessionItem[]>("/api/chats/user/history");
  },

  /** Gọi GET /chats/:id để lấy chi tiết một phiên chat cùng thông tin người tham gia và đánh giá. */
  getSessionById(sessionId: number) {
    return apiClient.get<ChatSessionItem>(`/api/chats/${sessionId}`);
  },

  /** Gọi GET /chats/:id/messages để lấy tin nhắn theo cơ chế phân trang cursor của backend. */
  getMessages(sessionId: number, query?: MessageListQuery) {
    return apiClient.get<MessageItem[]>(`/api/chats/${sessionId}/messages`, query);
  },

  /** Gọi POST /chats/:id/messages để gửi một tin nhắn vào phiên chat. */
  sendMessage(sessionId: number, payload: SendMessagePayload) {
    return apiClient.post<MessageItem>(`/api/chats/${sessionId}/messages`, payload);
  },

  /** Gọi POST /chats/:id/quotes để tạo một thẻ báo giá từ tài khoản kỹ thuật viên. */
  createQuote(sessionId: number, payload: CreateQuotePayload) {
    return apiClient.post<CreateQuoteResponse>(`/api/chats/${sessionId}/quotes`, payload);
  },

  /** Gọi POST /chats/:id/image để tải lên một file media trong phiên chat bằng multipart/form-data. */
  uploadMediaMessage(sessionId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<{ message: string; fileUrl: string; data: MessageItem }>(`/api/chats/${sessionId}/image`, formData);
  },

  /** Gọi PATCH /chats/messages/:messageId/quote để chấp nhận hoặc từ chối một thẻ báo giá. */
  updateQuoteStatus(messageId: number, payload: UpdateQuoteStatusPayload) {
    return apiClient.patch<UpdateQuoteStatusResponse>(`/api/chats/messages/${messageId}/quote`, payload);
  },

  /** Gọi PATCH /chats/messages/:messageId/read để đánh dấu đã đọc cho một tin nhắn. */
  markMessageAsRead(messageId: number) {
    return apiClient.patch<MessageItem>(`/api/chats/messages/${messageId}/read`);
  },

  /** Gọi PATCH /chats/:id/read-all để đánh dấu đã đọc toàn bộ tin nhắn trong phiên hiện tại. */
  markAllAsRead(sessionId: number) {
    return apiClient.patch<ReadAllMessagesResponse>(`/api/chats/${sessionId}/read-all`);
  },

  /** Gọi POST /chats/:id/book để chuyển phiên chat sang trạng thái phát sóng tìm thợ. */
  bookTechnician(sessionId: number, payload?: BookTechnicianPayload) {
    return apiClient.post<BookTechnicianResponse>(`/api/chats/${sessionId}/book`, payload);
  },

  /** Gọi GET /chats/technician/jobs/broadcast để lấy danh sách ca đang phát sóng cho kỹ thuật viên. */
  getBroadcastJobs() {
    return apiClient.get<BroadcastJobItem[]>("/api/chats/technician/jobs/broadcast");
  },

  /** Gọi POST /chats/technician/jobs/:id/accept để kỹ thuật viên nhận một ca phát sóng. */
  acceptJob(sessionId: number, currentVersion: number) {
    return apiClient.post<JobActionResponse>(`/api/chats/technician/jobs/${sessionId}/accept`, { currentVersion });
  },

  /** Gọi POST /chats/technician/jobs/:id/cancel để kỹ thuật viên hủy một ca đang nhận. */
  cancelTechnicianJob(sessionId: number) {
    return apiClient.post<JobActionResponse>(`/api/chats/technician/jobs/${sessionId}/cancel`);
  },

  /** Gọi POST /chats/technician/jobs/:id/complete để kỹ thuật viên xác nhận hoàn thành ca. */
  completeJob(sessionId: number) {
    return apiClient.post<JobActionResponse>(`/api/chats/technician/jobs/${sessionId}/complete`);
  },

  /** Gọi POST /chats/technician/jobs/:id/start-moving để chuyển ca sang trạng thái đang di chuyển. */
  startMoving(sessionId: number) {
    return apiClient.post<ChatSessionItem>(`/api/chats/technician/jobs/${sessionId}/start-moving`);
  },

  /** Gọi POST /chats/technician/jobs/:id/arrived để xác nhận kỹ thuật viên đã đến nơi. */
  confirmArrival(sessionId: number) {
    return apiClient.post<ChatSessionItem>(`/api/chats/technician/jobs/${sessionId}/arrived`);
  },

  /** Gọi POST /chats/technician/jobs/:id/start-repair để chuyển ca sang trạng thái đang sửa chữa. */
  startRepair(sessionId: number) {
    return apiClient.post<ChatSessionItem>(`/api/chats/technician/jobs/${sessionId}/start-repair`);
  },

  /** Gọi POST /chats/user/jobs/:id/review để khách hàng gửi đánh giá cho ca đã hoàn thành. */
  submitReview(sessionId: number, payload: ReviewPayload) {
    return apiClient.post<ReviewSubmitResponse>(`/api/chats/user/jobs/${sessionId}/review`, payload);
  },

  /** Gọi POST /chats/user/jobs/:id/cancel để khách hàng hủy một ca. */
  cancelUserJob(sessionId: number) {
    return apiClient.post<ChatSessionItem>(`/api/chats/user/jobs/${sessionId}/cancel`);
  },

  /** Gọi POST /chats/user/jobs/:id/redispatch để yêu cầu điều phối kỹ thuật viên khác. */
  redispatchJob(sessionId: number) {
    return apiClient.post<ChatSessionItem>(`/api/chats/user/jobs/${sessionId}/redispatch`);
  },

  /** Gọi DELETE /chats/sessions/bulk để xóa hàng loạt phiên chat theo danh sách id. */
  deleteBulkSessions(payload: BulkSessionPayload) {
    return apiClient.delete<unknown>("/api/chats/sessions/bulk", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },

  /** Gọi PATCH /chats/sessions/hide-bulk để ẩn hàng loạt phiên chat theo danh sách id. */
  hideBulkSessions(payload: BulkSessionPayload) {
    return apiClient.patch<unknown>("/api/chats/sessions/hide-bulk", payload);
  },
};
