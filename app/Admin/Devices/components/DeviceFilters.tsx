import { Filter, Search } from "lucide-react";
import type {
  MaintenanceFilter,
  WarrantyFilter,
} from "../types/device.types";

type Props = {
  searchTerm: string;
  categories: string[];
  categoryFilter: string;
  warrantyFilter: WarrantyFilter;
  maintenanceFilter: MaintenanceFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onWarrantyChange: (value: WarrantyFilter) => void;
  onMaintenanceChange: (value: MaintenanceFilter) => void;
};

const controlClass =
  "h-11 w-full rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";

export default function DeviceFilters({
  searchTerm,
  categories,
  categoryFilter,
  warrantyFilter,
  maintenanceFilter,
  onSearchChange,
  onCategoryChange,
  onWarrantyChange,
  onMaintenanceChange,
}: Props) {
  return (
    <section className="admin-card rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
          <Filter className="h-5 w-5" />
        </span>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--admin-strong-text)]">
            Bộ lọc thiết bị
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--admin-muted-text)]">
            Tìm theo loại thiết bị, hãng, model, vị trí đặt, khách hàng hoặc số
            điện thoại.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(320px,1.4fr)_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-soft-text)]" />

          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm thiết bị, model, khách hàng..."
            className={[controlClass, "pl-10"].join(" ")}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
          className={controlClass}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "ALL" ? "Tất cả loại thiết bị" : category}
            </option>
          ))}
        </select>

        <select
          value={warrantyFilter}
          onChange={(event) =>
            onWarrantyChange(event.target.value as WarrantyFilter)
          }
          className={controlClass}
        >
          <option value="ALL">Tất cả bảo hành</option>
          <option value="HAS_WARRANTY">Có bảo hành</option>
          <option value="NO_WARRANTY">Không có bảo hành</option>
        </select>

        <select
          value={maintenanceFilter}
          onChange={(event) =>
            onMaintenanceChange(event.target.value as MaintenanceFilter)
          }
          className={controlClass}
        >
          <option value="ALL">Tất cả bảo trì</option>
          <option value="HAS_NEXT">Có ngày bảo trì tiếp theo</option>
          <option value="NO_NEXT">Chưa có ngày bảo trì</option>
        </select>
      </div>
    </section>
  );
}