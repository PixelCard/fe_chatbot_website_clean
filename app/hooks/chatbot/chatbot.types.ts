import type { ChatSessionItem } from "@/app/services/common";
import type { AiConversationState } from "@/app/services/common";

export type DeviceSwitchResult = {
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

export type UploadSessionMediaSuccess = {
  message: string;
  fileUrl: string;
  data: {
    id: number;
    type?: string;
    content?: string;
    metadata?: Record<string, unknown> | null;
  };
};

export type ChatUiMessage = {
  id: string;
  type: "text" | "image" | "video" | "device-switch";
  role: "user" | "assistant" | "system";
  content: string;
  mediaUrl?: string;
  deviceSwitch?: DeviceSwitchResult;
};

export type DeviceSwitchPrompt = {
  currentDevice: string;
  detectedDevice: string;
  originalContent: string;
  message: string;
};

export type HydrateSessionInput = {
  id: number;
  deviceType?: string | null;
  symptom?: string | null;
  status?: ChatSessionItem["status"] | null;
  latestAiLogId?: number | null;
  latestAiFeedback?: "LIKE" | "DISLIKE" | null;
  aiStateSnapshot?: AiConversationState | null;
};
