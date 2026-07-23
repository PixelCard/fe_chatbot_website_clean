import {
  getReviewSentiment,
  getReviewSentimentLabel,
} from "@/app/Admin/Reviews/lib/reviewHelpers";

export function ReviewSentimentBadge({ rating }: { rating: number }) {
  const sentiment = getReviewSentiment(rating);

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
        sentiment === "POSITIVE"
          ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] dark:text-[#4ADE80]"
          : sentiment === "NEUTRAL"
            ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] dark:text-[#FBBF24]"
            : "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] dark:text-[#FCA5A5]",
      ].join(" ")}
    >
      {getReviewSentimentLabel(rating)}
    </span>
  );
}
