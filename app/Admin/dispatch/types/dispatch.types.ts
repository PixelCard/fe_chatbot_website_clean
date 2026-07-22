export type JobStatus =
  | "AI_CONSULTING"
  | "BROADCASTING"
  | "MATCHED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export const JOB_STATUS_VI = {
  AI_CONSULTING: "AI đang tư vấn",
  BROADCASTING: "Chờ gán thợ",
  MATCHED: "Đã gán thợ",
  EN_ROUTE: "Thợ đang đến",
  ARRIVED: "Thợ đã đến nơi",
  IN_PROGRESS: "Đang sửa chữa",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
} as const;

export type AssignmentAction =
  | "ASSIGNED"
  | "UNASSIGNED"
  | "REJECTED"
  | "MANUAL_CANCEL"
  | "SYSTEM_AUTO_CANCEL";

export const ASSIGNMENT_ACTION_VI = {
  ASSIGNED: "Đã gán thợ",
  UNASSIGNED: "Đã hủy gán thợ",
  REJECTED: "Thợ từ chối nhận ca",
  MANUAL_CANCEL: "Admin hủy gán thủ công",
  SYSTEM_AUTO_CANCEL: "Hệ thống tự động hủy do hết giờ",
} as const;

export type CandidateTechnician = {
  id: string;
  fullName: string;
  phoneNumber: string;
  averageRating: number;
  activeJobCount: number;
  distance: number; // Khoảng cách tính bằng km
  isOnline: boolean;
  isActive: boolean;
  isVerified: boolean;
};

export type SessionAssignmentHistory = {
  id: string;
  sessionId: string;
  action: AssignmentAction;
  technicianName: string | null;
  operatorName: string; // Tên Admin thực hiện thao tác
  reason: string | null;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  symptom: string;      // Triệu chứng hư hỏng
  deviceType: string;   // Loại thiết bị (Ví dụ: Máy giặt, Điều hòa)
  address: string;      // Địa chỉ khách hàng
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  status: JobStatus;
  version: number;      // Optimistic lock
  customerName: string;
  customerPhone: string;
  technicianId: string | null;
  technician: CandidateTechnician | null;
};

export type DispatchSummary = {
  total: number;       // Tổng số đơn cần điều phối
  broadcasting: number; // Đang chờ gán thợ
  matched: number;      // Đã gán thợ thành công
  completed: number;    // Đã hoàn thành sửa chữa
};
