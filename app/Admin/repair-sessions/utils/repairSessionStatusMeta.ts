import type { JobStatus } from "../types/repairSession.types";

type StatusMeta = {
  label: string;
  description: string;
  badgeClass: string;
  dotClass: string;
  priority: number;
};

export const repairSessionStatusMeta: Record<JobStatus, StatusMeta> = {
  AI_CONSULTING: {
    label: "AI tư vấn",
    description: "Khách đang trao đổi với AI",
    badgeClass:
      "border-slate-200 bg-slate-100 text-slate-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-slate-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-slate-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-slate-200",
    dotClass: "bg-slate-500",
    priority: 1,
  },
  BROADCASTING: {
    label: "Đang tìm thợ",
    description: "Hệ thống đang phát ca cho thợ online",
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300",
    dotClass: "bg-amber-500",
    priority: 2,
  },
  MATCHED: {
    label: "Đã có thợ",
    description: "Thợ đã nhận ca",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-300",
    dotClass: "bg-emerald-500",
    priority: 3,
  },
  EN_ROUTE: {
    label: "Đang di chuyển",
    description: "Thợ đang trên đường tới địa chỉ sửa chữa",
    badgeClass:
      "border-sky-200 bg-sky-50 text-sky-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-sky-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-sky-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-sky-300",
    dotClass: "bg-sky-500",
    priority: 4,
  },
  ARRIVED: {
    label: "Đã tới nơi",
    description: "Thợ đã tới điểm sửa chữa",
    badgeClass:
      "border-cyan-200 bg-cyan-50 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300",
    dotClass: "bg-cyan-500",
    priority: 5,
  },
  IN_PROGRESS: {
    label: "Đang sửa",
    description: "Ca đang được xử lý",
    badgeClass:
      "border-violet-200 bg-violet-50 text-violet-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-violet-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-violet-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-violet-300",
    dotClass: "bg-violet-500",
    priority: 6,
  },
  COMPLETED: {
    label: "Hoàn thành",
    description: "Ca đã hoàn thành",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-300",
    dotClass: "bg-emerald-500",
    priority: 7,
  },
  DONE: {
    label: "Hoàn thành",
    description: "Trạng thái hoàn thành tương thích cũ",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-300",
    dotClass: "bg-emerald-500",
    priority: 7,
  },
  CANCELLED: {
    label: "Đã hủy",
    description: "Ca đã bị hủy",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300",
    dotClass: "bg-rose-500",
    priority: 8,
  },
};
