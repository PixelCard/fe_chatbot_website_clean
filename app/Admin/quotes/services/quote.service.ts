import { apiClient } from "@/app/services/apiClient";
import type { QuoteItem, QuoteLifecycleStatus } from "../types/quote.types";

export type QuoteListQuery = {
  keyword?: string;
  status?: QuoteLifecycleStatus;
  address?: string;
  technicianName?: string;
  minAmount?: number;
  maxAmount?: number;
  isOverdue?: boolean;
  isMismatch?: boolean;
};

const ADMIN_QUOTES_BASE = "/api/admin/quotes";

export const quoteAdminService = {
  /** Lấy danh sách báo giá admin từ resource BE riêng thay vì bóc tách gián tiếp ở FE. */
  getQuotes(query?: QuoteListQuery) {
    return apiClient.get<QuoteItem[]>(ADMIN_QUOTES_BASE, query);
  },
};
