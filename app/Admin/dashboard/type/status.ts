import type { JobStatus } from "./types";

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  AI_CONSULTING: "Đang tư vấn AI",
  BROADCASTING: "Đang tìm thợ",
  MATCHED: "Đã có thợ nhận",
  EN_ROUTE: "Thợ đang di chuyển",
  ARRIVED: "Thợ đã đến nơi",
  IN_PROGRESS: "Đang sửa chữa",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export function getStatusTone(status: JobStatus): "good" | "warn" | "info" | "danger" {
  if (status === "COMPLETED") return "good";
  if (status === "CANCELLED") return "danger";
  if (status === "BROADCASTING" || status === "EN_ROUTE") return "warn";
  return "info";
}
