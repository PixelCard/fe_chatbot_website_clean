"use client";

import {
  BadgeAlert,
  LockKeyhole,
  UserRoundCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type AccountSummary = {
  total: number;
  active: number;
  locked: number;
  verified: number;
  unverified: number;
  online: number;
  customers: number;
  technicians: number;
  admins: number;
};

type Props = {
  summary: AccountSummary;
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

export default function AccountKpiGrid({ summary }: Props) {
  const kpiItems: KpiItem[] = [
    {
      label: "Tổng tài khoản",
      value: summary.total,
      icon: UsersRound,
      iconClassName: "border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2]",
      accentClassName: "bg-[#06B6D4]",
    },
    {
      label: "Đang hoạt động",
      value: summary.active,
      icon: UserRoundCheck,
      iconClassName: "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309]",
      accentClassName: "bg-[#F59E0B]",
    },
    {
      label: "Chờ xác minh",
      value: summary.unverified,
      icon: BadgeAlert,
      iconClassName: "border-[#F59E0B]/30 bg-[#F59E0B]/12 text-[#B45309]",
      accentClassName: "bg-[#F59E0B]",
    },
    {
      label: "Bị khóa",
      value: summary.locked,
      icon: LockKeyhole,
      iconClassName: "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#B91C1C]",
      accentClassName: "bg-[#EF4444]",
    },
  ];

  return (
    <section
      aria-label="Tổng quan tài khoản"
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
