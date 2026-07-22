import { CheckCircle2, ClipboardList, Radar, Wrench } from "lucide-react";

type DispatchSummary = {
  total: number;
  broadcasting: number;
  matched: number;
  completed: number;
};

type DispatchHeaderProps = {
  summary: DispatchSummary;
};

export default function DispatchHeader({ summary }: DispatchHeaderProps) {
  const kpiItems = [
    {
      label: "Tổng yêu cầu",
      value: summary.total,
      icon: ClipboardList,
      accent: "bg-[#06B6D4]",
      iconClass:
        "border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
    },
    {
      label: "Chờ điều phối",
      value: summary.broadcasting,
      icon: Radar,
      accent: "bg-[#F59E0B]",
      iconClass:
        "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
    },
    {
      label: "Đã gán thợ",
      value: summary.matched,
      icon: Wrench,
      accent: "bg-[#0EA5E9]",
      iconClass:
        "border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#0369A1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#38BDF8]",
    },
    {
      label: "Hoàn thành",
      value: summary.completed,
      icon: CheckCircle2,
      accent: "bg-[#22C55E]",
      iconClass:
        "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiItems.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="relative min-h-[112px] overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-5 transition-colors duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1 ${item.accent}`}
            />

            <div className="flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold leading-5 text-[var(--admin-strong-text)]">
                  {item.label}
                </p>

                <p className="mt-3 text-4xl font-extrabold leading-none tracking-tight text-[var(--admin-strong-text)]">
                  {item.value.toLocaleString("vi-VN")}
                </p>
              </div>

              <div
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
                  item.iconClass,
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
