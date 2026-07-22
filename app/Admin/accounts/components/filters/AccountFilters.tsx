"use client";

import { RotateCcw, Search, ShieldCheck, Tag, Users, X } from "lucide-react";

import type {
  AccountSearchType,
  RoleFilter,
  StatusFilter,
  VerifiedFilter,
} from "../../types/account.types";
import {
  ACCOUNT_SEARCH_TYPE_OPTIONS,
  ROLE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  VERIFIED_FILTER_OPTIONS,
} from "../../constants/account.constants";

type Props = {
  searchTerm: string;
  searchType: AccountSearchType;
  roleFilter: RoleFilter;
  statusFilter: StatusFilter;
  verifiedFilter: VerifiedFilter;
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: AccountSearchType) => void;
  onRoleChange: (value: RoleFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
  onVerifiedChange: (value: VerifiedFilter) => void;
};

const optionClassName =
  "bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]";

const activeCyanText =
  "text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]";

export default function AccountFilters({
  searchTerm,
  searchType,
  roleFilter,
  statusFilter,
  verifiedFilter,
  onSearchChange,
  onSearchTypeChange,
  onRoleChange,
  onStatusChange,
  onVerifiedChange,
}: Props) {
  const hasActiveFilter =
    searchTerm.trim().length > 0 ||
    searchType !== "ALL" ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    verifiedFilter !== "ALL";

  const resetFilters = () => {
    onSearchChange("");
    onSearchTypeChange("ALL");
    onRoleChange("ALL");
    onStatusChange("ALL");
    onVerifiedChange("ALL");
  };

  return (
    <section className="admin-card overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:gap-2">
        <div className="relative flex min-w-0 flex-1 overflow-hidden rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] transition focus-within:border-[var(--admin-control-hover-border)] focus-within:ring-2 focus-within:ring-[var(--admin-focus-ring)] hover:border-[var(--admin-control-hover-border)]">
          <select
            id="account-search-type"
            value={searchType}
            onChange={(e) =>
              onSearchTypeChange(e.target.value as AccountSearchType)
            }
            aria-label="Kiểu tìm kiếm"
            className="h-10 shrink-0 cursor-pointer border-r border-[var(--admin-soft-panel-border)] bg-transparent pl-3 pr-8 text-sm font-semibold text-[var(--admin-strong-text)] outline-none transition hover:text-[var(--admin-strong-text)]"
          >
            {ACCOUNT_SEARCH_TYPE_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
                className={optionClassName}
              >
                {item.label}
              </option>
            ))}
          </select>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted-text)]" />

            <input
              id="account-search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nhập từ khóa..."
              className="h-10 w-full bg-transparent pl-9 pr-9 text-sm font-semibold text-[var(--admin-strong-text)] outline-none placeholder:text-[var(--admin-muted-text)]"
            />

            {searchTerm.trim().length > 0 ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Xóa tìm kiếm"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--admin-muted-text)] transition hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="hidden h-8 w-px shrink-0 bg-[var(--admin-soft-panel-border)] lg:block" />

        <FilterSelect
          id="account-role-filter"
          icon={<Users className="h-3.5 w-3.5" />}
          value={roleFilter}
          onChange={(v) => onRoleChange(v as RoleFilter)}
          options={ROLE_FILTER_OPTIONS}
          active={roleFilter !== "ALL"}
        />

        <FilterSelect
          id="account-status-filter"
          icon={<Tag className="h-3.5 w-3.5" />}
          value={statusFilter}
          onChange={(v) => onStatusChange(v as StatusFilter)}
          options={STATUS_FILTER_OPTIONS}
          active={statusFilter !== "ALL"}
        />

        <FilterSelect
          id="account-verified-filter"
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          value={verifiedFilter}
          onChange={(v) => onVerifiedChange(v as VerifiedFilter)}
          options={VERIFIED_FILTER_OPTIONS}
          active={verifiedFilter !== "ALL"}
        />

        <div className="hidden h-8 w-px shrink-0 bg-[var(--admin-soft-panel-border)] lg:block" />

        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilter}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-3 text-sm font-semibold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Xóa lọc</span>
        </button>
      </div>

      {hasActiveFilter ? (
        <div className="flex flex-wrap gap-2 border-t border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)]/80 px-4 py-2.5">
          {searchTerm.trim() ? (
            <ActiveChip
              label={`"${searchTerm}"`}
              tone="info"
              onRemove={() => onSearchChange("")}
            />
          ) : null}

          {roleFilter !== "ALL" ? (
            <ActiveChip
              label={getRoleLabel(roleFilter)}
              tone="cyan"
              onRemove={() => onRoleChange("ALL")}
            />
          ) : null}

          {statusFilter !== "ALL" ? (
            <ActiveChip
              label={getStatusLabel(statusFilter)}
              tone={statusFilter === "LOCKED" ? "danger" : "success"}
              onRemove={() => onStatusChange("ALL")}
            />
          ) : null}

          {verifiedFilter !== "ALL" ? (
            <ActiveChip
              label={getVerifiedLabel(verifiedFilter)}
              tone={verifiedFilter === "VERIFIED" ? "info" : "warning"}
              onRemove={() => onVerifiedChange("ALL")}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function FilterSelect({
  id,
  icon,
  value,
  onChange,
  options,
  active,
}: {
  id: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  active: boolean;
}) {
  return (
    <div
      className={[
        "relative flex h-10 shrink-0 items-center overflow-hidden rounded-xl border transition",
        active
          ? "border-[#06B6D4]/50 bg-[#06B6D4]/10"
          : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none absolute left-3",
          active ? activeCyanText : "text-[var(--admin-muted-text)]",
        ].join(" ")}
      >
        {icon}
      </span>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-full cursor-pointer appearance-none bg-transparent pl-8 pr-7 text-sm font-semibold outline-none",
          active ? activeCyanText : "text-[var(--admin-strong-text)]",
        ].join(" ")}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className={optionClassName}>
            {opt.label}
          </option>
        ))}
      </select>

      <svg
        className={[
          "pointer-events-none absolute right-2 h-3.5 w-3.5",
          active ? activeCyanText : "text-[var(--admin-muted-text)]",
        ].join(" ")}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

type ChipTone = "info" | "cyan" | "success" | "warning" | "danger";

function ActiveChip({
  label,
  tone,
  onRemove,
}: {
  label: string;
  tone: ChipTone;
  onRemove: () => void;
}) {
  const styles: Record<ChipTone, string> = {
    info: "border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
    cyan: "border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#0369A1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#38BDF8]",
    success: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    warning: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
    danger: "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]",
  };

  return (
    <span
      className={[
        "inline-flex max-w-[220px] items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold",
        styles[tone],
      ].join(" ")}
    >
      <span className="truncate">{label}</span>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Xóa bộ lọc "${label}"`}
        className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full opacity-80 transition hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function getRoleLabel(v: RoleFilter) {
  if (v === "USER") return "Khách hàng";
  if (v === "TECHNICIAN") return "Thợ sửa chữa";
  if (v === "ADMIN") return "Admin";
  return "Tất cả";
}

function getStatusLabel(v: StatusFilter) {
  if (v === "ACTIVE") return "Đang hoạt động";
  if (v === "LOCKED") return "Bị khóa";
  return "Tất cả";
}

function getVerifiedLabel(v: VerifiedFilter) {
  if (v === "VERIFIED") return "Đã xác minh";
  if (v === "UNVERIFIED") return "Chưa xác minh";
  return "Tất cả";
}