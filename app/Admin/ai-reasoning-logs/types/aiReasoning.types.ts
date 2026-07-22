export type AiFeedback = "LIKE" | "DISLIKE" | null;

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null;
export type UsefulnessLabel = "USEFUL" | "PARTIAL" | "NOT_USEFUL" | null;

export type AiReasoningLogItem = {
  id: number;
  sessionId: number | null;
  sessionCode?: string | null;

  userId: number;
  userName: string;
  userPhone?: string;

  userMsg: string;
  prevState: Record<string, unknown> | null;
  nextState: Record<string, unknown> | null;

  riskLevel: RiskLevel;
  aiResponse: string | null;
  aiFeedback: AiFeedback;
  score: number;
  autoUsefulnessScore: number | null;
  autoUsefulnessLabel: UsefulnessLabel;
  autoUsefulnessReasons: string[];
  humanUsefulnessLabel: UsefulnessLabel;
  humanUsefulnessNote: string | null;
  reviewedById: number | null;
  reviewedByName: string | null;
  reviewedAt: string | null;

  deviceCategory: string | null;
  isGolden: boolean;
  createdAt: string;
};

export type AiReasoningFilterState = {
  search: string;
  feedback: "ALL" | "LIKE" | "DISLIKE" | "NONE";
  riskLevel: "ALL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  deviceCategory: "ALL" | string;
  scoreLevel: "ALL" | "LOW_SCORE" | "HIGH_SCORE";
  golden: "ALL" | "YES" | "NO";
};

export type UpdateAiUsefulnessReviewPayload = {
  humanUsefulnessLabel: Exclude<UsefulnessLabel, null>;
  humanUsefulnessNote?: string;
};
