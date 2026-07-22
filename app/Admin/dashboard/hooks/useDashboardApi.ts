"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import { dashboardService } from "../services/dashboard.service";
import type {
  ActivityItem,
  AiQuality,
  DeviceInsight,
  LiveJob,
  OverviewData,
  RevenuePoint,
  StatusPoint,
  Technician,
} from "../type/types";

type DashboardState = {
  overview: OverviewData;
  jobsByStatus: StatusPoint[];
  revenueSeries: RevenuePoint[];
  urgentJobs: LiveJob[];
  onlineTechnicians: Technician[];
  topAiDevices: DeviceInsight[];
  topRepairDevices: DeviceInsight[];
  aiQuality: AiQuality;
  recentActivities: ActivityItem[];
  isLoading: boolean;
  error: ApiError | null;
};

const emptyOverview: OverviewData = {
  health: "stable",
  onlineTechnicians: 0,
  broadcastingJobs: 0,
  alerts: 0,
  kpis: [],
};

const emptyAiQuality: AiQuality = {
  likes: 0,
  dislikes: 0,
  recentDislikes: [],
};

/** Tải dữ liệu dashboard tổng hợp và quản lý trạng thái loading/error cho page admin. */
export function useDashboardApi() {
  const [state, setState] = useState<DashboardState>({
    overview: emptyOverview,
    jobsByStatus: [],
    revenueSeries: [],
    urgentJobs: [],
    onlineTechnicians: [],
    topAiDevices: [],
    topRepairDevices: [],
    aiQuality: emptyAiQuality,
    recentActivities: [],
    isLoading: true,
    error: null,
  });

  /** Tải toàn bộ dữ liệu dashboard đã được tổng hợp từ các service admin hiện có. */
  const fetchDashboard = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await dashboardService.getDashboardData();
      setState({
        ...data,
        urgentJobs: data.urgentJobs,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return {
    ...state,
    refetch: fetchDashboard,
  };
}
