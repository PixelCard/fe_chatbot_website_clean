"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  compact?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  compact = false,
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState("");

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: Array<number | "..."> = [];

    if (compact && totalPages > 5) {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    } else if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }

    return pages;
  };

  const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    const page = parseInt(jumpPage, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage("");
    }
  };

  return (
    <div
      className={[
        "flex w-full flex-col items-center justify-center px-2",
        compact ? "gap-3 py-3" : "gap-6 py-5 sm:flex-row sm:gap-12",
      ].join(" ")}
    >
      <div className={["flex items-center", compact ? "gap-1" : "gap-2"].join(" ")}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={[
            "flex items-center gap-1.5 rounded-lg font-semibold text-[var(--admin-subtle-text,#64748B)] transition-colors hover:text-[var(--admin-strong-text,#ffffff)] disabled:opacity-40 disabled:hover:text-[var(--admin-subtle-text,#64748B)]",
            compact ? "h-9 px-2 text-sm" : "h-10 px-3 text-base",
          ].join(" ")}
        >
          <ChevronLeft size={compact ? 18 : 20} strokeWidth={2.5} />
          {!compact ? <span className="hidden sm:inline-block">Back</span> : null}
        </button>

        <div className={["flex items-center", compact ? "gap-1" : "gap-1.5"].join(" ")}>
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={[
                    "flex items-center justify-center text-[var(--admin-subtle-text,#64748B)]",
                    compact ? "h-9 w-7" : "h-10 w-8",
                  ].join(" ")}
                >
                  <MoreHorizontal size={compact ? 18 : 20} />
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={[
                  "flex items-center justify-center rounded-lg font-bold transition-colors select-none",
                  compact
                    ? "h-9 min-w-9 px-2 text-sm"
                    : "h-10 min-w-[40px] px-3 text-base",
                  isActive
                    ? "bg-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "bg-[var(--admin-soft-panel,#132039)] text-[var(--admin-muted-text,#94A3B8)] hover:bg-[var(--admin-control-hover-bg,#1E2A3F)] hover:text-[var(--admin-strong-text,#ffffff)]",
                ].join(" ")}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={[
            "flex items-center gap-1.5 rounded-lg font-semibold text-[var(--admin-subtle-text,#64748B)] transition-colors hover:text-[var(--admin-strong-text,#ffffff)] disabled:opacity-40 disabled:hover:text-[var(--admin-subtle-text,#64748B)]",
            compact ? "h-9 px-2 text-sm" : "h-10 px-3 text-base",
          ].join(" ")}
        >
          {!compact ? <span className="hidden sm:inline-block">Next</span> : null}
          <ChevronRight size={compact ? 18 : 20} strokeWidth={2.5} />
        </button>
      </div>

      <div
        className={[
          "items-center gap-3 font-medium text-[var(--admin-subtle-text,#64748B)]",
          compact ? "hidden" : "flex text-base",
        ].join(" ")}
      >
        <span>Go to</span>
        <div className="relative flex items-center">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={handleJump}
            className="h-10 w-[70px] rounded-lg border border-[var(--admin-soft-panel-border,#26364F)] bg-[var(--admin-soft-panel,#07111F)] px-2 text-center text-base font-bold text-[var(--admin-strong-text,#ffffff)] outline-none transition-colors placeholder:text-[var(--admin-placeholder,#334155)] focus:border-[#3B82F6] appearance-none"
          />
        </div>
        <span>Page</span>
      </div>
    </div>
  );
}
