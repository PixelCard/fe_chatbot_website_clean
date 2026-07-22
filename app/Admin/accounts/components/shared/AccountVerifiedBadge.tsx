type Props = {
  verified: boolean;
};

export default function AccountVerifiedBadge({ verified }: Props) {
  return (
    <span
      className={[
        "inline-flex max-w-full rounded-full border px-3 py-1.5 text-sm font-semibold",
        verified
          ? "border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#22D3EE]"
          : "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#FBBF24]",
      ].join(" ")}
    >
      <span className="truncate">
        {verified ? "Đã xác minh" : "Chưa xác minh"}
      </span>
    </span>
  );
}