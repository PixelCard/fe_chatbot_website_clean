import type { AdminStatusPillTone } from "@/app/Admin/_shared/components/AdminStatusPill";

import type { RepairSession } from "../../types/repairSession.types";
import { formatTime } from "../../utils/repairSessionFormatters";
import { hasAssignedTechnician } from "../../utils/repairSessionRules";

export type DetailTab = "overview" | "ai" | "history";

export type DetailFlag = {
  label: string;
  tone: AdminStatusPillTone;
};

export type RepairSessionDetailView = {
  hasTechnician: boolean;
  missingPhone: boolean;
  missingAddress: boolean;
  updatedTime: string;
  nextTitle: string;
  nextDescription: string;
  flags: DetailFlag[];
};

export function createRepairSessionDetailView(
  session: RepairSession,
): RepairSessionDetailView {
  const hasTechnician = hasAssignedTechnician(session);
  const missingPhone = !session.contactPhone && !session.customer.phoneNumber;
  const missingAddress = !session.address;

  let nextTitle = "Tiếp tục theo dõi ca";
  let nextDescription = "Ca đang có đủ điều kiện cơ bản để tiếp tục xử lý.";

  if (session.isDangerous) {
    nextTitle = "Ưu tiên xác minh an toàn";
    nextDescription =
      "Ca có dấu hiệu nguy hiểm. Cần xác nhận hiện trường trước khi điều phối.";
  } else if (!hasTechnician) {
    nextTitle = "Gán kỹ thuật viên phù hợp";
    nextDescription = "Ca chưa có thợ phụ trách và cần mở điều phối.";
  } else if (missingPhone || missingAddress) {
    nextTitle = "Bổ sung thông tin liên hệ";
    nextDescription =
      "Nên hoàn thiện số điện thoại hoặc địa chỉ trước khi tiếp tục xử lý.";
  }

  const flags: DetailFlag[] = [
    {
      label: hasTechnician ? "Đã có thợ" : "Chưa có thợ",
      tone: hasTechnician ? "success" : "warning",
    },
    {
      label: missingPhone ? "Thiếu SĐT" : "Đã có SĐT",
      tone: missingPhone ? "warning" : "neutral",
    },
    {
      label: missingAddress ? "Thiếu địa chỉ" : "Đã có địa chỉ",
      tone: missingAddress ? "warning" : "neutral",
    },
  ];

  if (session.isDangerous) {
    flags.unshift({ label: "Cần xác minh an toàn", tone: "danger" });
  }

  return {
    hasTechnician,
    missingPhone,
    missingAddress,
    updatedTime: formatTime(session.updatedAt),
    nextTitle,
    nextDescription,
    flags,
  };
}
