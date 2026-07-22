"use client";

import { Pagination } from "@/app/components/Pagination";

type AiConsultingPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function AiConsultingPagination({
  currentPage,
  totalPages,
  pageSize,
  total,
  onPageChange,
}: AiConsultingPaginationProps) {
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  return (
    <section className="admin-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-[var(--admin-muted-text)]">
        Hiển thị{" "}
        <span className="font-black text-[var(--admin-strong-text)]">
          {from}
        </span>{" "}
        -{" "}
        <span className="font-black text-[var(--admin-strong-text)]">
          {to}
        </span>{" "}
        trong{" "}
        <span className="font-black text-[var(--admin-strong-text)]">
          {total}
        </span>{" "}
        phiên AI tư vấn
      </p>

      <div className="min-w-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          compact
        />
      </div>
    </section>
  );
}
