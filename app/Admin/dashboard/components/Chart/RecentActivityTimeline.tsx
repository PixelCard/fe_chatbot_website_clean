import Link from "next/link";
import {
  Bot,
  CheckCircle2,
  CircleDollarSign,
  type LucideIcon,
  Radio,
  UserCheck,
} from "lucide-react";

import type { ActivityItem } from "../../type/types";

const activityTone: Record<
  ActivityItem["type"],
  {
    icon: LucideIcon;
    rail: string;
    iconBox: string;
  }
> = {
  job: {
    icon: Radio,
    rail: "bg-[#06B6D4]",
    iconBox:
      "border-[#06B6D4]/25 bg-[#ECFEFF] text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
  },
  technician: {
    icon: UserCheck,
    rail: "bg-[#22C55E]",
    iconBox:
      "border-[#22C55E]/25 bg-[#F0FDF4] text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
  },
  quote: {
    icon: CircleDollarSign,
    rail: "bg-[#F59E0B]",
    iconBox:
      "border-[#F59E0B]/25 bg-[#FFF7ED] text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
  },
  complete: {
    icon: CheckCircle2,
    rail: "bg-[#10B981]",
    iconBox:
      "border-[#10B981]/25 bg-[#ECFDF5] text-[#047857] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#10B981]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#34D399]",
  },
  ai: {
    icon: Bot,
    rail: "bg-[#EF4444]",
    iconBox:
      "border-[#EF4444]/25 bg-[#FEF2F2] text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#EF4444]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]",
  },
};

export default function RecentActivityTimeline({
  data,
  loading,
  error,
}: {
  data: ActivityItem[];
  loading?: boolean;
  error?: string | null;
}) {
  const visibleItems = data.slice(0, 4);
  const remaining = Math.max(0, data.length - visibleItems.length);

  if (loading) {
    return (
      <div className="h-[340px] animate-pulse rounded-3xl border border-[#D0D5DD] bg-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]" />
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm font-semibold text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
        Không tải được hoạt động gần đây: {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-3xl border border-[#D0D5DD] bg-white p-5 text-sm font-medium text-[#475467] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
        Chưa có hoạt động gần đây.
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-[#D0D5DD] bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.14)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <div className="border-b border-[#E4E7EC] px-5 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              Hoạt động gần đây
            </h3>

            <p className="mt-0.5 text-sm font-medium text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
              Tóm tắt các sự kiện mới nhất.
            </p>
          </div>

          <Link
            href="/admin/ai-reasoning-logs"
            className="shrink-0 rounded-xl px-2 py-1 text-sm font-semibold text-[#0891B2] transition hover:bg-[#ECFEFF] hover:text-[#0E7490] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white"
          >
            Xem nhật ký
          </Link>
        </div>
      </div>

      <div className="p-4">
        <ol className="space-y-2">
          {visibleItems.map((item) => {
            const tone = activityTone[item.type];
            const Icon = tone.icon;

            return (
              <li key={item.id}>
                <div className="group relative overflow-hidden rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-3 transition hover:border-[#CBD5E1] hover:bg-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#122039]">
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute left-0 top-3 h-[calc(100%-1.5rem)] w-1 rounded-r-full opacity-80",
                      tone.rail,
                    ].join(" ")}
                  />
                  <div className="flex items-center gap-3 pl-1.5">
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                        tone.iconBox,
                      ].join(" ")}
                    >
                      <Icon className="h-[17px] w-[17px]" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="min-w-0 truncate text-sm font-semibold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                          {item.title}
                        </p>

                        <span className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
                          {item.time}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-1 text-sm font-normal text-[#475467] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {remaining > 0 ? (
          <Link
            href="/admin/ai-reasoning-logs"
            className="mt-3 flex h-11 items-center justify-center rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] text-sm font-semibold text-[#475467] transition hover:border-[#06B6D4]/35 hover:bg-[#ECFEFF] hover:text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#122039] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#22D3EE]"
          >
            Xem thêm {remaining} hoạt động
          </Link>
        ) : null}
      </div>
    </article>
  );
}
