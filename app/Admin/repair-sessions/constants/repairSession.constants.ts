import type {
  AssignmentAction,
  JobStatus,
} from "../types/repairSession.types";

export const JOB_STATUS_ORDER: JobStatus[] = [
  "AI_CONSULTING",
  "BROADCASTING",
  "MATCHED",
  "EN_ROUTE",
  "ARRIVED",
  "IN_PROGRESS",
  "COMPLETED",
  "DONE",
  "CANCELLED",
];

export const JOB_STATUS_OPTIONS: ReadonlyArray<{
  value: "ALL" | JobStatus;
  label: string;
}> = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "AI_CONSULTING", label: "AI tư vấn" },
  { value: "BROADCASTING", label: "Đang tìm thợ" },
  { value: "MATCHED", label: "Đã có thợ" },
  { value: "EN_ROUTE", label: "Đang di chuyển" },
  { value: "ARRIVED", label: "Đã tới nơi" },
  { value: "IN_PROGRESS", label: "Đang sửa" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "DONE", label: "Hoàn thành cũ" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export const ASSIGNMENT_ACTION_LABELS: Record<AssignmentAction, string> = {
  ASSIGNED: "Đã gán",
  UNASSIGNED: "Gỡ thợ",
  REJECTED: "Từ chối",
  MANUAL_CANCEL: "Hủy thủ công",
  SYSTEM_AUTO_CANCEL: "Hệ thống tự hủy",
};

export const REASSIGN_REASONS = [
  "Thợ không phản hồi",
  "Thợ ở quá xa",
  "Khách yêu cầu đổi thợ",
  "Điều phối viên chọn phương án tốt hơn",
  "Lý do khác",
] as const;

export const UNASSIGN_REASONS = [
  "Thợ không phản hồi",
  "Thợ báo không thể tiếp tục",
  "Điều phối viên đổi phương án",
  "Khách yêu cầu đổi thợ",
  "Lý do khác",
] as const;

export const CANCEL_REASONS = [
  "Khách không liên lạc được",
  "Địa chỉ không hợp lệ",
  "Rủi ro an toàn/ca bất thường",
  "Lý do khác",
] as const;
