import { ChevronDown } from "lucide-react";
import { getAdminDetailActionClass } from "../../_shared/styles/detailAction";
import type { DeviceItem } from "../types/device.types";
import DeviceDetailPanel from "./DeviceDetailPanel";

export default function DeviceDesktopRow({
  row,
  isExpanded,
  onToggleExpand,
}: {
  row: DeviceItem;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
}) {
  return (
    <>
      <tr className="border-b border-[var(--admin-card-border)] text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)]">
        <td className="whitespace-nowrap px-5 py-4 align-middle">
          <span className="font-mono text-sm font-bold text-[var(--admin-muted-text)]">
            #{row.id}
          </span>
        </td>

        <td className="px-5 py-4 align-middle">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-[15px] font-bold leading-5 text-[var(--admin-strong-text)]">
              {row.category}
            </p>

            <p className="truncate text-sm font-medium leading-5 text-[var(--admin-muted-text)]">
              {row.brandName}
            </p>
          </div>
        </td>

        <td className="px-5 py-4 align-middle">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-[15px] font-bold leading-5 text-[var(--admin-strong-text)]">
              {row.userName}
            </p>

            <p className="truncate text-sm font-medium leading-5 text-[var(--admin-muted-text)]">
              {row.userPhone}
            </p>
          </div>
        </td>

        <td className="px-5 py-4 align-middle">
          <p className="truncate text-sm font-semibold leading-5 text-[var(--admin-strong-text)]">
            {row.modelCode || "Chưa có"}
          </p>
        </td>

        <td className="px-5 py-4 align-middle">
          <p className="truncate text-sm font-semibold leading-5 text-[var(--admin-strong-text)]">
            {row.location || "Chưa có"}
          </p>
        </td>

        <td className="px-5 py-4 align-middle whitespace-nowrap">
          <span
            className={[
              "inline-flex h-7 items-center rounded-full border px-3 text-xs font-semibold",
              row.nextMaintenanceDate
                ? "border-[#FF7A00]/30 bg-[#FF7A00]/10 text-[#FF7A00]"
                : "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-[var(--admin-muted-text)]",
            ].join(" ")}
          >
            {row.nextMaintenanceDate || "Chưa có"}
          </span>
        </td>

        <td className="px-5 py-4 align-middle">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => onToggleExpand(row.id)}
              className={getAdminDetailActionClass({ active: isExpanded })}
              aria-label="Xem chi tiết thiết bị"
            >
              <span>Chi tiết</span>

              <ChevronDown
                className={[
                  "h-4 w-4 transition-transform duration-300",
                  isExpanded ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
          </div>
        </td>
      </tr>

      <tr>
        <td colSpan={7} className="p-0">
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
        </td>
      </tr>
    </>
  );
}
