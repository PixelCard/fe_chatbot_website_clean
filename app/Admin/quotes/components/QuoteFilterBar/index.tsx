"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  Wrench,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import type {
  QuoteFilterState,
  QuoteLifecycleStatus,
} from "../../types/quote.types";

type Props = {
  filters: QuoteFilterState;
  onChange: (next: QuoteFilterState) => void;
  onReset: () => void;
};

export function QuoteFilterBar({ filters, onChange, onReset }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchDraft, setSearchDraft] = useState(filters.keyword);

  const handleSearch = () => {
    onChange({ ...filters, keyword: searchDraft.trim() });
  };

  const handleReset = () => {
    setSearchDraft("");
    onReset();
  };

  const advancedFilters = (
    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[var(--admin-soft-panel-border)] pt-4 sm:grid-cols-2 xl:grid-cols-4">
      <label className={labelClass}>
        <span className="flex items-center gap-1.5">
          <MapPin size={13} className="text-[var(--admin-muted-text)]" />
          Khu vực ca máy
        </span>
        <input
          type="text"
          className={inputClass}
          placeholder="Nhập quận, huyện sửa chữa..."
          value={filters.address}
          onChange={(e) => onChange({ ...filters, address: e.target.value })}
        />
      </label>

      <label className={labelClass}>
        <span className="flex items-center gap-1.5">
          <Wrench size={13} className="text-[var(--admin-muted-text)]" />
          Thợ đảm nhận
        </span>
        <input
          type="text"
          className={inputClass}
          placeholder="Nhập tên kỹ thuật viên..."
          value={filters.technicianName}
          onChange={(e) =>
            onChange({ ...filters, technicianName: e.target.value })
          }
        />
      </label>

      <div className={labelClass}>
        <span className="flex items-center gap-1.5">
          <DollarSign
            size={13}
            className="text-[var(--admin-muted-text)]"
          />
          Khoảng chi phí quyết toán
        </span>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Từ đ"
            className={inputClass}
            value={filters.minAmount}
            onChange={(e) => onChange({ ...filters, minAmount: e.target.value })}
          />
          <input
            type="number"
            placeholder="Đến đ"
            className={inputClass}
            value={filters.maxAmount}
            onChange={(e) => onChange({ ...filters, maxAmount: e.target.value })}
          />
        </div>
      </div>

      <div className={labelClass}>
        <span>Phân loại rủi ro vận hành</span>
        <div className="mt-1.5 flex flex-wrap gap-2">
          <FilterChip
            active={filters.isOverdue}
            tone="red"
            onClick={() => onChange({ ...filters, isOverdue: !filters.isOverdue })}
          >
            {filters.isOverdue ? "✓ Ca treo quá hạn" : "+ Ca treo quá hạn"}
          </FilterChip>

          <FilterChip
            active={filters.isMismatch}
            tone="purple"
            onClick={() =>
              onChange({ ...filters, isMismatch: !filters.isMismatch })
            }
          >
            {filters.isMismatch ? "✓ Lệch tiến độ" : "+ Lệch tiến độ"}
          </FilterChip>
        </div>
      </div>
    </div>
  );

  return (
    <section className="admin-card shrink-0 rounded-2xl p-4 transition-colors duration-150">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-[18px] w-[18px] text-[var(--admin-muted-text)]" />
          </div>
          <input
            type="text"
            className={searchInputClass}
            placeholder="Tìm theo mã báo giá, mã ca chỉ huy, tên khách hàng, số điện thoại..."
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <div className="w-full lg:w-56">
          <select
            className={selectClass}
            value={filters.status}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value as QuoteLifecycleStatus | "all",
              })
            }
          >
            <ThemeOption value="all">Tất cả trạng thái</ThemeOption>
            <ThemeOption value="PENDING">PENDING (Đang chờ duyệt)</ThemeOption>
            <ThemeOption value="ACCEPTED">ACCEPTED (Đã đồng ý)</ThemeOption>
            <ThemeOption value="REJECTED">REJECTED (Đã từ chối)</ThemeOption>
          </select>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-5 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition-colors duration-150 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]"
          >
            <Search className="h-4 w-4" />
            Tìm
          </button>

          <button
            type="button"
            onClick={() => setShowAdvanced((curr) => !curr)}
            className={[
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all duration-200",
              showAdvanced
                ? "border-[#06B6D4]/45 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
            ].join(" ")}
          >
            <Filter className="h-4 w-4" />
            Lọc nâng cao
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition-colors duration-150 hover:border-[#EF4444]/45 hover:bg-[#EF4444]/10 hover:text-[#B91C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#F87171]"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {advancedFilters}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ThemeOption({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <option
      value={value}
      className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]"
    >
      {children}
    </option>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone: "cyan" | "red" | "purple";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 rounded-xl border px-3.5 text-xs font-bold transition-all duration-200",
        active
          ? tone === "red"
            ? "border-rose-300/80 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300"
            : tone === "purple"
              ? "border-violet-300/80 bg-violet-50 text-violet-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-violet-400/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-violet-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-violet-300"
              : "border-cyan-300/80 bg-cyan-50 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300"
          : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

const baseFieldClass =
  "h-11 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-bold text-[var(--admin-strong-text)] outline-none transition-colors duration-150 backdrop-blur-sm placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";

const selectClass = `${baseFieldClass} [color-scheme:light] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:[color-scheme:dark]`;

const inputClass = baseFieldClass;

const searchInputClass = `${baseFieldClass} pl-[42px] pr-3`;

const labelClass =
  "block space-y-1.5 text-sm font-bold text-[var(--admin-strong-text)]";
