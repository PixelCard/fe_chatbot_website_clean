import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Bot,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { AiQuality } from "../../type/types";

export default function AiQualityCard({
  data,
  loading,
  error,
}: {
  data: AiQuality;
  loading?: boolean;
  error?: string | null;
}) {
  if (loading) {
    return (
      <div className="h-80 animate-pulse rounded-3xl border border-[#1E2A3F] bg-[#101B2E]" />
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm text-[#FCA5A5]">
        Không tải được chất lượng AI: {error}
      </div>
    );
  }

  const total = data.likes + data.dislikes;

  if (!total) {
    return (
      <div className="rounded-3xl border border-[#1E2A3F] bg-[#101B2E] p-5 text-sm text-[#9CA3AF]">
        Chưa có phản hồi AI.
      </div>
    );
  }

  const likeRate = Math.round((data.likes / total) * 100);
  const dislikeRate = 100 - likeRate;

  const status =
    likeRate >= 80
      ? {
          label: "Ổn định",
          className: "border-[#06B6D4]/35 bg-[#06B6D4]/10 text-[#22D3EE]",
        }
      : likeRate >= 60
        ? {
            label: "Cần theo dõi",
            className: "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#FBBF24]",
          }
        : {
            label: "Cần cải thiện",
            className: "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#F87171]",
          };

  return (
    <article className="overflow-hidden rounded-3xl border border-[#1E2A3F] bg-[#101B2E] shadow-[0_24px_80px_-55px_rgba(249,115,22,0.32)]">
      <div className="relative p-4 sm:p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(6,182,212,0.1),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(249,115,22,0.08),transparent_30%)]"
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#22D3EE]">
              <Bot className="h-5 w-5" />
            </span>

            <div>
              <h3 className="text-base font-semibold text-white">Chất lượng AI</h3>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">
                Theo dõi phản hồi tư vấn AI từ khách hàng.
              </p>
            </div>
          </div>

          <Link
            href="/admin/ai-consulting"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#22D3EE] transition hover:text-white"
          >
            Chi tiết
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative mt-5 grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)] lg:items-center">
          <div className="flex justify-center">
            <div
              className="relative h-40 w-40 rounded-full shadow-[0_0_40px_-22px_rgba(249,115,22,0.52)]"
              style={{
                background: `conic-gradient(#06B6D4 0% ${likeRate}%, #EF4444 ${likeRate}% 100%)`,
              }}
            >
              <div className="absolute inset-[18px] rounded-full bg-[#07111F]" />
              <div className="absolute inset-[30px] flex flex-col items-center justify-center rounded-full border border-[#1E2A3F] bg-[#101B2E]">
                <p className="text-3xl font-bold leading-none text-white">
                  {likeRate}%
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                  Hài lòng
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-[#1E2A3F] bg-[#0D1728]/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#9CA3AF]">Tổng phản hồi</p>
                <span
                  className={[
                    "rounded-full border px-2.5 py-1 text-xs font-semibold",
                    status.className,
                  ].join(" ")}
                >
                  {status.label}
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-white">{total}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Lượt thích</p>
                    <p className="mt-1 text-xl font-bold text-white">{data.likes}</p>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#22D3EE]">
                    <ThumbsUp className="h-4.5 w-4.5" />
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium text-[#22D3EE]">
                  {likeRate}% tích cực
                </p>
              </div>

              <div className="rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Không hài lòng</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {data.dislikes}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EF4444]/25 bg-[#EF4444]/10 text-[#F87171]">
                    <ThumbsDown className="h-4.5 w-4.5" />
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium text-[#F87171]">
                  {dislikeRate}% tiêu cực
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex flex-wrap items-center gap-4 text-xs text-[#9CA3AF]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#06B6D4]" />
            Like
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            Dislike
          </span>
        </div>

        {data.recentDislikes.length > 0 ? (
          <div className="relative mt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">
                Phản hồi cần kiểm tra
              </p>
              <span className="rounded-full border border-[#EF4444]/25 bg-[#EF4444]/10 px-2.5 py-1 text-xs font-semibold text-[#F87171]">
                {data.recentDislikes.length} mục
              </span>
            </div>

            <ul className="space-y-2">
              {data.recentDislikes.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-[#1E2A3F] bg-[#0D1728]/80 p-3 text-xs text-[#D1D5DB] transition hover:border-[#EF4444]/30 hover:bg-[#122039]"
                >
                  <div className="flex gap-2">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F87171]" />
                    <span className="line-clamp-2">{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
