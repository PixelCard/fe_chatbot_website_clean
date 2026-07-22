import { Star } from "lucide-react";

export function ReviewRatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < rating;

        return (
          <Star
            key={index}
            className={[
              "h-4 w-4",
              active
                ? "fill-[#FBBF24] text-[#FBBF24]"
                : "text-[var(--admin-soft-text)]",
            ].join(" ")}
          />
        );
      })}

      <span className="ml-1 text-sm font-bold text-[var(--admin-strong-text)]">
        {rating}/5
      </span>
    </div>
  );
}