"use client";

import { use, useMemo } from "react";

import AdminShell from "../../dashboard/components/Action/AdminShell";
import { ReviewDetailPanel } from "../components/detail/ReviewDetailPanel";
import {
  ReviewBackButton,
  ReviewHeader,
} from "../components/layout/ReviewHeader";
import { useReviewsApi } from "../hooks";

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const reviewId = Number(id);
  const { items } = useReviewsApi();

  const review = useMemo(
    () => items.find((item) => item.id === reviewId) ?? null,
    [items, reviewId],
  );

  return (
    <AdminShell>
      <section className="w-full min-w-0 space-y-5 py-4 sm:py-5">
        <ReviewHeader
          title="Người dùng / Đánh giá dịch vụ / Chi tiết đánh giá"
          description="Xem nội dung phản hồi, ca sửa chữa, khách hàng và thợ liên quan."
          action={<ReviewBackButton href="/admin/Reviews" />}
        />

        <ReviewDetailPanel review={review} />
      </section>
    </AdminShell>
  );
}
