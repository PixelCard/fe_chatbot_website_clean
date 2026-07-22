import { apiClient } from "@/app/services/apiClient";
import type {
  ActivityItem,
  AiQuality,
  DeviceInsight,
  LiveJob,
  OverviewData,
  RevenueReportData,
  RevenueReportQuery,
  RevenuePoint,
  StatusPoint,
  Technician,
} from "../type/types";

type DashboardData = {
  overview: OverviewData;
  jobsByStatus: StatusPoint[];
  revenueSeries: RevenuePoint[];
  urgentJobs: (LiveJob & {
    customerName?: string;
    description?: string;
    assignedTechnician?: string;
    technicianPhone?: string;
    address?: string;
  })[];
  onlineTechnicians: Technician[];
  topAiDevices: DeviceInsight[];
  topRepairDevices: DeviceInsight[];
  aiQuality: AiQuality;
  recentActivities: ActivityItem[];
};

const ADMIN_DASHBOARD_BASE = "/api/admin/dashboard";

export const dashboardService = {
  /** Lấy toàn bộ snapshot dashboard từ resource admin riêng thay vì ghép nhiều request ở FE. */
  getDashboardData(): Promise<DashboardData> {
    return apiClient.get<DashboardData>(ADMIN_DASHBOARD_BASE);
  },

  getRevenueReport(query: RevenueReportQuery): Promise<RevenueReportData> {
    return apiClient.get<RevenueReportData>(
      `${ADMIN_DASHBOARD_BASE}/revenue-report`,
      query,
    );
  },
};
