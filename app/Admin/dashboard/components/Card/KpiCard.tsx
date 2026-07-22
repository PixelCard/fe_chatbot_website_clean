import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  ClipboardList,
  Radar,
  UserCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { KpiItem } from "../../type/types";

const toneMap = {
  good: {
    accent: "bg-[#22C55E]",
    iconWrap:
      "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
  },
  warn: {
    accent: "bg-[#F59E0B]",
    iconWrap:
      "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
  },
  info: {
    accent: "bg-[#06B6D4]",
    iconWrap:
      "border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
  },
  danger: {
    accent: "bg-[#EF4444]",
    iconWrap:
      "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]",
  },
} satisfies Record<
  KpiItem["tone"],
  {
    accent: string;
    iconWrap: string;
  }
>;

const iconMap: Record<KpiItem["icon"], LucideIcon> = {
  jobs: ClipboardList,
  broadcast: Radar,
  repair: Wrench,
  done: CheckCircle2,
  money: Banknote,
  tech: UserCheck,
};

function formatKpiValue(value: string | number) {
  if (typeof value === "number") return value.toLocaleString("vi-VN");
  return value;
}

export default function KpiCard({ item }: { item: KpiItem }) {
  const tone = toneMap[item.tone];
  const Icon = iconMap[item.icon];

  return (
    <Link
      href={item.href}
      className="admin-card group relative block min-h-[112px] overflow-hidden rounded-2xl p-5 transition-colors duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${tone.accent}`}
      />

      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-5 text-[var(--admin-strong-text)]">
            {item.label}
          </p>

          <p className="mt-3 text-4xl font-extrabold leading-none tracking-tight text-[var(--admin-strong-text)]">
            {formatKpiValue(item.value)}
          </p>
        </div>

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
            tone.iconWrap,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" strokeWidth={2.4} />
        </div>
      </div>
    </Link>
  );
}
