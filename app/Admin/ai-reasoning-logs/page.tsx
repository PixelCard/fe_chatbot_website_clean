"use client";

import { useMemo, useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import { AiReasoningFilterBar } from "./components/AiReasoningFilterBar";
import { AiReasoningKpiGrid } from "./components/AiReasoningKpiGrid";
import { AiReasoningLogList } from "./components/AiReasoningLogList";
import { useAiReasoningLogsApi } from "./hooks";
import {
  buildAiReasoningSummary,
  filterAiReasoningLogs,
} from "./lib/aiReasoningHelpers";
import type { AiReasoningFilterState } from "./types/aiReasoning.types";

const PAGE_SIZE = 10;
const DEFAULT_FILTERS: AiReasoningFilterState = {
  search: "",
  feedback: "ALL",
  riskLevel: "ALL",
  deviceCategory: "ALL",
  scoreLevel: "ALL",
  golden: "ALL",
};

export default function AiReasoningLogsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<AiReasoningFilterState>(DEFAULT_FILTERS);

  const { items, isLoading, error, refetch } = useAiReasoningLogsApi();

  const filteredItems = useMemo(
    () => filterAiReasoningLogs(items, filters),
    [filters, items],
  );
  const summary = useMemo(
    () => buildAiReasoningSummary(filteredItems),
    [filteredItems],
  );
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredItems]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleFilterChange = (nextFilters: AiReasoningFilterState) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleFilterReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages] as const;
    }

    if (currentPage >= totalPages - 3) {
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

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ] as const;
  }, [currentPage, totalPages]);

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
          <>
            <AiReasoningFilterBar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleFilterReset}
              logs={items}
            />

            <AiReasoningLogList
              logs={pagedLogs}
              total={filteredItems.length}
              isLoading={isLoading}
            />
          </>
        ) : null}

        {!error && filteredItems.length > 0 ? (
          <section className="admin-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--admin-muted-text)]">
              Hiển thị{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              -{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {Math.min(currentPage * PAGE_SIZE, filteredItems.length)}
              </span>{" "}
              trong{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {filteredItems.length}
              </span>{" "}
              log
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
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
                      item === currentPage
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
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
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
