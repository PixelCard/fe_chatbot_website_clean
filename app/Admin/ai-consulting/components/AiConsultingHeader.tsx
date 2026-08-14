"use client";

import Link from "next/link";
import { BrainCircuit, RefreshCcw, ScrollText } from "lucide-react";

type AiConsultingHeaderProps = {
  title: string;
  description?: string;
  total: number;
  error?: { message: string } | null;
  isRefreshing?: boolean;
  onRefresh: () => void;
};

export default function AiConsultingHeader({
  title,
  description,
  total,
  error,
  isRefreshing = false,
  onRefresh,
}: AiConsultingHeaderProps) {
  return (
    <section className="admin-card overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
        <div className="flex min-w-0 items-start gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE] sm:flex">
            <BrainCircuit className="h-6 w-6" />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
                {title}
              </h1>

              <span className="rounded-full border border-[#06B6D4]/25 bg-[#06B6D4]/10 px-3 py-1 text-xs font-bold text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
                AI Quality
              </span>
            </div>

            {description ? (
              <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
                {description}
              </p>
            ) : null}

            {error ? (
              <p className="mt-3 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm font-semibold text-[var(--admin-error)]">
                Không tải được dữ liệu AI tư vấn: {error.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/ai-reasoning-logs"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-control-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] shadow-sm transition hover:border-[#06B6D4]/50 hover:bg-[#06B6D4]/10 hover:text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#22D3EE]"
          >
            <ScrollText className="h-4 w-4 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]" />
            Log suy luận
          </Link>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw
              className={[
                "h-4 w-4",
                isRefreshing ? "animate-spin" : "",
              ].join(" ")}
            />
            Làm mới
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-5 py-3 sm:px-6 lg:px-7">
        <p className="text-sm font-semibold text-[var(--admin-muted-text)]">
          Đang theo dõi{" "}
          <span className="font-black text-[var(--admin-strong-text)]">
            {total}
          </span>{" "}
          phiên AI tư vấn để đánh giá chất lượng.
        </p>
      </div>
    </section>
  );
}