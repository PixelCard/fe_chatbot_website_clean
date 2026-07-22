import type { DeviceItem } from "../types/device.types";
import DeviceDesktopRow from "./DeviceDesktopRow";
import DeviceMobileCard from "./DeviceMobileCard";
import EmptyDeviceState from "./EmptyDeviceState";

export default function DeviceTable({
  rows,
  expandedId,
  onToggleExpand,
}: {
  rows: DeviceItem[];
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
}) {
  if (!rows.length) return <EmptyDeviceState />;

  return (
    <section className="admin-card overflow-hidden rounded-2xl">
      <div className="hidden xl:block">
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-[9%]" />
            <col className="w-[19%]" />
            <col className="w-[17%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[17%]" />
            <col className="w-[6%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Thiết bị</th>
              <th className="px-5 py-4">Khách hàng</th>
              <th className="px-5 py-4">Model</th>
              <th className="px-5 py-4">Vị trí</th>
              <th className="px-5 py-4">Bảo trì kế tiếp</th>
              <th className="px-5 py-4 text-right">Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <DeviceDesktopRow
                key={row.id}
                row={row}
                isExpanded={expandedId === row.id}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 xl:hidden">
        {rows.map((row) => (
          <DeviceMobileCard
            key={row.id}
            row={row}
            isExpanded={expandedId === row.id}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </div>
    </section>
  );
}