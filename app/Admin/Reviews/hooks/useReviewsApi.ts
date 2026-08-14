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

const getLocalReviews = (): ReviewItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("smartelec_user_reviews");
    if (!raw) return [];
    const list: ReviewItem[] = JSON.parse(raw);
    const cleanList = list.filter((item) => Number(item.id) < 100000000);
    if (cleanList.length !== list.length) {
      localStorage.setItem("smartelec_user_reviews", JSON.stringify(cleanList));
    }
    return cleanList;
  } catch {
    return [];
  }
};

/** Tải danh sách đánh giá từ backend và các đánh giá Chatbot gần đây cho page admin. */
export function useReviewsApi(query?: ReviewAdminQuery) {
  const [state, setState] = useState<ReviewsState>({
    items: [],
    isLoading: true,
    error: null,
  });

  /** Gọi API review admin và cập nhật lại state hiển thị của trang. */
  const fetchReviews = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const localItems = getLocalReviews();

    try {
      const items = await reviewAdminService.getReviews(query);
      const fetchedList = Array.isArray(items) ? items : [];
      const combined = [...localItems, ...fetchedList.filter((x) => !localItems.some((l) => l.id === x.id))];

      setState({
        items: combined,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        items: localItems,
        isLoading: false,
        error: null,
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
