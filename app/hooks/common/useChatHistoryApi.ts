"use client";

import { useCallback } from "react";
import { chatHistoryService, type ChatHistoryPayload } from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useChatHistoryApi() {
  const { run, ...state } = useAsyncAction();

  /** Lưu một bản ghi lịch sử chẩn đoán cho người dùng hiện tại. */
  const saveHistory = useCallback((payload: ChatHistoryPayload) => run(() => chatHistoryService.saveHistory(payload)), [run]);

  /** Lấy các bản ghi lịch sử chẩn đoán của người dùng hiện tại. */
  const getHistory = useCallback(() => run(() => chatHistoryService.getHistory()), [run]);

  return {
    ...state,
    saveHistory,
    getHistory,
  };
}
