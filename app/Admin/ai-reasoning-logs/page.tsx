"use client";

import { useEffect, useMemo, useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import { AiReasoningKpiGrid } from "./components/AiReasoningKpiGrid";
import { AiReasoningLogList } from "./components/AiReasoningLogList";
import { useAiReasoningLogsApi } from "./hooks";
import { buildAiReasoningSummary } from "./lib/aiReasoningHelpers";

const PAGE_SIZE = 10;

export default function AiReasoningLogsPage() {
  const [page, setPage] = useState(1);

  const { items, isLoading, error, refetch } = useAiReasoningLogsApi();

  const summary = useMemo(() => buildAiReasoningSummary(items), [items]);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  const pagedLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages] as const;
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ] as const;
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages] as const;
  }, [page, totalPages]);

  return (
    <AdminShell>
      <div className="space-y-5">
        <AiReasoningKpiGrid
          total={summary.total}
          avgScore={summary.avgScore}
          highRisk={summary.highRisk}
          disliked={summary.disliked}
          golden={summary.golden}
          suspectedWrong={summary.suspectedWrong}
        />

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
            <p className="text-sm font-semibold text-[var(--admin-error)]">
              Không tải được log suy luận AI.
            </p>

            <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
              {error.message}
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-red-500/35 px-4 text-sm font-bold text-[var(--admin-error)] transition hover:bg-red-500/10"
            >
              Tải lại
            </button>
          </section>
        ) : null}

        {!error ? (
          <AiReasoningLogList
            logs={pagedLogs}
            total={items.length}
            isLoading={isLoading}
          />
        ) : null}

        {!error && items.length > 0 ? (
          <section className="admin-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--admin-muted-text)]">
              Hiển thị{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {(page - 1) * PAGE_SIZE + 1}
              </span>{" "}
              -{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {Math.min(page * PAGE_SIZE, items.length)}
              </span>{" "}
              trong{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {items.length}
              </span>{" "}
              log
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className={paginationButtonClass}
              >
                Trước
              </button>

              {visiblePages.map((item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="inline-flex h-9 min-w-9 items-center justify-center px-1 text-sm font-bold text-[var(--admin-muted-text)]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => goToPage(item)}
                    className={[
                      "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-bold transition",
                      item === page
                        ? "border-[#FF7A00] bg-[#FF7A00] text-white"
                        : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className={paginationButtonClass}
              >
                Sau
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}

const paginationButtonClass =
  "inline-flex h-9 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-bold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] disabled:cursor-not-allowed disabled:opacity-50";
