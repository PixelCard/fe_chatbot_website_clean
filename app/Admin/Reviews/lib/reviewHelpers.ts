import type { ReviewFilterState, ReviewItem } from "../types/review.types";

export function getReviewSentiment(rating: number) {
  if (rating >= 4) return "POSITIVE";
  if (rating === 3) return "NEUTRAL";
  return "NEGATIVE";
}

export function getReviewSentimentLabel(rating: number) {
  const sentiment = getReviewSentiment(rating);

  if (sentiment === "POSITIVE") return "Tích cực";
  if (sentiment === "NEUTRAL") return "Trung lập";
  return "Tiêu cực";
}

export function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function matchesCreatedRange(
  createdAt: string,
  range: ReviewFilterState["createdRange"],
) {
  if (range === "ALL") return true;

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (range === "TODAY") {
    return date >= startOfToday;
  }

  if (range === "LAST_7_DAYS") {
    const start = new Date(startOfToday);
    start.setDate(startOfToday.getDate() - 6);
    return date >= start;
  }

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return date >= startOfMonth;
}

export function filterReviews(
  reviews: ReviewItem[],
  filters: ReviewFilterState,
) {
  const keyword = filters.search.trim().toLowerCase();

  return reviews.filter((review) => {
    const matchSearch =
      !keyword ||
      review.sessionCode.toLowerCase().includes(keyword) ||
      review.customerName.toLowerCase().includes(keyword) ||
      review.customerPhone.includes(keyword) ||
      review.technicianName.toLowerCase().includes(keyword) ||
      review.repairServiceName.toLowerCase().includes(keyword);

    const matchRating =
      filters.rating === "ALL" || review.rating === Number(filters.rating);

    const matchCreatedRange = matchesCreatedRange(
      review.createdAt,
      filters.createdRange,
    );

    const matchSentiment =
      filters.sentiment === "ALL" ||
      getReviewSentiment(review.rating) === filters.sentiment;

    const matchTag =
      filters.tag === "ALL" || review.tags.includes(filters.tag);

    const matchTechnician =
      filters.technicianId === "ALL" ||
      String(review.technicianId) === filters.technicianId;

    const matchCustomer =
      filters.customerId === "ALL" ||
      String(review.userId) === filters.customerId;

    return (
      matchSearch &&
      matchRating &&
      matchCreatedRange &&
      matchSentiment &&
      matchTag &&
      matchTechnician &&
      matchCustomer
    );
  });
}

export function buildReviewSummary(reviews: ReviewItem[]) {
  const total = reviews.length;
  const average =
    total === 0
      ? 0
      : reviews.reduce((sum, item) => sum + item.rating, 0) / total;

  const lowRating = reviews.filter((item) => item.rating <= 2).length;
  const positive = reviews.filter((item) => item.rating >= 4).length;
  const neutral = reviews.filter((item) => item.rating === 3).length;
  const negative = reviews.filter((item) => item.rating <= 2).length;

  return {
    total,
    average,
    lowRating,
    positive,
    neutral,
    negative,
  };
}
