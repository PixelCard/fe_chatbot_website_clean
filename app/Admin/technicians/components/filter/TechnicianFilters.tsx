import { RotateCcw, Search } from "lucide-react";

import type {
  ActiveFilter,
  StatusFilter,
  VerificationFilter,
} from "../../types/technician.types";
import {
  activeFilterOptions,
  statusFilterOptions,
  verificationFilterOptions,
} from "../../utils/technicianStatusMeta";

type Props = {
  searchTerm: string;
  statusFilter: StatusFilter;
  verificationFilter: VerificationFilter;
  activeFilter: ActiveFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onVerificationChange: (value: VerificationFilter) => void;
  onActiveChange: (value: ActiveFilter) => void;
};

export default function TechnicianFilters({
  searchTerm,
  statusFilter,
  verificationFilter,
  activeFilter,
  onSearchChange,
  onStatusChange,
  onVerificationChange,
  onActiveChange,
}: Props) {
  const hasActiveFilter =
    searchTerm.trim().length > 0 ||
    statusFilter !== "ALL" ||
    verificationFilter !== "ALL" ||
    activeFilter !== "ALL";

  const resetFilters = () => {
    onSearchChange("");
    onStatusChange("ALL");
    onVerificationChange("ALL");
    onActiveChange("ALL");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <div className="p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
          <div className="min-w-0 flex-[1.4] space-y-1.5">
            <label className={labelClass}>Tìm kiếm</label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EA580C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]" />

              <input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tên, SĐT, email..."
                className={searchInputClass}
              />
            </div>
          </div>

          <SelectField
            label="Trạng thái"
            value={statusFilter}
            onChange={(value) => onStatusChange(value as StatusFilter)}
            options={statusFilterOptions}
          />

          <SelectField
            label="Xác minh"
            value={verificationFilter}
            onChange={(value) =>
              onVerificationChange(value as VerificationFilter)
            }
            options={verificationFilterOptions}
          />

          <SelectField
            label="Tài khoản"
            value={activeFilter}
            onChange={(value) => onActiveChange(value as ActiveFilter)}
            options={activeFilterOptions}
          />

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilter}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-4 text-sm font-bold text-[#344054] transition hover:border-[#FF8A1F]/45 hover:text-[#C2410C] disabled:cursor-not-allowed disabled:opacity-40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#D1D5DB] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Xóa lọc
          </button>
        </div>

        {hasActiveFilter ? (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--admin-soft-panel-border)] pt-3 text-xs [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
            {searchTerm.trim() ? (
              <ActiveTag label={`Từ khóa: ${searchTerm}`} tone="cyan" />
            ) : null}

            {statusFilter !== "ALL" ? (
              <ActiveTag
                label={`Trạng thái: ${statusFilterOptions.find(
                  (item) => item.value === statusFilter,
                )?.label
                  }`}
                tone="green"
              />
            ) : null}

            {verificationFilter !== "ALL" ? (
              <ActiveTag
                label={`Xác minh: ${verificationFilterOptions.find(
                  (item) => item.value === verificationFilter,
                )?.label
                  }`}
                tone="amber"
              />
            ) : null}

            {activeFilter !== "ALL" ? (
              <ActiveTag
                label={`Tài khoản: ${activeFilterOptions.find(
                  (item) => item.value === activeFilter,
                )?.label
                  }`}
                tone="rose"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="min-w-0 flex-1 space-y-1.5">
      <label className={labelClass}>{label}</label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={selectClass}
      >
        {options.map((item) => (
          <option
            key={item.value}
            value={item.value}
            className="bg-white text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ActiveTag({
  label,
  tone,
}: {
  label: string;
  tone: "cyan" | "green" | "amber" | "rose";
}) {
  const toneClass = {
    cyan: "border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
    green:
      "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    amber:
      "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
    rose: "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]",
  }[tone];

  return (
    <span
      className={[
        "rounded-full border px-3 py-1 text-xs font-bold",
        toneClass,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

const labelClass =
  "text-sm font-bold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]";

const baseControlClass =
  "h-11 w-full rounded-xl border border-[#D0D5DD] bg-white px-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#667085] focus:border-[#FF8A1F]/70 focus:ring-2 focus:ring-[#FF8A1F]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:placeholder:text-[#94A3B8] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus:border-[#06B6D4]/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus:ring-[#06B6D4]/25";

const searchInputClass = `${baseControlClass} pl-10`;

const selectClass = `${baseControlClass} cursor-pointer`;