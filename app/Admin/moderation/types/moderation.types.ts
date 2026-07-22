export type ModerationQueueItem = {
  id: string;
  type: "dangerous-session" | "negative-review" | "disliked-ai";
  title: string;
  subtitle: string;
  description: string;
  severity: "critical" | "warning";
  createdAt: string;
  metadata: Record<string, string | number | null>;
};

export type ModerationSummary = {
  dangerousSessions: number;
  negativeReviews: number;
  dislikedAiLogs: number;
};
