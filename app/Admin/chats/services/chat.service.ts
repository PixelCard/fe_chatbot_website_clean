import { apiClient } from "@/app/services/apiClient";
import type { ChatSessionItem, MessageItem } from "@/app/services/common";
import { chatsService } from "@/app/services/common/chats.service";
import type { ChatMessage, ChatSession, SenderType } from "../types/chat.types";

export type ChatSessionListQuery = {
  keyword?: string;
  status?: string;
  address?: string;
  technicianName?: string;
  isDangerous?: boolean;
  isFlagged?: boolean;
};

const ADMIN_CHATS_BASE = "/api/admin/chats";
const ADMIN_CHATS_FULL_CONVERSATIONS_PATH = `${ADMIN_CHATS_BASE}/full-conversations`;

function normalizeRole(role?: string | null) {
  return role?.trim().toUpperCase() ?? null;
}

function mapSenderType(
  message: MessageItem,
  session?: Pick<ChatSessionItem, "userId" | "technicianId">,
): SenderType {
  const senderRole = normalizeRole(message.sender?.role);

  if (senderRole === "TECHNICIAN") {
    return "TECHNICIAN";
  }

  if (
    senderRole === "USER" ||
    senderRole === "CLIENT" ||
    senderRole === "CUSTOMER"
  ) {
    return "USER";
  }

  if (session && message.senderId != null) {
    if (Number(message.senderId) === Number(session.userId)) {
      return "USER";
    }

    if (
      session.technicianId != null &&
      Number(message.senderId) === Number(session.technicianId)
    ) {
      return "TECHNICIAN";
    }
  }

  // Ưu tiên map đúng người gửi thật trước. Chỉ khi không xác định được
  // người gửi mới coi đây là log hệ thống để tránh đẩy tin nhắn hội thoại
  // của khách/thợ vào pill `SystemMessage` ở giữa màn hình.
  if (message.type === "SYSTEM_LOG") {
    return "SYSTEM";
  }

  if (senderRole === "ADMIN") {
    return "SYSTEM";
  }

  return "AI";
}

function mapMessage(
  message: MessageItem,
  session?: Pick<ChatSessionItem, "userId" | "technicianId">,
): ChatMessage {
  return {
    id: String(message.id),
    sessionId: String(message.sessionId),
    senderType: mapSenderType(message, session),
    content: message.content,
    createdAt: message.createdAt,
  };
}

function extractRawMessages(session: Record<string, unknown>): MessageItem[] {
  if (Array.isArray(session.messages)) return session.messages as MessageItem[];
  if (Array.isArray(session.chatMessages)) return session.chatMessages as MessageItem[];
  if (Array.isArray(session.history)) return session.history as MessageItem[];
  if (session.data && typeof session.data === "object" && Array.isArray((session.data as Record<string, unknown>).messages)) {
    return (session.data as Record<string, unknown>).messages as MessageItem[];
  }
  return [];
}

function getLastMessage(session: ChatSessionItem) {
  const rawMessages = extractRawMessages(session as unknown as Record<string, unknown>);
  if (rawMessages.length > 0) {
    return rawMessages[rawMessages.length - 1]?.content ?? "";
  }

  return "";
}

function mapSession(session: ChatSessionItem): ChatSession {
  const rawMessages = extractRawMessages(session as unknown as Record<string, unknown>);

  return {
    id: String(session.id),
    status: session.status,
    userId: String(session.userId),
    customerName: session.user?.fullName?.trim() || session.contactName?.trim() || "Khách hàng",
    customerPhone: session.contactPhone?.trim() || "--",
    technicianId: session.technicianId != null ? String(session.technicianId) : null,
    technicianName: session.technician?.fullName?.trim() || null,
    isDangerous: session.isDangerous,
    isFlagged: false,
    flagReason: null,
    lastMessage: getLastMessage(session),
    updatedAt: session.updatedAt,
    address: session.address?.trim() || "--",
    messages: rawMessages.map((message) =>
      mapMessage(message, {
        userId: session.userId,
        technicianId: session.technicianId ?? null,
      }),
    ),
  };
}

function matchesQuery(session: ChatSession, query?: ChatSessionListQuery) {
  if (!query) {
    return true;
  }

  const keyword = query.keyword?.trim().toLowerCase();
  if (keyword) {
    const haystack = [
      session.id,
      session.customerName,
      session.customerPhone,
      session.lastMessage,
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(keyword)) {
      return false;
    }
  }

  if (query.status && session.status !== query.status) {
    return false;
  }

  if (query.address && !session.address.toLowerCase().includes(query.address.trim().toLowerCase())) {
    return false;
  }

  if (
    query.technicianName &&
    !(session.technicianName || "").toLowerCase().includes(query.technicianName.trim().toLowerCase())
  ) {
    return false;
  }

  if (query.isDangerous === true && session.isDangerous !== true) {
    return false;
  }

  if (query.isFlagged === true && session.isFlagged !== true) {
    return false;
  }

  return true;
}

export const adminChatsService = {
  /** Gọi GET /admin/chats để lấy danh sách phiên chat toàn hệ thống cho admin. */
  async getSessions(query?: ChatSessionListQuery) {
    const sessions = await apiClient.get<ChatSessionItem[]>(
      ADMIN_CHATS_FULL_CONVERSATIONS_PATH,
      query,
    );
    return sessions.map(mapSession).filter((session) => matchesQuery(session, query));
  },

  /** Gọi GET /admin/chats/:id để lấy chi tiết một phiên chat cùng toàn bộ tin nhắn. */
  async getSessionById(sessionId: string) {
    const detail = await apiClient.get<ChatSessionItem>(`${ADMIN_CHATS_BASE}/${sessionId}`);

    try {
      const numId = Number(sessionId);
      if (!Number.isNaN(numId)) {
        const fetchedMessages = await chatsService.getMessages(numId, { limit: 200 });
        if (Array.isArray(fetchedMessages) && fetchedMessages.length > 0) {
          detail.messages = fetchedMessages;
        }
      }
    } catch {
      // Giữ nguyên detail.messages hiện có nếu endpoint messages không khả dụng
    }

    return mapSession(detail);
  },
};
