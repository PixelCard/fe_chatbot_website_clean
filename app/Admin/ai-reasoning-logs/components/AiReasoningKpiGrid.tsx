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
  cardClassName: string;
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
      iconClassName: "bg-cyan-600 text-white shadow-md shadow-cyan-600/20",
      cardClassName: "border-2 border-cyan-500/40 bg-cyan-950/25 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-cyan-50/80",
      accentClassName: "bg-cyan-500",
    },
    {
      label: "Điểm trung bình",
      value: avgScore.toFixed(1),
      icon: Star,
      iconClassName:
        avgScore >= 8
          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
          : avgScore <= 4
            ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
            : "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20",
      cardClassName:
        avgScore >= 8
          ? "border-2 border-emerald-500/40 bg-emerald-950/25 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-emerald-50/80"
          : avgScore <= 4
            ? "border-2 border-rose-500/40 bg-rose-950/25 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-rose-50/80"
            : "border-2 border-amber-500/40 bg-amber-950/25 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-amber-50/80",
      accentClassName:
        avgScore >= 8 ? "bg-emerald-500" : avgScore <= 4 ? "bg-rose-500" : "bg-amber-500",
    },
    {
      label: "Cần rà soát",
      value: formatNumber(highRisk),
      icon: ShieldAlert,
      iconClassName: "bg-rose-600 text-white shadow-md shadow-rose-600/20",
      cardClassName: "border-2 border-rose-500/40 bg-rose-950/25 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-rose-50/80",
      accentClassName: "bg-rose-500",
    },
    {
      label: "Bị dislike",
      value: formatNumber(disliked),
      icon: ThumbsDown,
      iconClassName: "bg-rose-600 text-white shadow-md shadow-rose-600/20",
      cardClassName: "border-2 border-rose-500/40 bg-rose-950/25 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-rose-50/80",
      accentClassName: "bg-rose-500",
    },
    {
      label: "Câu trả lời tốt",
      value: formatNumber(golden),
      icon: CheckCircle2,
      iconClassName: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
      cardClassName: "border-2 border-emerald-500/40 bg-emerald-950/25 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-emerald-50/80",
      accentClassName: "bg-emerald-500",
    },
    {
      label: "Nghi vấn sai",
      value: formatNumber(suspectedWrong),
      icon: AlertTriangle,
      iconClassName: "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20",
      cardClassName: "border-2 border-amber-500/40 bg-amber-950/25 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-amber-50/80",
      accentClassName: "bg-amber-500",
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
            className={[
              "group relative min-h-[112px] overflow-hidden rounded-3xl p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
              item.cardClassName,
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1.5 ${item.accentClassName}`}
            />

            <div className="flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-black uppercase tracking-wider text-[var(--admin-strong-text)]">
                  {item.label}
                </p>

                <p className="mt-2.5 text-[34px] font-black leading-none tracking-tight text-[var(--admin-strong-text)]">
                  {item.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconClassName}`}
              >
                <Icon className="h-6 w-6" strokeWidth={2.3} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default AiReasoningKpiGrid;