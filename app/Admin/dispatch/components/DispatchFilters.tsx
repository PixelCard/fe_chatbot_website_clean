import { RotateCcw, Search } from "lucide-react";

import type { JobStatus } from "../types/dispatch.types";
import { JOB_STATUS_VI } from "../types/dispatch.types";

type Props = {
  searchTerm: string;
  statusFilter: "ALL" | JobStatus;
  deviceFilter: string;
  areaFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "ALL" | JobStatus) => void;
  onDeviceChange: (value: string) => void;
  onAreaChange: (value: string) => void;
};

const statusOptions: { value: "ALL" | JobStatus; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "AI_CONSULTING", label: JOB_STATUS_VI.AI_CONSULTING },
  { value: "BROADCASTING", label: JOB_STATUS_VI.BROADCASTING },
  { value: "MATCHED", label: JOB_STATUS_VI.MATCHED },
  { value: "EN_ROUTE", label: JOB_STATUS_VI.EN_ROUTE },
  { value: "ARRIVED", label: JOB_STATUS_VI.ARRIVED },
  { value: "IN_PROGRESS", label: JOB_STATUS_VI.IN_PROGRESS },
  { value: "COMPLETED", label: JOB_STATUS_VI.COMPLETED },
  { value: "CANCELLED", label: JOB_STATUS_VI.CANCELLED },
];

const deviceOptions = [
  { value: "ALL", label: "Tất cả thiết bị" },
  { value: "Máy giặt", label: "Máy giặt" },
  { value: "Điều hòa", label: "Điều hòa" },
  { value: "Tủ lạnh", label: "Tủ lạnh" },
  { value: "Bếp từ", label: "Bếp từ" },
  { value: "Lò vi sóng", label: "Lò vi sóng" },
  { value: "Bình nóng lạnh", label: "Bình nóng lạnh" },
];

const areaOptions = [
  { value: "ALL", label: "Tất cả khu vực" },
  { value: "Quận 1", label: "Quận 1" },
  { value: "Quận 5", label: "Quận 5" },
  { value: "Quận 7", label: "Quận 7" },
  { value: "Quận 10", label: "Quận 10" },
  { value: "Bình Thạnh", label: "Quận Bình Thạnh" },
  { value: "Tân Bình", label: "Quận Tân Bình" },
];

export default function DispatchFilters({
  searchTerm,
  statusFilter,
  deviceFilter,
  areaFilter,
  onSearchChange,
  onStatusChange,
  onDeviceChange,
  onAreaChange,
}: Props) {
  const hasActiveFilter =
    searchTerm.trim().length > 0 ||
    statusFilter !== "ALL" ||
    deviceFilter !== "ALL" ||
    areaFilter !== "ALL";

  const resetFilters = () => {
    onSearchChange("");
    onStatusChange("ALL");
    onDeviceChange("ALL");
    onAreaChange("ALL");
  };

  return (
    <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.7fr)_240px_220px_220px_auto] xl:items-end">
        <div className="min-w-0">
          <label className="mb-1.5 block text-sm font-bold text-[var(--admin-strong-text)]">
            Tìm kiếm
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EA580C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]" />

            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Mã đơn, triệu chứng, tên khách hàng..."
              className="h-11 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] pl-10 pr-3 text-[15px] font-semibold text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] focus:border-[#FF8A1F]/60 focus:ring-2 focus:ring-[#FF8A1F]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:placeholder:text-[#64748B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus:border-[#06B6D4]/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus:ring-[#06B6D4]/25"
            />
          </div>
        </div>

        <SelectField
          label="Trạng thái"
          value={statusFilter}
          onChange={(value) => onStatusChange(value as "ALL" | JobStatus)}
          options={statusOptions}
        />

        <SelectField
          label="Thiết bị"
          value={deviceFilter}
          onChange={onDeviceChange}
          options={deviceOptions}
        />

        <SelectField
          label="Khu vực"
          value={areaFilter}
          onChange={onAreaChange}
          options={areaOptions}
        />

        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilter}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:border-[#FF8A1F]/45 hover:text-[#C2410C] disabled:cursor-not-allowed disabled:opacity-40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#D1D5DB] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Xóa lọc
        </button>
      </div>

      {hasActiveFilter ? (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--admin-soft-panel-border)] pt-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
          {searchTerm.trim() ? (
            <ActiveTag label={`Từ khóa: ${searchTerm}`} tone="cyan" />
          ) : null}

          {statusFilter !== "ALL" ? (
            <ActiveTag
              label={`Trạng thái: ${statusOptions.find((item) => item.value === statusFilter)?.label}`}
              tone="green"
            />
          ) : null}

          {deviceFilter !== "ALL" ? (
            <ActiveTag label={`Thiết bị: ${deviceFilter}`} tone="amber" />
          ) : null}

          {areaFilter !== "ALL" ? (
            <ActiveTag
              label={`Khu vực: ${areaOptions.find((item) => item.value === areaFilter)?.label}`}
              tone="rose"
            />
          ) : null}
        </div>
      ) : null}
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
    <div className="min-w-0">
      <label className="mb-1.5 block text-sm font-bold text-[var(--admin-strong-text)]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-[15px] font-semibold text-[var(--admin-strong-text)] outline-none transition focus:border-[#FF8A1F]/60 focus:ring-2 focus:ring-[#FF8A1F]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#E5E7EB] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus:border-[#06B6D4]/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus:ring-[#06B6D4]/25"
      >
        {options.map((item) => (
          <option
            key={item.value}
            value={item.value}
            className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]"
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
        "rounded-full border px-3 py-1 text-sm font-bold",
        toneClass,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
