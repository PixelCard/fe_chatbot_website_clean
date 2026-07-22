import {
  CalendarDays,
  ChevronDown,
  MapPin,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { DeviceItem } from "../types/device.types";
import DeviceDetailPanel from "./DeviceDetailPanel";

export default function DeviceMobileCard({
  row,
  isExpanded,
  onToggleExpand,
}: {
  row: DeviceItem;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
}) {
  return (
    <article className="admin-card overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => onToggleExpand(row.id)}
        className="w-full p-4 text-left transition-colors hover:bg-[var(--admin-control-hover-bg)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-sm font-bold text-[var(--admin-muted-text)]">
              #{row.id}
            </p>

            <h3 className="mt-1 truncate text-xl font-bold text-[var(--admin-strong-text)]">
              {row.category} {row.brandName}
            </h3>

            <p className="mt-1 truncate text-sm text-[var(--admin-muted-text)]">
              {row.modelCode || "Chưa có model"}
            </p>
          </div>

          <ChevronDown
            className={[
              "h-5 w-5 shrink-0 text-[var(--admin-soft-text)] transition-transform",
              isExpanded ? "rotate-180 text-[var(--admin-accent)]" : "",
            ].join(" ")}
          />
        </div>

        <div className="mt-4 grid gap-2">
          <MobileInfo icon={UserRound} value={row.userName} />
          <MobileInfo icon={MapPin} value={row.location || "Chưa có vị trí"} />
          <MobileInfo
            icon={CalendarDays}
            value={row.nextMaintenanceDate || "Chưa có lịch bảo trì"}
          />
        </div>
      </button>

      <div
        className={[
          "grid transition-all duration-300 ease-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <DeviceDetailPanel device={row} />
        </div>
      </div>
    </article>
  );
}

function MobileInfo({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 py-2 text-sm font-semibold text-[var(--admin-strong-text)]">
      <Icon className="h-4 w-4 text-[var(--admin-accent)]" />
      <span className="truncate">{value}</span>
    </div>
  );
}
