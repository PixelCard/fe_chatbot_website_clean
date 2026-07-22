import Link from "next/link";
import type { DeviceInsight } from "../../type/types";

const barTones = [
  {
    rank: "border-[#FF8A1F]/25 bg-[#FFF7ED] text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#FF8A1F]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
    bar: "linear-gradient(90deg, #FF8A1F 0%, #FDBA74 100%)",
  },
  {
    rank: "border-[#06B6D4]/25 bg-[#ECFEFF] text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
    bar: "linear-gradient(90deg, #06B6D4 0%, #22D3EE 100%)",
  },
  {
    rank: "border-[#22C55E]/25 bg-[#F0FDF4] text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    bar: "linear-gradient(90deg, #22C55E 0%, #86EFAC 100%)",
  },
  {
    rank: "border-[#8B5CF6]/25 bg-[#F5F3FF] text-[#6D28D9] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#8B5CF6]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#C4B5FD]",
    bar: "linear-gradient(90deg, #8B5CF6 0%, #C4B5FD 100%)",
  },
  {
    rank: "border-[#64748B]/25 bg-[#F8FAFC] text-[#475467] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#64748B]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]",
    bar: "linear-gradient(90deg, #64748B 0%, #CBD5E1 100%)",
  },
];

function getTone(index: number) {
  return barTones[index] ?? barTones[barTones.length - 1];
}

export default function TopDeviceBarChart({
  title,
  href,
  data,
  loading,
  error,
}: {
  title: string;
  href: string;
  data: DeviceInsight[];
  loading?: boolean;
  error?: string | null;
}) {
  if (loading) {
    return (
      <div className="h-80 animate-pulse rounded-3xl border border-[#D0D5DD] bg-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]" />
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm font-semibold text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
        Không tải được dữ liệu top thiết bị: {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-3xl border border-[#D0D5DD] bg-white p-4 text-sm font-medium text-[#475467] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
        Chưa có dữ liệu top thiết bị.
      </div>
    );
  }

  const visibleData = data.slice(0, 5);
  const maxValue = Math.max(...visibleData.map((item) => item.value), 1);

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-3xl border border-[#D0D5DD] bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.14)] transition hover:border-[#CBD5E1] hover:bg-[#FCFCFD] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#122039]"
    >
      <div className="border-b border-[#E4E7EC] px-5 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white sm:text-xl">
              {title}
            </h3>

            <p className="mt-0.5 text-sm font-medium text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
              Thiết bị được nhắc đến nhiều nhất.
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-[#FF8A1F]/25 bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
            Top {visibleData.length}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2.5">
          {visibleData.map((item, index) => {
            const tone = getTone(index);
            const percent = Math.max(6, (item.value / maxValue) * 100);

            return (
              <div
                key={item.name}
                className="rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-3 transition group-hover:border-[#D0D5DD] group-hover:bg-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:group-hover:border-[#06B6D4]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:group-hover:bg-[#122039]"
              >
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={[
                        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-bold",
                        tone.rank,
                      ].join(" ")}
                    >
                      {index + 1}
                    </span>

                    <span className="truncate text-sm font-semibold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                      {item.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-bold text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
                    {item.value}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#E4E7EC] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      background: tone.bar,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {data.length > visibleData.length ? (
          <div className="mt-3 rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] px-4 py-3 text-center text-sm font-medium text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
            Còn {data.length - visibleData.length} thiết bị khác.
          </div>
        ) : null}
      </div>
    </Link>
  );
}