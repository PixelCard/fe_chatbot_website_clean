import type { DisplayStatus } from "../../types/technician.types";
import { displayStatusMeta } from "../../utils/technicianStatusMeta";

type Props = {
  status: DisplayStatus;
};

const dotClass: Record<DisplayStatus, string> = {
  AVAILABLE: "bg-[#22C55E]",
  MATCHED: "bg-[#06B6D4]",
  EN_ROUTE: "bg-[#F97316]",
  ARRIVED: "bg-[#8B5CF6]",
  IN_PROGRESS: "bg-[#F59E0B]",
  OFFLINE: "bg-[#64748B]",
  LOCKED: "bg-[#EF4444]",
  UNVERIFIED: "bg-[#F59E0B]",
};

export default function TechnicianStatusBadge({ status }: Props) {
  const meta = displayStatusMeta[status];

  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5",
        "text-sm font-extrabold leading-none tracking-[0.01em]",
        "shadow-[0_8px_18px_-14px_rgba(15,23,42,0.35)]",
        meta.badgeClass,
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 shrink-0 rounded-full",
          dotClass[status],
        ].join(" ")}
      />

      <span className="truncate">{meta.label}</span>
    </span>
  );
}
