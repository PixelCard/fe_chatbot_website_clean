export type SenderType = "USER" | "AI" | "TECHNICIAN" | "SYSTEM";

export type ChatMessage = {
    id: string;
    sessionId: string;
    senderType: SenderType;
    content: string;
    createdAt: string;
};

export type ChatSession = {
    id: string;
    status: string;
    userId: string;
    customerName: string;
    customerPhone: string;
    technicianId: string | null;
    technicianName: string | null;
    isDangerous: boolean;
    isFlagged: boolean;
    flagReason?: string | null;
    lastMessage: string;
    updatedAt: string;
    address: string; // Thêm trường địa chỉ thực địa vào đây
    messages: ChatMessage[];
};

// Cấu trúc State bộ lọc mở rộng
export type ChatFilterState = {
    search: string;       // Tìm nhanh theo ID, Tên khách, SĐT
    status: string;       // Lọc theo trạng thái
    address: string;      // Tìm theo địa chỉ thực địa
    technicianName: string; // Tìm theo tên thợ phụ trách
    isDangerous: "ALL" | "YES";
    isFlagged: "ALL" | "YES";
    startDate: string;
    endDate: string;
};

export const defaultChatFilters: ChatFilterState = {
    search: "",
    status: "ALL",
    address: "",
    technicianName: "",
    isDangerous: "ALL",
    isFlagged: "ALL",
    startDate: "",
    endDate: "",
};