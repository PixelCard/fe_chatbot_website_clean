"use client";

import { useMemo, useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import {
  buildReviewSummary,
  filterReviews,
} from "@/app/Admin/Reviews/lib/reviewHelpers";
import { useReviewsApi } from "./hooks";
import { ReviewFilterBar } from "./components/filter/ReviewFilterBar";
import { ReviewDetailPanel } from "./components/detail/ReviewDetailPanel";
import { ReviewHeader } from "./components/layout/ReviewHeader";
import { ReviewKpiGrid } from "./components/layout/ReviewKpiGrid";
import { ReviewTable } from "./components/table/ReviewTable";
import { Pagination } from "@/app/components/Pagination";
import type { ReviewFilterState, ReviewItem } from "./types/review.types";
import AdminToastStack, {
  type AdminToast,
} from "@/app/components/admin/AdminToastStack";

const PAGE_SIZE = 10;

const defaultFilters: ReviewFilterState = {
  search: "",
  rating: "ALL",
  createdRange: "ALL",
  sentiment: "ALL",
  tag: "ALL",
  technicianId: "ALL",
  customerId: "ALL",
};

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ReviewFilterState>(defaultFilters);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const pushToast = (type: AdminToast["type"], text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const { items, isLoading, error, refetch } = useReviewsApi();

  const filteredItems = useMemo(
    () => filterReviews(items, filters),
    [items, filters],
  );
  const summary = useMemo(() => buildReviewSummary(filteredItems), [filteredItems]);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredItems]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <AdminShell>
      <section className="w-full min-w-0 space-y-5 py-4 sm:py-5">
        <ReviewHeader
          title="Người dùng / Đánh giá dịch vụ"
          description="Tổng hợp phản hồi khách hàng để phát hiện vấn đề chất lượng."
        />

        <ReviewFilterBar
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
          onReset={() => {
            setFilters(defaultFilters);
            setPage(1);
          }}
        />

        <ReviewKpiGrid
          total={summary.total}
          average={summary.average}
          lowRating={summary.lowRating}
          positive={summary.positive}
        />

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
            <p className="text-sm font-semibold text-[var(--admin-error)]">
              Không tải được danh sách đánh giá.
            </p>

            <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
              {error.message}
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-red-500/35 px-4 text-sm font-bold text-[var(--admin-error)] transition hover:bg-red-500/10"
            >
              Tải lại
            </button>
          </section>
        ) : (
          <>
            <ReviewTable
              reviews={pagedReviews}
              total={filteredItems.length}
              isLoading={isLoading}
              onViewReview={setSelectedReview}
            />

            {!isLoading && filteredItems.length > 0 && totalPages > 1 ? (
              <div className="pt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            ) : null}
          </>
        )}

        {selectedReview ? (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-4">
            <button
              type="button"
              aria-label="Đóng chi tiết đánh giá"
              className="absolute inset-0 bg-[#020817]/70 backdrop-blur-[4px]"
              onClick={() => setSelectedReview(null)}
            />

            <section className="relative z-10 flex max-h-[calc(100dvh-32px)] w-[min(1120px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] shadow-[0_24px_80px_-40px_rgba(0,0,0,0.75)]">
              <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--admin-card-border)] px-5 py-4">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-[var(--admin-strong-text)]">
                    Chi tiết đánh giá #{selectedReview.id}
                  </h2>
                  <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
                    Xem phản hồi, khách hàng, thợ và ca sửa chữa liên quan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)]"
                >
                  Đóng
                </button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <ReviewDetailPanel review={selectedReview} />
              </div>
            </section>
          </div>
        ) : null}
      </section>

      <AdminToastStack
        toasts={toasts}
        onRemove={(id) =>
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </AdminShell>
  );
}
