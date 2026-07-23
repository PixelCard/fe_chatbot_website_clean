import type { AdminStatusPillTone } from "@/app/Admin/_shared/components/AdminStatusPill";

import type { JobStatus } from "../types/repairSession.types";

type StatusMeta = {
  label: string;
  description: string;
  badgeTone: AdminStatusPillTone;
  dotClass: string;
  priority: number;
};

export const repairSessionStatusMeta: Record<JobStatus, StatusMeta> = {
  AI_CONSULTING: {
    label: "AI tư vấn",
    description: "Khách đang trao đổi với AI",
    badgeTone: "neutral",
    dotClass: "bg-slate-500",
    priority: 1,
  },
  BROADCASTING: {
    label: "Đang tìm thợ",
    description: "Hệ thống đang phát ca cho thợ online",
    badgeTone: "warning",
    dotClass: "bg-amber-500",
    priority: 2,
  },
  MATCHED: {
    label: "Đã có thợ",
    description: "Thợ đã nhận ca",
    badgeTone: "success",
    dotClass: "bg-emerald-500",
    priority: 3,
  },
  EN_ROUTE: {
    label: "Đang di chuyển",
    description: "Thợ đang trên đường tới địa chỉ sửa chữa",
    badgeTone: "sky",
    dotClass: "bg-sky-500",
    priority: 4,
  },
  ARRIVED: {
    label: "Đã tới nơi",
    description: "Thợ đã tới điểm sửa chữa",
    badgeTone: "info",
    dotClass: "bg-cyan-500",
    priority: 5,
  },
  IN_PROGRESS: {
    label: "Đang sửa",
    description: "Ca đang được xử lý",
    badgeTone: "purple",
    dotClass: "bg-violet-500",
    priority: 6,
  },
  COMPLETED: {
    label: "Hoàn thành",
    description: "Ca đã hoàn thành",
    badgeTone: "success",
    dotClass: "bg-emerald-500",
    priority: 7,
  },
  DONE: {
    label: "Hoàn thành",
    description: "Trạng thái hoàn thành tương thích cũ",
    badgeTone: "success",
    dotClass: "bg-emerald-500",
    priority: 7,
  },
  CANCELLED: {
    label: "Đã hủy",
    description: "Ca đã bị hủy",
    badgeTone: "cancel",
    dotClass: "bg-rose-500",
    priority: 8,
  },
};
