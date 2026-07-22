"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import { reviewAdminService, type ReviewAdminQuery } from "../services";
import type { ReviewItem } from "../types/review.types";

type ReviewsState = {
  items: ReviewItem[];
  isLoading: boolean;
  error: ApiError | null;
};

/** Tải danh sách đánh giá thật từ backend và quản lý trạng thái cho page admin. */
export function useReviewsApi(query?: ReviewAdminQuery) {
  const [state, setState] = useState<ReviewsState>({
    items: [],
    isLoading: true,
    error: null,
  });

  /** Gọi API review admin và cập nhật lại state hiển thị của trang. */
  const fetchReviews = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const items = await reviewAdminService.getReviews(query);
      setState({
        items,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        items: [],
        isLoading: false,
        error: error as ApiError,
      });
    }
  }, [query]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  return {
    ...state,
    refetch: fetchReviews,
  };
}
