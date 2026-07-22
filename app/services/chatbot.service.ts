import { apiClient } from "@/app/services/apiClient";

export type ChatbotHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type ChatbotMessagePayload = {
  message: string;
  sessionId?: number | null;
  image?: string;
  history?: ChatbotHistoryItem[];
  state?: ChatbotStatePayload;
};

export type ChatbotStatePayload = {
  device?: string | null;
  deviceCategory?:
    | "COOLING_HEATING"
    | "WATER_APPLIANCE"
    | "COOKING_APPLIANCE"
    | "DISPLAY_AUDIO"
    | "CLEANING_APPLIANCE"
    | "AIR_WATER_TREATMENT"
    | "GENERIC_APPLIANCE"
    | null;
  symptom?: string | null;
  ctx?: string | null;
  phase?:
    | "COLLECTING"
    | "ASKING_CONTEXT"
    | "READY_FOR_RAG"
    | "ADVISING"
    | "DIAGNOSING"
    | "READY_TO_BOOK";
  risk?: "GREEN" | "YELLOW" | "RED" | "UNKNOWN";
  flags?: string[];
  contextQuestionsAsked?: boolean;
  contextQuestionSet?: string | null;
  askedFollowupKey?: string | null;
  contextAnswers?: {
    operationStatus?: string | null;
    errorCode?: string | null;
    abnormalSigns?: string | null;
    brandModel?: string | null;
    whenHappens?: string | null;
    maintenanceHistory?: string | null;
    environmentCondition?: string | null;
    safetySigns?: string | null;
    outdoorUnitStatus?: string | null;
  };
};

export type ChatbotResponse = {
  text: string;
  state?: ChatbotStatePayload | null;
  sessionId?: number | null;
  logId?: number | null;
  is_booking_triggered?: boolean;
};

export const chatbotService = {
  sendMessage(payload: ChatbotMessagePayload, accessToken: string) {
    return apiClient.post<ChatbotResponse>("/api/ai/chat", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
