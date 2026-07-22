"use client";

export type ChatSessionStatus =
  | "AI_CONSULTING"
  | "BROADCASTING"
  | "MATCHED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | string;

export type ChatMessageType =
  | "TEXT"
  | "IMAGE"
  | "VIDEO"
  | "QUOTE_CARD"
  | "SYSTEM"
  | string;

export type ChatUser = {
  id: number;
  fullName?: string | null;
  avatarUrl?: string | null;
  role?: string;
  phoneNumber?: string | null;
};

export type ChatMessage = {
  id: number;
  sessionId: number;
  senderId: number;
  type: ChatMessageType;
  content: string;
  metadata?: Record<string, unknown> | null;
  isRead?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
  sender?: ChatUser | null;
};

export type ChatSession = {
  id: number;
  title?: string;
  userId?: number;
  technicianId?: number | null;
  deviceType?: string | null;
  symptom?: string | null;
  aiSummary?: string | null;
  status: ChatSessionStatus;
  createdAt: string;
  updatedAt: string;
  contactName?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  user?: ChatUser;
  technician?: ChatUser | null;
  review?: unknown | null;
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
};

export type DeviceSwitchDetectedPayload = {
  deviceSwitchDetected: true;
  currentDevice?: string | null;
  detectedDevice?: string | null;
  originalContent?: string;
  message: string;
  actions?: Array<{
    action: "CREATE_NEW_SESSION" | "CONTINUE_CURRENT_SESSION" | string;
    label: string;
  }>;
};

export type SendMessagePayload = {
  content: string;
  type?: ChatMessageType;
  deviceType?: string;
  symptom?: string;
  metadata?: Record<string, unknown>;
};

export type CreateChatSessionPayload = {
  deviceType?: string;
  symptom?: string;
  firstMessage?: string;
  metadata?: Record<string, unknown>;
};

export type UploadMediaPayload = {
  deviceType?: string;
  symptom?: string;
  metadata?: Record<string, unknown>;
};

export type BookTechnicianPayload = {
  contactName?: string;
  contactPhone?: string;
  address?: string;
  preferredTime?: string;
  note?: string;
  [key: string]: unknown;
};

export function isDeviceSwitchDetected(
  value: unknown,
): value is DeviceSwitchDetectedPayload {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as { deviceSwitchDetected?: unknown }).deviceSwitchDetected === true,
  );
}

export function isChatMessage(value: unknown): value is ChatMessage {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as { id?: unknown }).id === "number" &&
      typeof (value as { sessionId?: unknown }).sessionId === "number" &&
      typeof (value as { content?: unknown }).content === "string",
  );
}

export function deriveChatSessionTitle(session: ChatSession): string {
  if (session.title?.trim()) return session.title;
  if (session.deviceType && session.symptom) {
    return `${session.deviceType} ${session.symptom}`;
  }
  if (session.deviceType) {
    return `Tư vấn ${session.deviceType}`;
  }
  return "Phiên tư vấn mới";
}
