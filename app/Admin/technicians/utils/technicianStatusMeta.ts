import type {
  ActiveFilter,
  DisplayStatus,
  Gender,
  JobStatus,
  StatusFilter,
  Technician,
  VerificationFilter,
} from "../types/technician.types";

export const jobStatusLabel: Record<JobStatus, string> = {
  AI_CONSULTING: "Đang chat với AI",
  BROADCASTING: "Đang phát sóng tìm thợ",
  MATCHED: "Thợ đã nhận ca",
  EN_ROUTE: "Thợ đang di chuyển",
  ARRIVED: "Thợ đã đến nơi",
  IN_PROGRESS: "Đang sửa chữa",
  COMPLETED: "Hoàn thành",
  DONE: "Hoàn thành",
  CANCELLED: "Bị hủy",
};

export const displayStatusMeta: Record<
  DisplayStatus,
  { label: string; badgeClass: string }
> = {
  AVAILABLE: {
    label: "Đang rảnh",
    badgeClass:
      "border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-400 font-bold",
  },
  MATCHED: {
    label: "Đã nhận ca",
    badgeClass:
      "border border-sky-500/30 bg-sky-500/15 text-sky-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-sky-400 font-bold",
  },
  EN_ROUTE: {
    label: "Đang di chuyển",
    badgeClass:
      "border border-orange-500/30 bg-orange-500/15 text-orange-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-orange-400 font-bold",
  },
  ARRIVED: {
    label: "Đã đến nơi",
    badgeClass:
      "border border-purple-500/30 bg-purple-500/15 text-purple-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-purple-400 font-bold",
  },
  IN_PROGRESS: {
    label: "Đang sửa chữa",
    badgeClass:
      "border border-amber-500/30 bg-amber-500/15 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-400 font-bold",
  },
  OFFLINE: {
    label: "Offline",
    badgeClass:
      "border border-slate-500/30 bg-slate-500/15 text-slate-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-slate-400 font-bold",
  },
  LOCKED: {
    label: "Bị khóa",
    badgeClass:
      "border border-rose-500/30 bg-rose-500/15 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-400 font-bold",
  },
  UNVERIFIED: {
    label: "Chưa xác minh",
    badgeClass:
      "border border-amber-500/30 bg-amber-500/15 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-400 font-bold",
  },
};

export const statusFilterOptions: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "AVAILABLE", label: "Đang rảnh" },
  { value: "MATCHED", label: "Đã nhận ca" },
  { value: "EN_ROUTE", label: "Đang di chuyển" },
  { value: "ARRIVED", label: "Đã đến nơi" },
  { value: "IN_PROGRESS", label: "Đang sửa chữa" },
  { value: "OFFLINE", label: "Offline" },
  { value: "LOCKED", label: "Bị khóa" },
  { value: "UNVERIFIED", label: "Chưa xác minh" },
];

export const verificationFilterOptions: {
  value: VerificationFilter;
  label: string;
}[] = [
    { value: "ALL", label: "Tất cả xác minh" },
    { value: "VERIFIED", label: "Đã xác minh" },
    { value: "UNVERIFIED", label: "Chưa xác minh" },
  ];

export const activeFilterOptions: { value: ActiveFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả tài khoản" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "LOCKED", label: "Bị khóa" },
];

export function getTechnicianDisplayStatus(
  technician: Technician,
): DisplayStatus {
  if (!technician.isActive) return "LOCKED";
  if (!technician.isVerified) return "UNVERIFIED";
  if (!technician.isOnline) return "OFFLINE";

  const currentStatus = technician.currentJob?.status;

  if (currentStatus === "MATCHED") return "MATCHED";
  if (currentStatus === "EN_ROUTE") return "EN_ROUTE";
  if (currentStatus === "ARRIVED") return "ARRIVED";
  if (currentStatus === "IN_PROGRESS") return "IN_PROGRESS";

  return "AVAILABLE";
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);

  if (!words.length) return "KT";

  return words
    .slice(-2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value || typeof value !== "string") {
    return "--";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsedDate);
}

export function formatGender(gender: Gender): string {
  if (gender === "MALE") return "Nam";
  if (gender === "FEMALE") return "Nữ";
  return "Khác";
}

export function shortAddress(address: string): string {
  if (address.length <= 36) return address;
  return `${address.slice(0, 36)}...`;
}

export function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
}
