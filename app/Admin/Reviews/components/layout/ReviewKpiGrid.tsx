import { AlertTriangle, MessageSquareText, Star, TrendingUp, type LucideIcon } from "lucide-react";

type Props = {
  total: number;
  average: number;
  lowRating: number;
  positive: number;
};

export function ReviewKpiGrid({
  total,
  average,
  lowRating,
  positive,
}: Props) {
  const items = [
    {
      label: "Tổng đánh giá",
      value: total.toLocaleString("vi-VN"),
      suffix: "",
      icon: MessageSquareText,
      tone: "orange",
    },
    {
      label: "Điểm trung bình",
      value: average.toFixed(1),
      suffix: "★",
      icon: Star,
      tone: "amber",
    },
    {
      label: "Đánh giá tích cực",
      value: positive.toLocaleString("vi-VN"),
      suffix: "",
      icon: TrendingUp,
      tone: "green",
    },
    {
      label: "Đánh giá thấp",
      value: lowRating.toLocaleString("vi-VN"),
      suffix: "",
      icon: AlertTriangle,
      tone: "red",
    },
  ] as const;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const toneConfig = getToneConfig(item.tone);
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="admin-card group relative min-h-[112px] overflow-hidden rounded-2xl p-5 transition-colors duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
          >
            <span
              aria-hidden="true"
              className={["absolute inset-x-0 top-0 h-1", toneConfig.accentClassName].join(" ")}
            />

            <div className="flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-[0.1em] text-[var(--admin-muted-text)]">
                  {item.label}
                </p>

                <p className="mt-2.5 text-2xl font-black leading-none tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
                  {item.value}{" "}
                  {item.suffix ? (
                    <span className="text-xl text-[#F59E0B]">{item.suffix}</span>
                  ) : null}
                </p>
              </div>

              <div
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
                  toneConfig.iconClassName,
                ].join(" ")}
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

function getToneConfig(tone: "orange" | "amber" | "green" | "red"): {
  iconClassName: string;
  accentClassName: string;
} {
  switch (tone) {
    case "green":
      return {
        iconClassName:
          "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
        accentClassName: "bg-[#22C55E]",
      };
    case "amber":
      return {
        iconClassName:
          "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
        accentClassName: "bg-[#F59E0B]",
      };
    case "red":
      return {
        iconClassName:
          "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
        accentClassName: "bg-[#EF4444]",
      };
    case "orange":
    default:
      return {
        iconClassName:
          "border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
        accentClassName: "bg-[#FF7A00]",
      };
  }
}
