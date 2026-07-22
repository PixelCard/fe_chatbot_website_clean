import { History } from "lucide-react";
import type { DeviceRepairHistoryItem } from "../types/device.types";

export default function DeviceRepairHistory({
  items,
}: {
  items: DeviceRepairHistoryItem[];
}) {
  return (
    <section className="admin-card mt-4 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
          <History className="h-5 w-5" />
        </span>

        <h3 className="text-xl font-semibold tracking-tight text-[var(--admin-strong-text)]">
          Lịch sử sửa chữa của thiết bị
        </h3>
      </div>

      {!items.length ? (
        <p className="mt-4 rounded-2xl border border-dashed border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4 text-sm font-semibold text-[var(--admin-muted-text)]">
          Chưa có lịch sử sửa chữa.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-sm font-bold text-[var(--admin-muted-text)]">
                    {item.id}
                  </p>

                  <h4 className="mt-1 text-lg font-bold text-[var(--admin-strong-text)]">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm font-semibold text-[var(--admin-muted-text)]">
                    Thợ: {item.technicianName}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold text-[var(--admin-muted-text)]">
                    {item.date}
                  </p>

                  <span
                    className={[
                      "mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold",
                      item.status === "DONE"
                        ? "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] dark:text-[#4ADE80]"
                        : item.status === "PENDING"
                          ? "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] dark:text-[#FBBF24]"
                          : "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#B91C1C] dark:text-[#F87171]",
                    ].join(" ")}
                  >
                    {item.status === "DONE"
                      ? "Đã hoàn thành"
                      : item.status === "PENDING"
                        ? "Đang xử lý"
                        : "Đã hủy"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
