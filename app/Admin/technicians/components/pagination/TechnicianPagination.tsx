import { ChevronLeft, ChevronRight } from "lucide-react";

import { getVisiblePages } from "../../utils/technicianStatusMeta";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextPageSize: number) => void;
};

export default function TechnicianPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 text-sm text-[var(--admin-muted-text)] sm:flex-row sm:items-center sm:justify-between [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
      <p>
        Trang <span className="font-semibold text-[var(--admin-strong-text)]">{page}</span>{" "}
        / <span className="font-semibold text-[var(--admin-strong-text)]">{totalPages}</span> •{" "}
        <span className="font-semibold text-[var(--admin-strong-text)]">{totalItems}</span> thợ
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-9 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-2.5 text-xs text-[var(--admin-theme-text)] outline-none [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]"
        >
          <option value={5}>5 / trang</option>
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
        </select>

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-xs font-medium text-[var(--admin-theme-text)] transition hover:text-[var(--admin-strong-text)] disabled:cursor-not-allowed disabled:opacity-40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]"
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {visiblePages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={[
                "h-9 min-w-9 rounded-xl border px-3 text-xs font-semibold transition",
                pageNumber === page
                  ? "border-[#FF8A1F] bg-[#FF8A1F]/15 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
                  : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]",
              ].join(" ")}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-xs font-medium text-[var(--admin-theme-text)] transition hover:text-[var(--admin-strong-text)] disabled:cursor-not-allowed disabled:opacity-40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]"
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
