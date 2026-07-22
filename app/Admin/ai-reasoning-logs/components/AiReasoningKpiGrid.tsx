"use client";

import {
  AlertTriangle,
  BotMessageSquare,
  CheckCircle2,
  ShieldAlert,
  Star,
  ThumbsDown,
  type LucideIcon,
} from "lucide-react";

type Props = {
  total: number;
  avgScore: number;
  highRisk: number;
  disliked: number;
  golden: number;
  suspectedWrong: number;
};

type KpiItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName: string;
  accentClassName: string;
};

function formatNumber(value: number) {
  return value.toLocaleString("vi-VN");
}

export function AiReasoningKpiGrid({
  total,
  avgScore,
  highRisk,
  disliked,
  golden,
  suspectedWrong,
}: Props) {
  const kpiItems: KpiItem[] = [
    {
      label: "Tổng log AI",
      value: formatNumber(total),
      icon: BotMessageSquare,
      iconClassName:
        "border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
      accentClassName: "bg-[#06B6D4]",
    },
    {
      label: "Điểm trung bình",
      value: avgScore.toFixed(1),
      icon: Star,
      iconClassName:
        avgScore >= 8
          ? "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
          : avgScore <= 4
            ? "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]"
            : "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
      accentClassName:
        avgScore >= 8 ? "bg-[#22C55E]" : avgScore <= 4 ? "bg-[#EF4444]" : "bg-[#F59E0B]",
    },
    {
      label: "Cần rà soát",
      value: formatNumber(highRisk),
      icon: ShieldAlert,
      iconClassName:
        "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
      accentClassName: "bg-[#EF4444]",
    },
    {
      label: "Bị dislike",
      value: formatNumber(disliked),
      icon: ThumbsDown,
      iconClassName:
        "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
      accentClassName: "bg-[#F59E0B]",
    },
    {
      label: "Câu trả lời tốt",
      value: formatNumber(golden),
      icon: CheckCircle2,
      iconClassName:
        "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
      accentClassName: "bg-[#22C55E]",
    },
    {
      label: "Nghi vấn sai",
      value: formatNumber(suspectedWrong),
      icon: AlertTriangle,
      iconClassName:
        "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
      accentClassName: "bg-[#F59E0B]",
    },
  ];

  return (
    <section
      aria-label="Tổng quan log suy luận AI"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {kpiItems.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="admin-card group relative min-h-[112px] overflow-hidden rounded-2xl p-5 transition-colors duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1 ${item.accentClassName}`}
            />

            <div className="flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold leading-5 text-[var(--admin-strong-text)]">
                  {item.label}
                </p>

                <p className="mt-3 text-4xl font-extrabold leading-none tracking-tight text-[var(--admin-strong-text)]">
                  {item.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.iconClassName}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.3} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default AiReasoningKpiGrid;