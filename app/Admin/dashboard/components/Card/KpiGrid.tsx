import KpiCard from "./KpiCard";
import type { KpiItem } from "../../type/types";

export default function KpiGrid({
  items,
  loading,
  error,
}: {
  items: KpiItem[];
  loading?: boolean;
  error?: string | null;
}) {
  const visibleItems = items
    .filter((item) => {
      const key = String(item.key).toLowerCase();
      const label = String(item.label).toLowerCase();

      return !(
        key.includes("total") ||
        key.includes("verified") ||
        label.includes("tổng tài khoản") ||
        label.includes("đã xác minh")
      );
    })
    .slice(0, 4);

  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="admin-card h-[112px] animate-pulse rounded-2xl"
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm font-bold text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
        Không tải được KPI: {error}
      </div>
    );
  }

  if (!visibleItems.length) {
    return (
      <div className="admin-card rounded-2xl p-4 text-sm font-bold text-[var(--admin-strong-text)]">
        Chưa có dữ liệu KPI.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {visibleItems.map((item) => (
        <KpiCard key={item.key} item={item} />
      ))}
    </section>
  );
}