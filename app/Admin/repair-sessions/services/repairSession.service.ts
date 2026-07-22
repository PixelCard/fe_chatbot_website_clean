import { apiClient } from "@/app/services/apiClient";
import type { ChatSessionItem } from "@/app/services/common";

import type { RepairSession } from "../types/repairSession.types";

const ADMIN_REPAIR_SESSIONS_BASE = "/api/admin/repair-sessions";

export const repairSessionAdminService = {
  getRepairSessions() {
    return apiClient.get<RepairSession[]>(ADMIN_REPAIR_SESSIONS_BASE);
  },

  assignTechnician(sessionId: string, technicianId: string) {
    return apiClient.post<ChatSessionItem>(
      `${ADMIN_REPAIR_SESSIONS_BASE}/${sessionId}/assign`,
      { technicianId: Number(technicianId) },
    );
  },

  unassignTechnician(sessionId: string) {
    return apiClient.post<ChatSessionItem>(
      `${ADMIN_REPAIR_SESSIONS_BASE}/${sessionId}/unassign`,
    );
  },

  cancelRepairSession(sessionId: string) {
    return apiClient.post<ChatSessionItem>(
      `${ADMIN_REPAIR_SESSIONS_BASE}/${sessionId}/cancel`,
    );
  },
};
