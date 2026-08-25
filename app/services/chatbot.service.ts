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
  canBook?: boolean;
  chatClosed?: boolean;
  symptomLabel?: string | null;
  symptomDetail?: string | null;
  aiSummaryText?: string | null;
  finalAiSummary?: {
    headline?: string | null;
    analysis?: string | null;
    recommendation?: string | null;
    symptomLabel?: string | null;
    symptomDetail?: string | null;
    risk?: "GREEN" | "YELLOW" | "RED" | "UNKNOWN" | null;
  } | null;
};

export type ChatbotResponse = {
  text: string;
  state?: ChatbotStatePayload | null;
  sessionId?: number | null;
  logId?: number | null;
  is_booking_triggered?: boolean;
};

export type ChatbotFeedbackPayload = {
  feedback: "LIKE" | "DISLIKE";
};

export type ChatbotFeedbackResponse = {
  success?: boolean;
  feedback?: "LIKE" | "DISLIKE";
  message?: string;
};

export type ChatbotSessionRatingPayload = {
  rating: number;
  comment?: string;
};

export type ChatbotSessionRatingResponse = {
  success?: boolean;
  rating?: number;
};

export const chatbotService = {
  sendMessage(payload: ChatbotMessagePayload, accessToken: string) {
    return apiClient.post<ChatbotResponse>("/api/ai-web/chat", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  saveFeedback(
    logId: number,
    payload: ChatbotFeedbackPayload,
    accessToken: string,
  ) {
    return apiClient.patch<ChatbotFeedbackResponse>(
      `/api/ai-web/messages/${logId}/feedback`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },

  rateSession(
    sessionId: number,
    payload: ChatbotSessionRatingPayload,
    accessToken: string,
  ) {
    return apiClient.post<ChatbotSessionRatingResponse>(
      `/api/ai-web/sessions/${sessionId}/rating`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },
};
