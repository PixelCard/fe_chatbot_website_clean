"use client";

import { ActionButton } from "@/app/components/common/action-button/ActionButton";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  Wrench,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import type { ChatFilterState } from "../../types/chat.types";

type Props = {
  filters: ChatFilterState;
  onChange: (next: ChatFilterState) => void;
  onReset: () => void;
};

export function ChatFilterBar({ filters, onChange, onReset }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchDraft, setSearchDraft] = useState(filters.search);

  const handleSearch = () => {
    onChange({ ...filters, search: searchDraft.trim() });
  };

  const handleReset = () => {
    setSearchDraft("");
    setShowAdvanced(false);
    onReset();
  };

  const advancedFilters = (
    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--admin-soft-panel-border)] pt-4 sm:grid-cols-2 xl:grid-cols-4">
      <label className={labelClass}>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[var(--admin-muted-text)]" />
          Địa chỉ
        </span>
        <input
          type="text"
          className={inputClass}
          placeholder="Nhập quận, tên đường..."
          value={filters.address}
          onChange={(event) =>
            onChange({ ...filters, address: event.target.value })
          }
        />
      </label>

      <label className={labelClass}>
        <span className="flex items-center gap-1.5">
          <Wrench className="h-3.5 w-3.5 text-[var(--admin-muted-text)]" />
          Tên thợ
        </span>
        <input
          type="text"
          className={inputClass}
          placeholder="Nhập tên thợ..."
          value={filters.technicianName}
          onChange={(event) =>
            onChange({ ...filters, technicianName: event.target.value })
          }
        />
      </label>

      <div className={labelClass}>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[var(--admin-muted-text)]" />
          Thời gian
        </span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            title="Từ ngày"
            className={dateInputClass}
            value={filters.startDate}
            onChange={(event) =>
              onChange({ ...filters, startDate: event.target.value })
            }
          />
          <input
            type="date"
            title="Đến ngày"
            className={dateInputClass}
            value={filters.endDate}
            onChange={(event) =>
              onChange({ ...filters, endDate: event.target.value })
            }
          />
        </div>
      </div>

      <div className={labelClass}>
        <span>Cảnh báo</span>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={filters.isDangerous === "YES"}
            tone="red"
            onClick={() =>
              onChange({
                ...filters,
                isDangerous: filters.isDangerous === "YES" ? "ALL" : "YES",
              })
            }
          >
            {filters.isDangerous === "YES" ? "✓ Nguy hiểm" : "Nguy hiểm"}
          </FilterChip>

          <FilterChip
            active={filters.isFlagged === "YES"}
            tone="amber"
            onClick={() =>
              onChange({
                ...filters,
                isFlagged: filters.isFlagged === "YES" ? "ALL" : "YES",
              })
            }
          >
            {filters.isFlagged === "YES" ? "✓ Gắn cờ" : "Gắn cờ"}
          </FilterChip>
        </div>
      </div>
    </div>
  );

  return (
    <section className="admin-card rounded-2xl p-4 transition-colors duration-150">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-[18px] w-[18px] text-[var(--admin-muted-text)]" />
          </div>
          <input
            type="text"
            className={searchInputClass}
            placeholder="Tìm mã phiên chat, tên khách hàng, số điện thoại..."
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch();
            }}
          />
        </div>

        <div className="w-full xl:w-60">
          <select
            className={selectClass}
            value={filters.status}
            onChange={(event) =>
              onChange({ ...filters, status: event.target.value })
            }
          >
            <ThemeOption value="ALL">Tất cả tiến trình</ThemeOption>
            <ThemeOption value="AI_CONSULTING">AI đang tư vấn</ThemeOption>
            <ThemeOption value="BROADCASTING">Đang phát đơn</ThemeOption>
            <ThemeOption value="MATCHED">Đã có thợ</ThemeOption>
            <ThemeOption value="EN_ROUTE">Thợ đang di chuyển</ThemeOption>
            <ThemeOption value="ARRIVED">Thợ đã tới nơi</ThemeOption>
            <ThemeOption value="IN_PROGRESS">Đang sửa thực địa</ThemeOption>
            <ThemeOption value="COMPLETED">Đã hoàn thành</ThemeOption>
            <ThemeOption value="CANCELLED">Đã hủy</ThemeOption>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2 xl:flex xl:shrink-0">
          <ActionButton
            onClick={handleSearch}
            icon={Search}
            label="Tìm"
            tone="success"
            size="md"
          />

          <button
            type="button"
            onClick={() => setShowAdvanced((current) => !current)}
            className={[
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]",
              showAdvanced
                ? "border-[#06B6D4]/45 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
            ].join(" ")}
          >
            <Filter className="h-4 w-4" />
            <span>Lọc</span>
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <ActionButton
            onClick={handleReset}
            icon={RotateCcw}
            label="Reset"
            tone="danger"
            size="md"
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showAdvanced ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {advancedFilters}
          </motion.div>
        ) : null}
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
  children: ReactNode;
  tone: "cyan" | "red" | "amber";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-11 rounded-xl border px-3.5 text-xs font-bold transition-colors duration-150",
        active
          ? getActiveChipClass(tone)
          : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function getActiveChipClass(tone: "cyan" | "red" | "amber") {
  if (tone === "red") {
    return "border-[#EF4444]/45 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]";
  }

  if (tone === "amber") {
    return "border-[#F59E0B]/45 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]";
  }

  return "border-[#06B6D4]/45 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]";
}

const selectClass =
  "h-10 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-bold text-[var(--admin-strong-text)] outline-none transition-colors duration-150 backdrop-blur-sm [color-scheme:light] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:[color-scheme:dark]";

const inputClass =
  "h-10 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-bold text-[var(--admin-strong-text)] outline-none transition-colors duration-150 backdrop-blur-sm placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";

const dateInputClass =
  "h-10 w-full cursor-pointer rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-bold text-[var(--admin-strong-text)] outline-none transition-colors duration-150 backdrop-blur-sm [color-scheme:light] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:[color-scheme:dark]";

const searchInputClass =
  "h-10 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] pl-[42px] pr-3 text-sm font-bold text-[var(--admin-strong-text)] outline-none transition-colors duration-150 backdrop-blur-sm placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";

const labelClass = "block space-y-1.5 text-sm font-bold text-[var(--admin-strong-text)]";
