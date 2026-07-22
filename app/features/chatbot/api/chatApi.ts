"use client";

import { apiClient, normalizeListResponse, unwrapData } from "@/app/services/apiClient";
import type {
  BookTechnicianPayload,
  ChatMessage,
  ChatSession,
  CreateChatSessionPayload,
  DeviceSwitchDetectedPayload,
  SendMessagePayload,
  UploadMediaPayload,
} from "../types/chat.types";
import { isChatMessage, isDeviceSwitchDetected } from "../types/chat.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function mapChatSession(raw: unknown): ChatSession {
  return unwrapData<ChatSession>(raw);
}

function mapChatMessage(raw: unknown): ChatMessage {
  const candidate = isRecord(raw) && "data" in raw ? raw.data : raw;
  if (!isChatMessage(candidate)) {
    throw new Error("Chat message response shape is invalid.");
  }
  return candidate;
}

function mapMessageResult(
  raw: unknown,
): ChatMessage | DeviceSwitchDetectedPayload {
  if (isDeviceSwitchDetected(raw)) {
    return raw;
  }

  if (isRecord(raw) && "data" in raw) {
    const nested = raw.data;
    if (isDeviceSwitchDetected(nested)) {
      return nested;
    }
  }

  return mapChatMessage(raw);
}

export const chatApi = {
  async getSessions(): Promise<ChatSession[]> {
    const raw = await apiClient.get<unknown>("/api/chats");
    return normalizeListResponse<ChatSession>(raw).items;
  },

  async getActiveRunningSessions(): Promise<ChatSession[]> {
    const raw = await apiClient.get<unknown>("/api/chats/active/running");
    return normalizeListResponse<ChatSession>(raw).items;
  },

  async getUserRepairHistory(): Promise<ChatSession[]> {
    const raw = await apiClient.get<unknown>("/api/chats/user/history");
    return normalizeListResponse<ChatSession>(raw).items;
  },

  async createSession(
    payload?: CreateChatSessionPayload,
  ): Promise<ChatSession> {
    const raw = await apiClient.post<unknown>("/api/chats/sessions", payload);
    return mapChatSession(raw);
  },

  async getSession(sessionId: number): Promise<ChatSession> {
    const raw = await apiClient.get<unknown>(`/api/chats/${sessionId}`);
    return mapChatSession(raw);
  },

  async getMessages(
    sessionId: number,
    options?: { cursor?: number; limit?: number },
  ): Promise<ChatMessage[]> {
    const raw = await apiClient.get<unknown>(
      `/api/chats/${sessionId}/messages`,
      options,
    );
    return normalizeListResponse<ChatMessage>(raw).items;
  },

  async sendMessage(
    sessionId: number,
    payload: SendMessagePayload,
  ): Promise<ChatMessage | DeviceSwitchDetectedPayload> {
    const raw = await apiClient.post<unknown>(`/api/chats/${sessionId}/messages`, {
      type: payload.type ?? "TEXT",
      content: payload.content,
      deviceType: payload.deviceType,
      symptom: payload.symptom,
      metadata: payload.metadata,
    });
    return mapMessageResult(raw);
  },

  async uploadMedia(
    sessionId: number,
    file: File,
    payload?: UploadMediaPayload,
  ): Promise<ChatMessage | DeviceSwitchDetectedPayload> {
    const formData = new FormData();
    formData.append("file", file);

    if (payload?.deviceType) formData.append("deviceType", payload.deviceType);
    if (payload?.symptom) formData.append("symptom", payload.symptom);
    if (payload?.metadata) {
      formData.append("metadata", JSON.stringify(payload.metadata));
    }

    const raw = await apiClient.post<unknown>(
      `/api/chats/${sessionId}/image`,
      formData,
    );
    return mapMessageResult(raw);
  },

  async bookTechnician(
    sessionId: number,
    payload: BookTechnicianPayload,
  ): Promise<unknown> {
    const raw = await apiClient.post<unknown>(`/api/chats/${sessionId}/book`, payload);
    return unwrapData(raw);
  },

  async deleteSession(sessionId: number): Promise<void> {
    await apiClient.delete(`/api/chats/sessions/${sessionId}`);
  },

  async deleteBulkSessions(sessionIds: number[]): Promise<void> {
    await apiClient.delete("/api/chats/sessions/bulk", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: sessionIds }),
    });
  },

  async hideBulkSessions(sessionIds: number[]): Promise<void> {
    await apiClient.patch("/api/chats/sessions/hide-bulk", { ids: sessionIds });
  },

  async markAllAsRead(sessionId: number): Promise<void> {
    await apiClient.patch(`/api/chats/${sessionId}/read-all`);
  },
};
