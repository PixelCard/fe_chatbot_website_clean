type Props = {
  online: boolean;
  showLabel?: boolean;
};

export default function AccountOnlineDot({ online, showLabel = true }: Props) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={[
          "h-2.5 w-2.5 rounded-full",
          online ? "bg-[#22C55E]" : "bg-[#64748B]",
        ].join(" ")}
      />
      {showLabel ? (
        <span
          className={
            online
              ? "text-sm font-semibold text-[#4ADE80]"
              : "text-sm font-semibold text-[#94A3B8]"
          }
        >
          {online ? "Online" : "Offline"}
        </span>
      ) : null}
    </span>
  );
}