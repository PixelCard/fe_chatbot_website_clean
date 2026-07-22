import { getInitials } from "../../utils/accountFormatters";

type Props = {
  name: string;
  avatarUrl?: string | null;
  online?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "h-9 w-9 text-xs rounded-xl",
  md: "h-11 w-11 text-sm rounded-2xl",
  lg: "h-14 w-14 text-base rounded-2xl",
};

export default function AccountAvatar({
  name,
  avatarUrl,
  online,
  size = "md",
}: Props) {
  return (
    <div
      className={[
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-[#F59E0B] via-[#FF8A1F] to-[#0EA5E9] font-bold text-white",
        sizeClass[size],
      ].join(" ")}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}

      {online !== undefined ? (
        <span
          className={[
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0D1728]",
            online ? "bg-[#22C55E]" : "bg-[#64748B]",
          ].join(" ")}
        />
      ) : null}
    </div>
  );
}
