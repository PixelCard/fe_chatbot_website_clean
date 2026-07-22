export type AiQualityStatus =
  | "STABLE"
  | "CRITICAL"
  | "OUT_OF_SCOPE"
  | "NEEDS_RAG";

export type AiRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type AiQualitySessionItem = {
  id: number;
  customerName: string;
  customerPhone: string;
  deviceType: string;
  symptom: string;
  aiSummary: string;
  lastMessagePreview: string;
  messageCount: number;
  status: string;
  updatedAt: string;
  createdAt: string;

  qualityStatus: AiQualityStatus;
  qualityLabel: string;
  riskLevel: AiRiskLevel;
  riskLabel: string;
  actionHint: string;
  analysisReasons: string[];
};