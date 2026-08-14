"use client";

import { Eye, Star } from "lucide-react";

import type { ReviewItem } from "../../types/review.types";

export function ReviewTable({
  reviews,
  total,
  isLoading,
  onViewReview,
}: {
  reviews: ReviewItem[];
  total: number;
  isLoading: boolean;
  onViewReview: (review: ReviewItem) => void;
}) {
  if (isLoading) {
    return (
      <section className="admin-card rounded-2xl p-6">
        <p className="text-base font-bold text-[var(--admin-muted-text)]">
          Đang tải dữ liệu đánh giá...
        </p>
      </section>
    );
  }

  if (!reviews.length) {
    return (
      <section className="admin-card flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-dashed p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-2xl text-[#FF7A00]">
          ★
        </div>

        <h3 className="mt-4 text-xl font-bold text-[var(--admin-strong-text)]">
          Không có đánh giá
        </h3>

        <p className="mt-2 max-w-md text-base font-medium leading-7 text-[var(--admin-muted-text)]">
          Hiện tại chưa có đánh giá dịch vụ nào để hiển thị.
        </p>
      </section>
    );
  }

  return (
    <section className="admin-card overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--admin-card-border)] px-6 py-5">
        <h2 className="text-xl font-bold text-[var(--admin-strong-text)] sm:text-2xl">
          Danh sách đánh giá
        </h2>

        <span className="text-base font-bold text-[var(--admin-muted-text)]">
          {total} đánh giá
        </span>
      </header>

      <div className="hidden lg:block">
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[19%]" />
            <col className="w-[19%]" />
            <col className="w-[20%]" />
            <col className="w-[12%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-sm font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
              <th className="px-6 py-4">Đánh giá</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Thợ</th>
              <th className="px-6 py-4">Ca sửa chữa</th>
              <th className="px-6 py-4 text-right">Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] transition-colors duration-150 last:border-b-0 hover:bg-[var(--admin-control-hover-bg)]"
              >
                <td className="px-6 py-6 align-top">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-[var(--admin-muted-text)]">
                        #{review.id}
                      </span>

                      <RatingScore rating={review.rating} />
                    </div>

                    <p className="mt-2 line-clamp-2 text-base font-semibold leading-7 text-[var(--admin-strong-text)]">
                      {getSafeText(review.comment, "Không có bình luận")}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-6 align-top">
                  <InfoCell
                    main={review.customerName}
                    sub={review.customerPhone}
                    mainFallback="Không rõ khách"
                    subFallback="Chưa có SĐT"
                  />
                </td>

                <td className="px-6 py-6 align-top">
                  <InfoCell
                    main={review.technicianName}
                    sub={review.technicianPhone}
                    mainFallback="Không rõ thợ"
                    subFallback="Chưa có SĐT"
                  />
                </td>

                <td className="px-6 py-6 align-top">
                  <InfoCell
                    main={review.sessionCode}
                    sub={review.repairServiceName}
                    mainFallback="Chưa có mã ca"
                    subFallback="Dịch vụ sửa chữa"
                  />
                </td>

                <td className="px-6 py-6 align-top">
                  <div className="flex justify-end">
                    <ViewButton onClick={() => onViewReview(review)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 p-4 lg:hidden">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-[var(--admin-muted-text)]">
                    #{review.id}
                  </span>

                  <RatingScore rating={review.rating} compact />
                </div>

                <p className="mt-2 line-clamp-2 text-base font-semibold leading-7 text-[var(--admin-strong-text)]">
                  {getSafeText(review.comment, "Không có bình luận")}
                </p>
              </div>

              <ViewButton onClick={() => onViewReview(review)} compact />
            </div>

            <div className="mt-5 grid gap-4 rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4">
              <MobileInfoRow
                label="Khách hàng"
                main={review.customerName}
                sub={review.customerPhone}
              />
              <MobileInfoRow
                label="Thợ"
                main={review.technicianName}
                sub={review.technicianPhone}
              />
              <MobileInfoRow
                label="Ca sửa chữa"
                main={review.sessionCode}
                sub={review.repairServiceName}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InfoCell({
  main,
  sub,
  mainFallback,
  subFallback,
}: {
  main?: string | null;
  sub?: string | null;
  mainFallback: string;
  subFallback: string;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[17px] font-bold text-[var(--admin-strong-text)] xl:text-lg">
        {getSafeText(main, mainFallback)}
      </p>

      <p className="mt-1.5 truncate text-sm font-semibold text-[var(--admin-muted-text)] xl:text-[15px]">
        {getSafeText(sub, subFallback)}
      </p>
    </div>
  );
}

function MobileInfoRow({
  label,
  main,
  sub,
}: {
  label: string;
  main?: string | null;
  sub?: string | null;
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
        {label}
      </p>

      <p className="mt-1 truncate text-base font-bold text-[var(--admin-strong-text)]">
        {getSafeText(main)}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
        {getSafeText(sub)}
      </p>
    </div>
  );
}

function RatingScore({
  rating,
  compact = false,
}: {
  rating?: number | null;
  compact?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 font-black text-[var(--admin-strong-text)]",
        compact ? "text-lg" : "text-xl",
      ].join(" ")}
    >
      {formatRatingText(rating)}
      <Star
        className={[
          "fill-[#F59E0B] text-[#F59E0B]",
          compact ? "h-4.5 w-4.5" : "h-5 w-5",
        ].join(" ")}
        strokeWidth={2.5}
      />
    </span>
  );
}

function ViewButton({
  onClick,
  compact = false,
}: {
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/35 bg-cyan-500/15 font-bold text-[#0891B2] transition hover:bg-cyan-500/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
        compact ? "h-9 px-3.5 text-xs sm:text-sm" : "h-10 px-4 text-sm",
      ].join(" ")}
    >
      <Eye className={compact ? "h-4 w-4" : "h-4 w-4"} strokeWidth={2.3} />
      Chi tiết
    </button>
  );
}

function getSafeText(value?: string | null, fallback = "Chưa cập nhật") {
  if (!value) return fallback;
  return value.trim() ? value : fallback;
}

function formatRatingText(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.0";
  return value.toFixed(1);
}
