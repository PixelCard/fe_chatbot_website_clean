import { apiClient } from "@/app/services/apiClient";
import type {
  CandidateTechnician,
  ChatSession,
  SessionAssignmentHistory,
} from "../types/dispatch.types";

const ADMIN_DISPATCH_BASE = "/api/admin/dispatch";

type DispatchSnapshot = {
  sessions: ChatSession[];
  candidates: CandidateTechnician[];
  history: SessionAssignmentHistory[];
};

export const dispatchAdminService = {
  /** Tải snapshot điều phối hoàn chỉnh từ resource admin dispatch riêng của backend. */
  getDispatchData() {
    return apiClient.get<DispatchSnapshot>(ADMIN_DISPATCH_BASE);
  },

  /** Gọi BE để gán kỹ thuật viên cho một ca từ drawer điều phối. */
  assign(sessionId: string, technicianId: string) {
    return apiClient.post(`${ADMIN_DISPATCH_BASE}/${sessionId}/assign`, {
      technicianId: Number(technicianId),
    });
  },

  /** Gọi BE để gỡ kỹ thuật viên khỏi ca và trả ca về hàng chờ. */
  unassign(sessionId: string) {
    return apiClient.post(`${ADMIN_DISPATCH_BASE}/${sessionId}/unassign`);
  },

  /** Gọi BE để ghi nhận kỹ thuật viên từ chối và mở lại điều phối. */
  reject(sessionId: string) {
    return apiClient.post(`${ADMIN_DISPATCH_BASE}/${sessionId}/reject`);
  },

  /** Gọi BE để mô phỏng timeout phản hồi của kỹ thuật viên trên ca hiện tại. */
  simulateTimeout(sessionId: string) {
    return apiClient.post(`${ADMIN_DISPATCH_BASE}/${sessionId}/timeout`);
  },
};
