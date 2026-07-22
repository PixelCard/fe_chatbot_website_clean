"use client";

import { apiClient } from "@/app/services/apiClient";

import type {
  AiQualitySessionItem,
  AiQualityStatus,
  AiRiskLevel,
} from "../types";

const ADMIN_CHATS_FULL_CONVERSATIONS_PATH =
  "/api/admin/chats/full-conversations";

type RawUser = {
  fullName?: string | null;
  name?: string | null;
  phone?: string | null;
};

type RawMessage = {
  id?: number | string | null;
  role?: string | null;
  type?: string | null;
  senderRole?: string | null;
  content?: string | null;
  createdAt?: string | null;
};

type RawChatSession = {
  id: number;
  status?: string | null;
  user?: RawUser | null;
  contactName?: string | null;
  contactPhone?: string | null;
  deviceType?: string | null;
  symptom?: string | null;
  aiSummary?: string | null;
  isDangerous?: boolean | null;
  messages?: RawMessage[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const DANGEROUS_KEYWORDS = [
  "cháy",
  "nổ",
  "điện giật",
  "rò điện",
  "chập điện",
  "mùi khét",
  "bốc khói",
  "tia lửa",
  "nóng lên",
  "quá nóng",
  "ngập nước",
  "rò nước",
  "cầu dao",
  "aptomat",
  "khẩn cấp",
];

const OUT_OF_SCOPE_KEYWORDS = [
  "1+1",
  "nấu cá",
  "nấu ăn",
  "bài tập",
  "lập trình",
  "game",
  "thời trang",
  "tình yêu",
  "chứng khoán",
];

const NEEDS_RAG_KEYWORDS = [
  "không có dữ liệu",
  "không tìm thấy tài liệu",
  "chưa có tài liệu",
  "thiếu thông tin",
  "không đủ thông tin",
  "chưa thể xác định",
];

function getSafeText(value?: string | null, fallback = "--") {
  if (!value) return fallback;

  const normalized = value.trim();
  return normalized ? normalized : fallback;
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFC");
}

function includesAnyKeyword(source: string, keywords: string[]) {
  const normalized = normalizeText(source);

  return keywords.some((keyword) => normalized.includes(normalizeText(keyword)));
}

function getCustomerName(session: RawChatSession) {
  return (
    getSafeText(session.user?.fullName, "") ||
    getSafeText(session.user?.name, "") ||
    getSafeText(session.contactName, "") ||
    "Khách hàng"
  );
}

function getCustomerPhone(session: RawChatSession) {
  return (
    getSafeText(session.contactPhone, "") ||
    getSafeText(session.user?.phone, "") ||
    "--"
  );
}

function getLastMessagePreview(session: RawChatSession) {
  const messages = session.messages ?? [];
  const lastMessage = messages[messages.length - 1];

  return getSafeText(lastMessage?.content, "Chưa có tin nhắn gần nhất.");
}

function getSymptom(session: RawChatSession) {
  if (session.symptom && session.symptom.trim()) {
    return session.symptom.trim();
  }

  const messages = session.messages ?? [];
  const userMessage = [...messages]
    .reverse()
    .find((message) => {
      const role = `${message.role ?? ""} ${message.type ?? ""} ${message.senderRole ?? ""}`;
      return normalizeText(role).includes("user");
    });

  return getSafeText(userMessage?.content, getLastMessagePreview(session));
}

function getTextCorpus(session: RawChatSession) {
  const messagesText = (session.messages ?? [])
    .map((message) => message.content ?? "")
    .join(" ");

  return [
    session.deviceType,
    session.symptom,
    session.aiSummary,
    getLastMessagePreview(session),
    messagesText,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildQualityAnalysis(session: RawChatSession): {
  qualityStatus: AiQualityStatus;
  qualityLabel: string;
  riskLevel: AiRiskLevel;
  riskLabel: string;
  actionHint: string;
  analysisReasons: string[];
} {
  const corpus = getTextCorpus(session);
  const dangerous = Boolean(session.isDangerous) || includesAnyKeyword(corpus, DANGEROUS_KEYWORDS);
  const outOfScope = includesAnyKeyword(corpus, OUT_OF_SCOPE_KEYWORDS);
  const needsRag = includesAnyKeyword(corpus, NEEDS_RAG_KEYWORDS);

  if (dangerous) {
    return {
      qualityStatus: "CRITICAL",
      qualityLabel: "Cần can thiệp",
      riskLevel: "HIGH",
      riskLabel: "Cao",
      actionHint: "Mở chat và kiểm tra ngay",
      analysisReasons: [
        "Phiên có dấu hiệu nguy hiểm hoặc tình huống cần cảnh báo an toàn.",
        "Admin nên kiểm tra nội dung tư vấn trước khi để AI tiếp tục xử lý.",
      ],
    };
  }

  if (outOfScope) {
    return {
      qualityStatus: "OUT_OF_SCOPE",
      qualityLabel: "Ngoài phạm vi",
      riskLevel: "MEDIUM",
      riskLabel: "Trung bình",
      actionHint: "Kiểm tra AI có từ chối đúng không",
      analysisReasons: [
        "Câu hỏi có dấu hiệu nằm ngoài phạm vi sửa chữa điện, nước hoặc thiết bị.",
        "Cần đảm bảo AI không trả lời lan man ngoài chuyên môn của hệ thống.",
      ],
    };
  }

  if (needsRag) {
    return {
      qualityStatus: "NEEDS_RAG",
      qualityLabel: "Thiếu tri thức",
      riskLevel: "MEDIUM",
      riskLabel: "Trung bình",
      actionHint: "Cân nhắc bổ sung tài liệu RAG",
      analysisReasons: [
        "Nội dung có dấu hiệu AI thiếu dữ liệu hoặc chưa tìm thấy tri thức phù hợp.",
        "Nên kiểm tra kho RAG để bổ sung tài liệu liên quan.",
      ],
    };
  }

  return {
    qualityStatus: "STABLE",
    qualityLabel: "Ổn định",
    riskLevel: "LOW",
    riskLabel: "Thấp",
    actionHint: "Theo dõi định kỳ",
    analysisReasons: [
      "Chưa phát hiện dấu hiệu nguy hiểm hoặc thiếu tri thức rõ ràng.",
      "Có thể mở chat để kiểm tra thủ công nếu phiên có nội dung đáng chú ý.",
    ],
  };
}

function mapSession(session: RawChatSession): AiQualitySessionItem {
  const quality = buildQualityAnalysis(session);

  return {
    id: session.id,
    customerName: getCustomerName(session),
    customerPhone: getCustomerPhone(session),
    deviceType: getSafeText(session.deviceType, "Chưa rõ thiết bị"),
    symptom: getSymptom(session),
    aiSummary: getSafeText(session.aiSummary, "Chưa có tóm tắt AI"),
    lastMessagePreview: getLastMessagePreview(session),
    messageCount: session.messages?.length ?? 0,
    status: session.status ?? "AI_CONSULTING",
    updatedAt: session.updatedAt ?? session.createdAt ?? "",
    createdAt: session.createdAt ?? "",
    ...quality,
  };
}

function filterAiConsultingSessions(sessions: RawChatSession[]) {
  return sessions.filter((session) => {
    if (!session.status) return true;
    return session.status === "AI_CONSULTING";
  });
}

export const aiConsultingAdminService = {
  async getQualitySessions(): Promise<AiQualitySessionItem[]> {
    const sessions = await apiClient.get<RawChatSession[]>(
      `${ADMIN_CHATS_FULL_CONVERSATIONS_PATH}?status=AI_CONSULTING`,
    );

    return filterAiConsultingSessions(sessions).map(mapSession);
  },
};