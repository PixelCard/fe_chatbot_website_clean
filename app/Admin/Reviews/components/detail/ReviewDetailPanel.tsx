import type { ReactNode } from "react";

import type { ReviewItem } from "../../types/review.types";
import {
  formatDateTime,
  getReviewSentimentLabel,
} from "@/app/Admin/Reviews/lib/reviewHelpers";
import { ReviewTagBadge } from "../shared/ReviewTagBadge";

export function ReviewDetailPanel({ review }: { review: ReviewItem | null }) {
  if (!review) return null;

  const reviewTime = formatDateTime(review.createdAt);
  const [timePart = "--:--", datePart = "--/--/----"] = reviewTime.split(" ");
  const tags = review.tags ?? [];

  return (
    <div className="space-y-4">
      <section className="admin-card rounded-2xl p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-[var(--admin-strong-text)]">
                Đánh giá #{review.id}
              </h2>

              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-300">
                {getReviewSentimentLabel(review.rating)}
              </span>
            </div>

            <p className="mt-2 text-base font-semibold text-[var(--admin-muted-text)]">
              {getSafeText(review.sessionCode, "Chưa có mã ca")} ·{" "}
              {getSafeText(review.repairServiceName, "Dịch vụ sửa chữa")} ·{" "}
              {timePart} {datePart}
            </p>
          </div>

          <div className="rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-4 py-3 text-right">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
              Điểm
            </p>
            <p className="mt-1 text-2xl font-black text-[var(--admin-strong-text)]">
              {formatRatingText(review.rating)} ★
            </p>
          </div>
        </div>
      </section>

      <section className="admin-card rounded-2xl p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
              Bình luận khách hàng
            </p>

            <p className="mt-3 text-lg font-bold leading-7 text-[var(--admin-strong-text)]">
              “{getSafeText(review.comment, "Khách hàng không để lại bình luận.")}”
            </p>
          </div>

          <div className="flex min-w-[180px] flex-wrap gap-2 lg:justify-end">
            {tags.length ? (
              tags.map((tag) => <ReviewTagBadge key={tag} tag={tag} />)
            ) : (
              <span className="rounded-full border border-[var(--admin-card-border)] px-3 py-1 text-sm font-semibold text-[var(--admin-muted-text)]">
                Chưa có tag
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <CompactCard title="Ca sửa chữa">
          <CompactLine label="Mã ca" value={getSafeText(review.sessionCode, "Chưa có mã ca")} />
          <CompactLine label="Dịch vụ" value={getSafeText(review.repairServiceName, "Dịch vụ sửa chữa")} />
          <CompactLine label="Địa chỉ" value={getSafeText(review.address, "Chưa cập nhật địa chỉ")} multiline />
        </CompactCard>

        <CompactCard title="Khách hàng">
          <CompactLine label="Tên khách" value={getSafeText(review.customerName)} />
          <CompactLine label="SĐT" value={getSafeText(review.customerPhone, "Chưa có số điện thoại")} />
          <CompactLine label="User ID" value={String(review.userId)} />
        </CompactCard>

        <CompactCard title="Thợ được đánh giá">
          <CompactLine label="Tên thợ" value={getSafeText(review.technicianName)} />
          <CompactLine label="SĐT" value={getSafeText(review.technicianPhone, "Chưa có số điện thoại")} />
          <CompactLine label="Technician ID" value={String(review.technicianId)} />
        </CompactCard>
      </section>
    </div>
  );
}

function CompactCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-card rounded-2xl p-5">
      <h3 className="text-base font-bold text-[var(--admin-strong-text)]">
        {title}
      </h3>

      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function CompactLine({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-1 border-b border-[var(--admin-card-border)] pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
        {label}
      </p>

      <p
        className={[
          "text-base font-bold text-[var(--admin-strong-text)]",
          multiline ? "break-words leading-6" : "truncate",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
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
