"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

type PaginationItem =
  | { type: "page"; page: number; key: string }
  | { type: "ellipsis"; key: string };

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [goToValue, setGoToValue] = useState("");

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = clamp(currentPage, 1, safeTotalPages);

  const items = useMemo(
    () => buildPaginationItems(safeCurrentPage, safeTotalPages),
    [safeCurrentPage, safeTotalPages],
  );

  const canGoPrev = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < safeTotalPages;

  const handleGoToPage = () => {
    const nextPage = Number(goToValue.trim());
    if (!Number.isInteger(nextPage)) return;
    if (nextPage < 1 || nextPage > safeTotalPages) return;

    onPageChange(nextPage);
    setGoToValue("");
  };

  return (
    <nav aria-label="Pagination" className="mt-4 flex w-full justify-center">
      <div className="w-fit max-w-full rounded-full border border-slate-200 bg-white px-2 py-2 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label="Trang trước"
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={!canGoPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {items.map((item) => {
              if (item.type === "ellipsis") {
                return (
                  <span
                    key={item.key}
                    className="inline-flex h-10 w-8 items-center justify-center text-sm font-medium text-slate-400"
                  >
                    ...
                  </span>
                );
              }

              const isActive = item.page === safeCurrentPage;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onPageChange(item.page)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                    isActive
                      ? "border-violet-300 bg-violet-100 text-violet-700"
                      : "border-slate-200 text-slate-900 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {item.page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Trang sau"
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={!canGoNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-1.5">
            <label htmlFor="pagination-go-to" className="sr-only">
              Go to page
            </label>
            <input
              id="pagination-go-to"
              type="number"
              min={1}
              max={safeTotalPages}
              inputMode="numeric"
              value={goToValue}
              onChange={(event) => setGoToValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleGoToPage();
                }
              }}
              placeholder="Go"
              aria-label="Go to page"
              className="h-10 w-16 rounded-full border border-slate-200 px-3 text-center text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />

            <button
              type="button"
              onClick={handleGoToPage}
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Go
            </button>
          </div>

          <label className="relative inline-flex h-10 items-center rounded-full border border-slate-200 bg-white pl-3 pr-8 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <span>{pageSize} / page</span>
            <select
              aria-label="Page size"
              value={pageSize}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                onPageSizeChange(nextSize);
                onPageChange(1);
              }}
              className="absolute inset-0 cursor-pointer appearance-none rounded-full bg-transparent opacity-0"
            >
              {pageSizeOptions.map((size) => (
                <option key={`size-${size}`} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500" />
          </label>
        </div>
      </div>
    </nav>
  );
}

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return { type: "page", page, key: `page-${page}` };
    });
  }

  if (currentPage <= 4) {
    return [
      { type: "page", page: 1, key: "page-1" },
      { type: "page", page: 2, key: "page-2" },
      { type: "page", page: 3, key: "page-3" },
      { type: "page", page: 4, key: "page-4" },
      { type: "page", page: 5, key: "page-5" },
      { type: "ellipsis", key: "ellipsis-right" },
      { type: "page", page: totalPages, key: `page-${totalPages}` },
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      { type: "page", page: 1, key: "page-1" },
      { type: "ellipsis", key: "ellipsis-left" },
      { type: "page", page: totalPages - 4, key: `page-${totalPages - 4}` },
      { type: "page", page: totalPages - 3, key: `page-${totalPages - 3}` },
      { type: "page", page: totalPages - 2, key: `page-${totalPages - 2}` },
      { type: "page", page: totalPages - 1, key: `page-${totalPages - 1}` },
      { type: "page", page: totalPages, key: `page-${totalPages}` },
    ];
  }

  return [
    { type: "page", page: 1, key: "page-1" },
    { type: "ellipsis", key: "ellipsis-left-middle" },
    { type: "page", page: currentPage - 1, key: `page-${currentPage - 1}` },
    { type: "page", page: currentPage, key: `page-${currentPage}` },
    { type: "page", page: currentPage + 1, key: `page-${currentPage + 1}` },
    { type: "ellipsis", key: "ellipsis-right-middle" },
    { type: "page", page: totalPages, key: `page-${totalPages}` },
  ];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
