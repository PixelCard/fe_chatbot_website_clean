"use client";

import { useCallback } from "react";
import {
  chatsService,
  type BookTechnicianPayload,
  type BulkSessionPayload,
  type CreateQuotePayload,
  type MessageListQuery,
  type ReviewPayload,
  type SendMessagePayload,
  type UpdateQuoteStatusPayload,
} from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useChatsApi() {
  const { run, ...state } = useAsyncAction();

  /** Lấy các phiên chat mà tài khoản hiện tại được phép xem. */
  const getSessions = useCallback(() => run(() => chatsService.getSessions()), [run]);

  /** Lấy các phiên sửa chữa đang hoạt động của người dùng hiện tại. */
  const getActiveRunningSessions = useCallback(() => run(() => chatsService.getActiveRunningSessions()), [run]);

  /** Lấy lịch sử sửa chữa của khách hàng hiện tại. */
  const getUserRepairHistory = useCallback(() => run(() => chatsService.getUserRepairHistory()), [run]);

  /** Lấy chi tiết một phiên chat theo id số. */
  const getSessionById = useCallback((sessionId: number) => run(() => chatsService.getSessionById(sessionId)), [run]);

  /** Lấy một trang tin nhắn của phiên chat. */
  const getMessages = useCallback((sessionId: number, query?: MessageListQuery) => run(() => chatsService.getMessages(sessionId, query)), [run]);

  /** Gửi một tin nhắn vào phiên chat. */
  const sendMessage = useCallback((sessionId: number, payload: SendMessagePayload) => run(() => chatsService.sendMessage(sessionId, payload)), [run]);

  /** Tạo một thẻ báo giá trong phiên chat. */
  const createQuote = useCallback((sessionId: number, payload: CreateQuotePayload) => run(() => chatsService.createQuote(sessionId, payload)), [run]);

  /** Tải lên một tin nhắn ảnh hoặc video vào phiên chat. */
  const uploadMediaMessage = useCallback((sessionId: number, file: File) => run(() => chatsService.uploadMediaMessage(sessionId, file)), [run]);

  /** Chấp nhận hoặc từ chối một tin nhắn thẻ báo giá. */
  const updateQuoteStatus = useCallback((messageId: number, payload: UpdateQuoteStatusPayload) => run(() => chatsService.updateQuoteStatus(messageId, payload)), [run]);

  /** Đánh dấu đã đọc cho một tin nhắn. */
  const markMessageAsRead = useCallback((messageId: number) => run(() => chatsService.markMessageAsRead(messageId)), [run]);

  /** Đánh dấu đã đọc toàn bộ tin nhắn trong một phiên cho tài khoản hiện tại. */
  const markAllAsRead = useCallback((sessionId: number) => run(() => chatsService.markAllAsRead(sessionId)), [run]);

  /** Chốt đặt thợ từ một phiên chat. */
  const bookTechnician = useCallback((sessionId: number, payload?: BookTechnicianPayload) => run(() => chatsService.bookTechnician(sessionId, payload)), [run]);

  /** Lấy các ca phát sóng dành cho luồng kỹ thuật viên. */
  const getBroadcastJobs = useCallback(() => run(() => chatsService.getBroadcastJobs()), [run]);

  /** Nhận một ca phát sóng với version hiện tại từ backend. */
  const acceptJob = useCallback((sessionId: number, currentVersion: number) => run(() => chatsService.acceptJob(sessionId, currentVersion)), [run]);

  /** Hủy một ca thuộc kỹ thuật viên. */
  const cancelTechnicianJob = useCallback((sessionId: number) => run(() => chatsService.cancelTechnicianJob(sessionId)), [run]);

  /** Xác nhận hoàn thành một ca của kỹ thuật viên. */
  const completeJob = useCallback((sessionId: number) => run(() => chatsService.completeJob(sessionId)), [run]);

  /** Chuyển một ca đã nhận sang trạng thái đang di chuyển. */
  const startMoving = useCallback((sessionId: number) => run(() => chatsService.startMoving(sessionId)), [run]);

  /** Xác nhận đã đến nơi cho một ca. */
  const confirmArrival = useCallback((sessionId: number) => run(() => chatsService.confirmArrival(sessionId)), [run]);

  /** Chuyển một ca đã đến nơi sang trạng thái đang sửa chữa. */
  const startRepair = useCallback((sessionId: number) => run(() => chatsService.startRepair(sessionId)), [run]);

  /** Gửi một đánh giá của khách hàng cho ca đã hoàn thành. */
  const submitReview = useCallback((sessionId: number, payload: ReviewPayload) => run(() => chatsService.submitReview(sessionId, payload)), [run]);

  /** Hủy một ca thuộc khách hàng. */
  const cancelUserJob = useCallback((sessionId: number) => run(() => chatsService.cancelUserJob(sessionId)), [run]);

  /** Yêu cầu điều phối lại cho một ca thuộc khách hàng. */
  const redispatchJob = useCallback((sessionId: number) => run(() => chatsService.redispatchJob(sessionId)), [run]);

  /** Xóa hàng loạt phiên chat theo danh sách id. */
  const deleteBulkSessions = useCallback((payload: BulkSessionPayload) => run(() => chatsService.deleteBulkSessions(payload)), [run]);

  /** Ẩn hàng loạt phiên chat theo danh sách id. */
  const hideBulkSessions = useCallback((payload: BulkSessionPayload) => run(() => chatsService.hideBulkSessions(payload)), [run]);

  return {
    ...state,
    getSessions,
    getActiveRunningSessions,
    getUserRepairHistory,
    getSessionById,
    getMessages,
    sendMessage,
    createQuote,
    uploadMediaMessage,
    updateQuoteStatus,
    markMessageAsRead,
    markAllAsRead,
    bookTechnician,
    getBroadcastJobs,
    acceptJob,
    cancelTechnicianJob,
    completeJob,
    startMoving,
    confirmArrival,
    startRepair,
    submitReview,
    cancelUserJob,
    redispatchJob,
    deleteBulkSessions,
    hideBulkSessions,
  };
}
