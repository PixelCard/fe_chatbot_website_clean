"use client";

import { useCallback } from "react";
import { notificationsService, type NotificationTestPayload } from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useNotificationsApi() {
  const { run, ...state } = useAsyncAction();

  /** Gửi một yêu cầu thử thông báo tới backend. */
  const sendTestNotification = useCallback((payload: NotificationTestPayload) => run(() => notificationsService.sendTestNotification(payload)), [run]);

  return {
    ...state,
    sendTestNotification,
  };
}
