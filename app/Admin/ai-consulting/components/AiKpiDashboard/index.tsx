"use client";

import {
  AlertTriangle,
  Bot,
  DatabaseZap,
  ShieldQuestion,
  type LucideIcon,
} from "lucide-react";

import type { AiQualitySessionItem } from "../../types";

type AiKpiDashboardProps = {
  items: AiQualitySessionItem[];
};

type KpiItem = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
  accentClassName: string;
};

function formatNumber(value: number) {
  return value.toLocaleString("vi-VN");
}

export default function AiKpiDashboard({ items }: AiKpiDashboardProps) {
  const total = items.length;
  const critical = items.filter((item) => item.qualityStatus === "CRITICAL").length;
  const outOfScope = items.filter((item) => item.qualityStatus === "OUT_OF_SCOPE").length;
  const needsRag = items.filter((item) => item.qualityStatus === "NEEDS_RAG").length;

  const kpiItems: KpiItem[] = [
    {
      label: "Phiên AI tư vấn",
      value: total,
      icon: Bot,
      iconClassName:
        "border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
      accentClassName: "bg-[#06B6D4]",
    },
    {
      label: "Cần can thiệp",
      value: critical,
      icon: AlertTriangle,
      iconClassName:
        "border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFB366]",
      accentClassName: "bg-[#FF7A00]",
    },
    {
      label: "Ngoài phạm vi",
      value: outOfScope,
      icon: ShieldQuestion,
      iconClassName:
        "border-[#A855F7]/25 bg-[#A855F7]/10 text-[#7E22CE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#C084FC]",
      accentClassName: "bg-[#A855F7]",
    },
    {
      label: "Cần bổ sung RAG",
      value: needsRag,
      icon: DatabaseZap,
      iconClassName:
        "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
      accentClassName: "bg-[#22C55E]",
    },
  ];

  return (
    <section
      aria-label="Tổng quan chất lượng AI tư vấn"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
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
                  {formatNumber(item.value)}
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