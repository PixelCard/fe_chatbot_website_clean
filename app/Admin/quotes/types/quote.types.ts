export type QuoteLifecycleStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface QuoteHistoryEntry {
  id: string;
  action: string;
  actor: string;
  at: string;
  note?: string;
}

export interface QuoteMachineShift {
  id: string;
  machineCode: string;
  shiftCode: string;
  startedAt: string;
  endedAt?: string;
}

export interface QuoteItem {
  id: string;
  sessionId: string;
  technicianId: string;
  customerName: string;
  customerPhone: string;
  technicianName: string;
  deviceName: string;
  issueSummary: string;
  totalAmount: number;
  currency: "VND";
  status: QuoteLifecycleStatus;
  createdAt: string;
  updatedAt: string;
  validUntil?: string;
  sessionStatus: string;
  waitingMinutes: number;
  isOverdueLv1: boolean;
  isOverdueLv2: boolean;
  isStateMismatch: boolean;
  isCurrentQuote: boolean;
  isAbnormalAmount: boolean;
  address: string; // Thêm trường này để khớp với mock dữ liệu địa điểm ca máy
  history: QuoteHistoryEntry[];
  machineShifts: QuoteMachineShift[];
}

// KHẮC PHỤC LỖI TRÊN ẢNH: Thêm chính xác các trường lọc sâu mở rộng
export interface QuoteFilterState {
  keyword: string;
  status: "all" | QuoteLifecycleStatus;
  address: string;         // KHẮC PHỤC LỖI
  technicianName: string;  // KHẮC PHỤC LỖI
  minAmount: string;
  maxAmount: string;
  isOverdue: boolean;
  isMismatch: boolean;
}

// Biến khởi tạo mặc định chuẩn cho phân hệ báo giá
export const defaultQuoteFilters: QuoteFilterState = {
  keyword: "",
  status: "all",
  address: "",
  technicianName: "",
  minAmount: "",
  maxAmount: "",
  isOverdue: false,
  isMismatch: false,
};