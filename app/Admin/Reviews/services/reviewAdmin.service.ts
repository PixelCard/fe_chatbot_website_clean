"use client";

import { apiClient } from "@/app/services/apiClient";
import type { ReviewItem } from "../types/review.types";

export type ReviewAdminQuery = {
  search?: string;
  rating?: string;
  sentiment?: string;
  tag?: string;
  technicianId?: string;
  customerId?: string;
};

const ADMIN_REVIEWS_BASE = "/api/admin/reviews";

export const reviewAdminService = {
  /** Gọi API danh sách đánh giá để lấy toàn bộ dữ liệu review cho admin. */
  getReviews(query?: ReviewAdminQuery) {
    return apiClient.get<ReviewItem[]>(ADMIN_REVIEWS_BASE, query);
  },
};
