export type ReviewTag =
  | "Đúng giờ"
  | "Nhiệt tình"
  | "Giá hợp lý"
  | "Tư vấn rõ ràng"
  | "Sửa nhanh"
  | "Thái độ tốt"
  | "Chưa đúng hẹn"
  | "Phát sinh chi phí"
  | "Không hài lòng";

export type ReviewItem = {
  id: number;
  sessionId: number;
  sessionCode: string;

  userId: number;
  customerName: string;
  customerPhone: string;

  technicianId: number;
  technicianName: string;
  technicianPhone: string;

  rating: number;
  comment: string | null;
  tags: ReviewTag[];

  repairServiceName: string;
  address: string;

  createdAt: string;
};

export type ReviewFilterState = {
  search: string;
  rating: "ALL" | "5" | "4" | "3" | "2" | "1";
  createdRange: "ALL" | "TODAY" | "LAST_7_DAYS" | "THIS_MONTH";
  sentiment: "ALL" | "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  tag: "ALL" | ReviewTag;
  technicianId: "ALL" | string;
  customerId: "ALL" | string;
};
