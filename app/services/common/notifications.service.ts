import { apiClient } from "@/app/services/apiClient";
import type { NotificationTestPayload, NotificationTestResponse } from "./types";

export const notificationsService = {
  /** Gọi POST /notifications/test để kích hoạt một thông báo thử nghiệm từ backend. */
  sendTestNotification(payload: NotificationTestPayload) {
    return apiClient.post<NotificationTestResponse>("/api/notifications/test", payload);
  },
};
