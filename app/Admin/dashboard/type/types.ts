export type JobStatus =
  | "AI_CONSULTING"
  | "BROADCASTING"
  | "MATCHED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type KpiItem = {
  key: string;
  label: string;
  value: string;
  hint: string;
  badge: string;
  href: string;
  tone: "good" | "warn" | "info" | "danger";
  icon: "jobs" | "broadcast" | "repair" | "done" | "money" | "tech";
};

export type OverviewData = {
  health: "stable" | "warning" | "critical";
  onlineTechnicians: number;
  broadcastingJobs: number;
  alerts: number;
  kpis: KpiItem[];
};

export type RevenuePoint = {
  date: string;
  jobs: number;
  revenue: number;
  milestone?: string;
};

export type RevenueReportGroupBy = "day" | "week" | "month";

export type RevenueReportQuery = {
  from?: string;
  to?: string;
  groupBy?: RevenueReportGroupBy;
};

export type RevenueReportPoint = {
  key: string;
  label: string;
  jobs: number;
  acceptedQuotes: number;
  revenue: number;
};

export type RevenueReportSummary = {
  totalRevenue: number;
  totalJobs: number;
  acceptedQuotes: number;
  averageOrderValue: number;
};

export type RevenueReportDetail = {
  sessionId: number;
  sessionStatus: JobStatus | "DONE";
  deviceType: string | null;
  symptom: string | null;
  customerName: string | null;
  customerPhone: string | null;
  technicianName: string | null;
  technicianPhone: string | null;
  createdAt: string;
  updatedAt: string;
  acceptedQuoteCount: number;
  acceptedRevenue: number;
  latestQuoteId: number | null;
  latestQuoteTitle: string | null;
  latestAcceptedAt: string | null;
};

export type RevenueReportData = {
  from: string;
  to: string;
  groupBy: RevenueReportGroupBy;
  summary: RevenueReportSummary;
  series: RevenueReportPoint[];
  details?: RevenueReportDetail[];
};

export type StatusPoint = {
  status: JobStatus;
  count: number;
};

export type LiveJob = {
  id: string;
  device: string;
  issue: string;
  status: JobStatus;
  severity: "Thấp" | "Trung bình" | "Cao" | "Nguy hiểm";
};

export type Technician = {
  id: string;
  name: string;
  expertise: string;
  activeJobs: number;
  rating: number;
  status: "Rảnh" | "Đang xử lý" | "Sắp bận";
};

export type DeviceInsight = {
  name: string;
  value: number;
};

export type AiQuality = {
  likes: number;
  dislikes: number;
  recentDislikes: string[];
};

export type ActivityItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
  type: "job" | "technician" | "quote" | "complete" | "ai";
};
