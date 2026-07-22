import { apiClient } from "@/app/services/apiClient";
import type { Technician } from "../types/technician.types";

export const technicianAdminService = {
  /** Gọi GET /admin/technicians để lấy toàn bộ danh sách thợ cùng thống kê ca hiện tại. */
  getTechnicians() {
    return apiClient.get<Technician[]>("/api/admin/technicians");
  },
};
