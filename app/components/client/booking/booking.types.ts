import type { BookTechnicianPayload, ChatSessionItem } from "@/app/services/common/types";

export type TechnicianBookingFormValues = BookTechnicianPayload & {
  deviceType: string;
  symptom: string;
};

export type TechnicianBookingSummary = {
  title: string;
  value: string;
};

export type TechnicianBookingResult = {
  session: ChatSessionItem;
  sessionId: number;
  bootstrapSource: "existing-session" | "ai-bootstrap";
};
