import type { AiFeedback, RiskLevel } from "../types/aiReasoning.types";
import { getFeedbackLabel, getRiskLabel } from "../lib/aiReasoningHelpers";

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  return (
    <span
      className={[
        badgeBaseClass,
        riskLevel === "CRITICAL"
          ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] dark:text-[#FCA5A5]"
          : riskLevel === "HIGH"
            ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] dark:text-[#FBBF24]"
            : riskLevel === "MEDIUM"
              ? "border-[#FF7A00]/35 bg-[#FF7A00]/10 text-[#C2410C] dark:text-[#FFB366]"
              : riskLevel === "LOW"
                ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] dark:text-[#4ADE80]"
                : "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-[var(--admin-muted-text)]",
      ].join(" ")}
    >
      {getRiskLabel(riskLevel)}
    </span>
  );
}

export function FeedbackBadge({ feedback }: { feedback: AiFeedback }) {
  return (
    <span
      className={[
        badgeBaseClass,
        feedback === "LIKE"
          ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] dark:text-[#4ADE80]"
          : feedback === "DISLIKE"
            ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] dark:text-[#FCA5A5]"
            : "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-[var(--admin-muted-text)]",
      ].join(" ")}
    >
      {getFeedbackLabel(feedback)}
    </span>
  );
}

export function GoldenBadge({ isGolden }: { isGolden: boolean }) {
  if (!isGolden) return null;

  return (
    <span className="inline-flex rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-2.5 py-1 text-xs font-bold text-[#B45309] dark:text-[#FBBF24]">
      Câu trả lời tốt
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={[
        badgeBaseClass,
        score >= 8
          ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] dark:text-[#4ADE80]"
          : score <= 4
            ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] dark:text-[#FCA5A5]"
            : "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] dark:text-[#FBBF24]",
      ].join(" ")}
    >
      Điểm {score}/10
    </span>
  );
}

const badgeBaseClass =
  "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold";