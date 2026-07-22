import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { JOB_STATUS_OPTIONS } from "../../constants/repairSession.constants";
import type { RepairSessionFilterState } from "../../hooks/useRepairSessionFilters";

export const filterControlClass =
  "h-11 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-semibold text-[var(--admin-strong-text)] outline-none transition hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)] placeholder:text-[var(--admin-muted-text)]";

export function RepairSessionSearchField({
  value,
  onChange,
  onSubmit,
  placeholder = "Tìm mã ca, khách hàng, số điện thoại...",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">Tìm kiếm ca sửa chữa</span>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--admin-muted-text)]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSubmit();
        }}
        placeholder={placeholder}
        className={`${filterControlClass} pl-[42px]`}
      />
    </label>
  );
}

export function RepairSessionStatusSelect({
  value,
  onChange,
}: {
  value: RepairSessionFilterState["status"];
  onChange: (value: RepairSessionFilterState["status"]) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">Trạng thái ca sửa chữa</span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as RepairSessionFilterState["status"])
        }
        className={filterControlClass}
      >
        {JOB_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RepairSessionAdvancedFilters({
  filters,
  deviceTypes,
  onPatch,
}: {
  filters: RepairSessionFilterState;
  deviceTypes: string[];
  onPatch: (patch: Partial<RepairSessionFilterState>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <FilterField label="Loại thiết bị">
        <select
          value={filters.deviceType}
          onChange={(event) =>
            onPatch({ deviceType: event.target.value, datePreset: "ALL" })
          }
          className={filterControlClass}
        >
          <option value="ALL">Tất cả thiết bị</option>
          {deviceTypes.map((deviceType) => (
            <option key={deviceType} value={deviceType}>
              {deviceType}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Khu vực">
        <input
          value={filters.area === "ALL" ? "" : filters.area}
          onChange={(event) =>
            onPatch({ area: event.target.value || "ALL", datePreset: "ALL" })
          }
          placeholder="Nhập quận, huyện..."
          className={filterControlClass}
        />
      </FilterField>

      <FilterField label="Trạng thái phân công">
        <select
          value={filters.hasTechnician}
          onChange={(event) =>
            onPatch({
              hasTechnician: event.target
                .value as RepairSessionFilterState["hasTechnician"],
            })
          }
          className={filterControlClass}
        >
          <option value="ALL">Tất cả</option>
          <option value="NO">Chưa có thợ</option>
          <option value="YES">Đã có thợ</option>
        </select>
      </FilterField>

      <FilterField label="Ngày tạo">
        <input
          type="date"
          value={filters.createdDate}
          onChange={(event) =>
            onPatch({ createdDate: event.target.value, datePreset: "ALL" })
          }
          className={filterControlClass}
        />
      </FilterField>

      <FilterField label="Ngày cập nhật">
        <input
          type="date"
          value={filters.updatedDate}
          onChange={(event) =>
            onPatch({ updatedDate: event.target.value, datePreset: "ALL" })
          }
          className={filterControlClass}
        />
      </FilterField>

      <FilterField label="Đặc tính ca">
        <div className="grid grid-cols-2 gap-2">
          <ToggleFilter
            active={filters.isDangerous === "YES"}
            onClick={() =>
              onPatch({
                isDangerous:
                  filters.isDangerous === "YES" ? "ALL" : "YES",
              })
            }
            tone="danger"
          >
            Nguy hiểm
          </ToggleFilter>
          <ToggleFilter
            active={filters.isStuck === "YES"}
            onClick={() =>
              onPatch({
                isStuck: filters.isStuck === "YES" ? "ALL" : "YES",
              })
            }
            tone="warning"
          >
            Ca treo
          </ToggleFilter>
        </div>
      </FilterField>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-[var(--admin-strong-text)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function ToggleFilter({
  active,
  onClick,
  tone,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone: "danger" | "warning";
  children: ReactNode;
}) {
  const activeClass =
    tone === "danger"
      ? "border-rose-400 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-500/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300"
      : "border-amber-400 bg-amber-50 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-500/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300";

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "h-11 rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]",
        active
          ? activeClass
          : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-theme-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
      ].join(" ")}
    >
      {active ? "✓ " : ""}
      {children}
    </button>
  );
}
