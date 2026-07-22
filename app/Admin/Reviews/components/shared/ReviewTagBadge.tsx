import type { ReviewTag } from "../../types/review.types";

export function ReviewTagBadge({ tag }: { tag: ReviewTag }) {
  const negative =
    tag === "Chưa đúng hẹn" ||
    tag === "Phát sinh chi phí" ||
    tag === "Không hài lòng";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
        negative
          ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] dark:text-[#FCA5A5]"
          : "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] dark:text-[#4ADE80]",
      ].join(" ")}
    >
      {tag}
    </span>
  );
}