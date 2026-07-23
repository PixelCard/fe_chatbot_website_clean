import { apiClient } from "@/app/services/apiClient";
import type { ChatSessionItem } from "@/app/services/common";
import { technicianAdminService } from "../../technicians/services";
import type { Technician as AdminTechnician } from "../../technicians/types/technician.types";

export type AdminSessionListQuery = {
  keyword?: string;
  status?: string;
  address?: string;
  technicianName?: string;
  isDangerous?: boolean;
};

const ADMIN_CHATS_BASE = "/api/admin/chats";
const ADMIN_CHATS_FULL_CONVERSATIONS_PATH = `${ADMIN_CHATS_BASE}/full-conversations`;

function toChatQuery(query?: AdminSessionListQuery) {
  if (!query) return undefined;

  return {
    keyword: query.keyword,
    status: query.status,
    address: query.address,
    technicianName: query.technicianName,
    isDangerous: query.isDangerous,
  };
}

/** Lấy danh sách phiên chat admin ở dạng list để giảm số lần gọi detail không cần thiết. */
export function getAdminChatSessions(query?: AdminSessionListQuery) {
  return apiClient.get<ChatSessionItem[]>(ADMIN_CHATS_BASE, toChatQuery(query));
}

/** Lấy đầy đủ message của từng phiên chat để map sang quotes/repair/dispatch. */
export async function getAdminChatSessionDetails(query?: AdminSessionListQuery) {
  return apiClient.get<ChatSessionItem[]>(
    ADMIN_CHATS_FULL_CONVERSATIONS_PATH,
    toChatQuery(query),
  );
}

/** Lấy danh sách kỹ thuật viên admin để enrich thông tin điều phối. */
export function getAdminTechnicians() {
  return technicianAdminService.getTechnicians();
}

export function buildTechnicianMap(technicians: AdminTechnician[]) {
  return new Map(technicians.map((item) => [item.id, item]));
}
