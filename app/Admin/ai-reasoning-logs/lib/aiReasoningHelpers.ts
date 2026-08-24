import type {
  AiReasoningFilterState,
  AiReasoningLogItem,
  RiskLevel,
} from "../types/aiReasoning.types";

export function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getRiskLabel(riskLevel: RiskLevel) {
  if (riskLevel === "CRITICAL") return "Nghiêm trọng";
  if (riskLevel === "HIGH") return "Cao";
  if (riskLevel === "MEDIUM") return "Trung bình";
  if (riskLevel === "LOW") return "Thấp";
  return "Chưa xác định";
}

export function getFeedbackLabel(feedback: AiReasoningLogItem["aiFeedback"]) {
  if (feedback === "LIKE") return "LIKE";
  if (feedback === "DISLIKE") return "DISLIKE";
  return "Chưa phản hồi";
}

export function isLowScore(log: AiReasoningLogItem) {
  return getEffectiveScore(log) <= 4;
}

export function isHighScore(log: AiReasoningLogItem) {
  return getEffectiveScore(log) >= 8;
}

export function isHighRisk(log: AiReasoningLogItem) {
  return log.riskLevel === "HIGH" || log.riskLevel === "CRITICAL";
}

export function isSuspectedWrongAdvice(log: AiReasoningLogItem) {
  return log.aiFeedback === "DISLIKE" || isLowScore(log);
}

export function isSuspectedMissedWarning(log: AiReasoningLogItem) {
  if (!isHighRisk(log)) return false;

  const nextStateText = JSON.stringify(log.nextState ?? {}).toLowerCase();

  return (
    !nextStateText.includes("warning") &&
    !nextStateText.includes("cảnh báo") &&
    !nextStateText.includes("ngắt điện") &&
    !nextStateText.includes("nguy hiểm")
  );
}

export function filterAiReasoningLogs(
  logs: AiReasoningLogItem[],
  filters: AiReasoningFilterState,
) {
  const keyword = filters.search.trim().toLowerCase();

  return logs.filter((log) => {
    const matchSearch =
      !keyword ||
      log.userMsg.toLowerCase().includes(keyword) ||
      (log.aiResponse ?? "").toLowerCase().includes(keyword) ||
      log.userName.toLowerCase().includes(keyword) ||
      (log.userPhone ?? "").includes(keyword) ||
      (log.sessionCode ?? "").toLowerCase().includes(keyword) ||
      String(log.userId).includes(keyword) ||
      String(log.sessionId ?? "").includes(keyword);

    const matchFeedback =
      filters.feedback === "ALL" ||
      (filters.feedback === "NONE" && log.aiFeedback === null) ||
      log.aiFeedback === filters.feedback;

    const matchRisk =
      filters.riskLevel === "ALL" || log.riskLevel === filters.riskLevel;

    const matchDevice =
      filters.deviceCategory === "ALL" ||
      log.deviceCategory === filters.deviceCategory;

    const matchScore =
      filters.scoreLevel === "ALL" ||
      (filters.scoreLevel === "LOW_SCORE" && isLowScore(log)) ||
      (filters.scoreLevel === "HIGH_SCORE" && isHighScore(log));

    const matchGolden =
      filters.golden === "ALL" ||
      (filters.golden === "YES" && log.isGolden) ||
      (filters.golden === "NO" && !log.isGolden);

    return (
      matchSearch &&
      matchFeedback &&
      matchRisk &&
      matchDevice &&
      matchScore &&
      matchGolden
    );
  });
}

export function buildAiReasoningSummary(logs: AiReasoningLogItem[]) {
  const total = logs.length;
  const liked = logs.filter((item) => item.aiFeedback === "LIKE").length;
  const disliked = logs.filter((item) => item.aiFeedback === "DISLIKE").length;
  const highRisk = logs.filter(isHighRisk).length;
  const golden = logs.filter((item) => item.isGolden).length;
  const suspectedWrong = logs.filter(isSuspectedWrongAdvice).length;
  const suspectedMissedWarning = logs.filter(isSuspectedMissedWarning).length;

  const avgScore =
    total === 0
      ? 0
      : logs.reduce((sum, item) => sum + getEffectiveScore(item), 0) / total;

  return {
    total,
    liked,
    disliked,
    highRisk,
    golden,
    suspectedWrong,
    suspectedMissedWarning,
    avgScore,
  };
}

export function getEffectiveScore(log: AiReasoningLogItem) {
  return log.autoUsefulnessScore ?? log.score;
}
