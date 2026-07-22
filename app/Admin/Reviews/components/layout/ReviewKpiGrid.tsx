import { AlertTriangle, MessageSquareText, Star, TrendingUp } from "lucide-react";

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
      {items.map((item) => (
        <article key={item.label} className="admin-card rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
                {item.label}
              </p>
              <p className="mt-2.5 text-2xl font-bold leading-none tracking-tight text-[var(--admin-strong-text)] sm:text-[28px]">
                {item.value}{" "}
                {item.suffix ? (
                  <span className="text-lg text-[#F59E0B]">{item.suffix}</span>
                ) : null}
              </p>
            </div>

            <div className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border", toneClass(item.tone)].join(" ")}>
              <item.icon className="h-5 w-5" strokeWidth={2.3} />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function toneClass(tone: "orange" | "amber" | "green" | "red") {
  switch (tone) {
    case "green":
      return "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]";
    case "amber":
      return "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]";
    case "red":
      return "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]";
    case "orange":
    default:
      return "border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]";
  }
}
