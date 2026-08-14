"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";

import AdminShell from "@/app/Admin/dashboard/components/Action/AdminShell";
import { useAiReasoningLogsApi } from "../hooks";
import { AiReasoningLogDetail } from "../components/AiReasoningLogDetail";

type AiReasoningLogDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function AiReasoningLogDetailPage({
  params,
}: AiReasoningLogDetailPageProps) {
  const { id } = use(params);
  const numericId = Number(id);

  const { items, isLoading, error, refetch } = useAiReasoningLogsApi();

  const selectedLog = useMemo(() => {
    if (Number.isNaN(numericId)) return null;
    return items.find((item) => item.id === numericId) ?? null;
  }, [items, numericId]);

  return (
    <AdminShell>
      <div className="w-full min-w-0 space-y-5 px-4 py-4 sm:px-5 lg:px-6 xl:px-8">
        <section className="admin-card relative overflow-hidden rounded-2xl p-5 sm:p-6">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.16em]">
                <Link
                  href="/admin/ai-reasoning-logs"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 py-1.5 text-[var(--admin-strong-text)] transition hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Log suy luận AI
                </Link>

                <span className="inline-flex items-center rounded-full border border-[#06B6D4]/35 bg-[#06B6D4]/10 px-3 py-1.5 font-extrabold text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
                  LOG-{id}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-black tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
                Chi tiết log suy luận AI
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
                Xem nhanh câu hỏi, phản hồi AI, trạng thái trước và sau, cùng tín hiệu
                chất lượng của log đang được giám sát.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]"
              >
                <RefreshCcw className="h-4 w-4" />
                Tải lại
              </button>

              <Link
                href="/admin/ai-reasoning-logs"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#06B6D4]/35 bg-[#06B6D4]/10 px-4 text-sm font-bold text-[#0891B2] transition hover:bg-[#06B6D4]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Link>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 shadow-[0_16px_40px_-30px_rgba(239,68,68,0.45)]">
            <p className="text-sm font-bold text-[var(--admin-error)]">
              Không tải được chi tiết log AI.
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--admin-muted-text)]">
              {error.message}
            </p>
          </section>
        ) : null}

        {!error && isLoading ? (
          <section className="admin-card rounded-3xl p-5 sm:p-6">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-5">
                <div className="h-56 animate-pulse rounded-3xl bg-[var(--admin-card-soft-bg)]" />
                <div className="h-64 animate-pulse rounded-3xl bg-[var(--admin-card-soft-bg)]" />
              </div>

              <div className="h-96 animate-pulse rounded-3xl bg-[var(--admin-card-soft-bg)]" />
            </div>
          </section>
        ) : null}

        {!error && !isLoading ? (
          selectedLog ? (
            <AiReasoningLogDetail key={selectedLog.id} log={selectedLog} />
          ) : (
            <section className="admin-card flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-dashed p-8 text-center">
              <h2 className="text-lg font-black text-[var(--admin-strong-text)]">
                Không tìm thấy log AI
              </h2>

              <p className="mt-2 text-sm font-medium text-[var(--admin-muted-text)]">
                Không có log nào khớp với ID hiện tại.
              </p>

              <Link
                href="/admin/ai-reasoning-logs"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)]"
              >
                Về danh sách log
              </Link>
            </section>
          )
        ) : null}
      </div>
    </AdminShell>
  );
}
