import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import type { AiFeedback, RiskLevel } from "../types/aiReasoning.types";
import { getFeedbackLabel, getRiskLabel } from "../lib/aiReasoningHelpers";

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const isCritical = riskLevel === "CRITICAL";
  const isHigh = riskLevel === "HIGH";
  const isMedium = riskLevel === "MEDIUM";
  const isLow = riskLevel === "LOW";

  return (
    <span
      className={[
        badgeBaseClass,
        isCritical
          ? "bg-rose-600 text-white shadow-rose-600/20"
          : isHigh
            ? "bg-amber-500 text-slate-950 shadow-amber-500/20"
            : isMedium
              ? "bg-sky-600 text-white shadow-sky-600/20"
              : isLow
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-slate-600 text-white shadow-slate-600/20",
      ].join(" ")}
    >
      {isCritical || isHigh ? (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      ) : isMedium ? (
        <ShieldAlert className="h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      )}
      {getRiskLabel(riskLevel)}
    </span>
  );
}

export function FeedbackBadge({ feedback }: { feedback: AiFeedback }) {
  const isLike = feedback === "LIKE";
  const isDislike = feedback === "DISLIKE";

  return (
    <span
      className={[
        badgeBaseClass,
        isLike
          ? "bg-emerald-600 text-white shadow-emerald-600/20"
          : isDislike
            ? "bg-rose-600 text-white shadow-rose-600/20"
            : "bg-slate-600 text-white shadow-slate-600/20",
      ].join(" ")}
    >
      {isLike ? (
        <ThumbsUp className="h-4 w-4 shrink-0" />
      ) : isDislike ? (
        <ThumbsDown className="h-4 w-4 shrink-0" />
      ) : null}
      {getFeedbackLabel(feedback)}
    </span>
  );
}

export function GoldenBadge({ isGolden }: { isGolden: boolean }) {
  if (!isGolden) return null;

  return (
    <span className="inline-flex h-8.5 items-center gap-1.5 rounded-full bg-amber-400 px-4 text-sm font-black text-slate-950 shadow-md whitespace-nowrap shrink-0">
      <Star className="h-4 w-4 fill-current shrink-0" />
      Mẫu chuẩn AI
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const isHigh = score >= 8;
  const isLow = score <= 4;

  return (
    <span
      className={[
        badgeBaseClass,
        isHigh
          ? "bg-emerald-600 text-white shadow-emerald-600/20"
          : isLow
            ? "bg-rose-600 text-white shadow-rose-600/20"
            : "bg-amber-500 text-slate-950 shadow-amber-500/20",
      ].join(" ")}
    >
      <Star className="h-4 w-4 fill-current shrink-0" />
      Điểm {score}/10
    </span>
  );
}

const badgeBaseClass =
  "inline-flex h-8.5 items-center gap-1.5 rounded-full px-4 text-sm font-black shadow-md whitespace-nowrap shrink-0";