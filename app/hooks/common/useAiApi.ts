"use client";

import { useCallback } from "react";
import { aiService, type AiChatPayload, type AiFeedbackPayload } from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useAiApi() {
  const { run, ...state } = useAsyncAction();

  /** Gửi một yêu cầu chat AI tới dịch vụ chẩn đoán của backend. */
  const chat = useCallback((payload: AiChatPayload) => run(() => aiService.chat(payload)), [run]);

  /** Lưu phản hồi LIKE hoặc DISLIKE cho một bản ghi suy luận AI. */
  const saveFeedback = useCallback((logId: number, payload: AiFeedbackPayload) => run(() => aiService.saveFeedback(logId, payload)), [run]);

  return {
    ...state,
    chat,
    saveFeedback,
  };
}
