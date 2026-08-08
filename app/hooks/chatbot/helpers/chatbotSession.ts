import type {
  ChatbotHistoryItem,
  ChatbotStatePayload,
} from "@/app/services/chatbot.service";
import type { AiConversationState } from "@/app/services/common";
import type { ChatUiMessage, DeviceSwitchPrompt } from "../chatbot.types";
import {
  hasBlockingStateFlag,
} from "./chatbotState";
import {
  cleanText,
  normalizeDeviceType,
  normalizeSymptom,
} from "./chatbotText";

type CreateChatSessionResponse = {
  id: number;
  deviceType?: string | null;
  symptom?: string | null;
};

/** Chuyển transcript UI hiện tại về history payload mà endpoint AI cũ hiểu được. */
export function buildHistory(messages: ChatUiMessage[]): ChatbotHistoryItem[] {
  return messages
    .filter(
      (message): message is ChatUiMessage & { role: "user" | "assistant" } =>
        message.role === "user" || message.role === "assistant",
    )
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

/** Tạo chữ ký để chống tạo trùng ChatSession cho cùng 1 cặp device/symptom. */
export function buildSessionSignature(
  device?: string | null,
  symptom?: string | null,
) {
  const normalizedDevice = normalizeDeviceType(device);
  const normalizedSymptom = normalizeSymptom(symptom, true);

  if (!normalizedDevice || !normalizedSymptom) {
    return null;
  }

  return `${normalizedDevice}::${normalizedSymptom}`;
}

/** Kiểm tra một state đã đủ điều kiện tạo ChatSession fallback hay chưa. */
export function canCreateSessionFromState(input: {
  latestUserMessage: string;
  responseSessionId?: number | null;
  currentSessionId?: number | null;
  nextState: AiConversationState | ChatbotStatePayload | null;
  deviceSwitchPrompt: DeviceSwitchPrompt | null;
  lastCreatedSessionSignature: string | null;
}) {
  if (
    input.responseSessionId ||
    input.currentSessionId ||
    input.deviceSwitchPrompt ||
    hasBlockingStateFlag(input.nextState)
  ) {
    return { canCreate: false, signature: null, deviceType: null, symptom: null };
  }

  const deviceType = normalizeDeviceType(input.nextState?.device);
  const symptom = normalizeSymptom(input.nextState?.symptom, true);
  const firstMessage = cleanText(input.latestUserMessage);

  if (!deviceType || !symptom || !firstMessage) {
    return { canCreate: false, signature: null, deviceType: null, symptom: null };
  }

  const signature = buildSessionSignature(deviceType, symptom);

  if (!signature || input.lastCreatedSessionSignature === signature) {
    return { canCreate: false, signature, deviceType, symptom };
  }

  return { canCreate: true, signature, deviceType, symptom };
}

/** Gọi endpoint tạo ChatSession fallback cho web chatbot khi AI state đã đủ dữ liệu. */
export async function createFallbackChatSession(input: {
  accessToken: string;
  deviceType: string;
  symptom: string;
  firstMessage: string;
}) {
  const response = await fetch("/api/chats-web/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.accessToken}`,
    },
    body: JSON.stringify({
      deviceType: input.deviceType,
      symptom: input.symptom,
      firstMessage: input.firstMessage,
    }),
  });

  const raw = (await response.json()) as unknown;

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      raw,
    };
  }

  const createdSession = raw as CreateChatSessionResponse;

  return {
    ok: true as const,
    sessionId: typeof createdSession.id === "number" ? createdSession.id : null,
  };
}
