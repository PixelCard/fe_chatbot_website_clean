import {
  CalendarDays,
  Cpu,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { DeviceSummary } from "../types/device.types";

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

export default function DeviceKpiGrid({ summary }: { summary: DeviceSummary }) {
  const kpiItems: KpiItem[] = [
    {
      label: "Tổng thiết bị",
      value: summary.total,
      icon: Cpu,
      iconClassName:
        "border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]",
      accentClassName: "bg-[#FF7A00]",
    },
    {
      label: "Có bảo hành",
      value: summary.hasWarranty,
      icon: ShieldCheck,
      iconClassName:
        "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] dark:text-[#4ADE80]",
      accentClassName: "bg-[#22C55E]",
    },
    {
      label: "Có lịch bảo trì",
      value: summary.hasNextMaintenance,
      icon: CalendarDays,
      iconClassName:
        "border-[#F59E0B]/30 bg-[#F59E0B]/12 text-[#B45309] dark:text-[#FBBF24]",
      accentClassName: "bg-[#F59E0B]",
    },
    {
      label: "Lịch sử sửa chữa",
      value: summary.repairJobs,
      icon: Wrench,
      iconClassName:
        "border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]",
      accentClassName: "bg-[#FF7A00]",
    },
  ];

  return (
    <section
      aria-label="Tổng quan thiết bị"
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