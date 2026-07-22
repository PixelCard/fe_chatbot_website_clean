"use client";

import { RotateCcw, Search } from "lucide-react";
import type { ReviewFilterState } from "../../types/review.types";

export function ReviewFilterBar({
  filters,
  onChange,
  onReset,
}: {
  filters: ReviewFilterState;
  onChange: (next: ReviewFilterState) => void;
  onReset: () => void;
}) {
  return (
    <section className="admin-card rounded-2xl p-4">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_180px_200px_auto]">
        <div className="relative min-w-0">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-[var(--admin-muted-text)]">
            <Search className="h-4 w-4" />
          </span>

          <input
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="Tìm kiếm"
            className={searchInputClass}
          />
        </div>

        <select
          value={filters.rating}
          onChange={(event) =>
            onChange({
              ...filters,
              rating: event.target.value as ReviewFilterState["rating"],
            })
          }
          className={selectClass}
        >
          <option value="ALL">Lọc điểm</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>

        <select
          value={filters.createdRange}
          onChange={(event) =>
            onChange({
              ...filters,
              createdRange:
                event.target.value as ReviewFilterState["createdRange"],
            })
          }
          className={selectClass}
        >
          <option value="ALL">Thời gian</option>
          <option value="TODAY">Hôm nay</option>
          <option value="LAST_7_DAYS">7 ngày gần đây</option>
          <option value="THIS_MONTH">Tháng này</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:border-[#EF4444]/35 hover:bg-[#EF4444]/10 hover:text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#FCA5A5]"
        >
          <RotateCcw className="h-4 w-4" />
          Đặt lại
        </button>
      </div>
    </section>
  );
}

const selectClass =
  "h-10 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-semibold text-[var(--admin-strong-text)] outline-none transition hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";

const searchInputClass =
  "h-10 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] pl-11 pr-3 text-sm font-semibold text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";
