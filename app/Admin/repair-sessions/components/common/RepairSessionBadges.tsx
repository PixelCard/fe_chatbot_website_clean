import { AlertTriangle, Clock3 } from "lucide-react";

import type { JobStatus } from "../../types/repairSession.types";
import { repairSessionStatusMeta } from "../../utils/repairSessionStatusMeta";

export function RepairSessionStatusBadge({ status }: { status: JobStatus }) {
  const meta = repairSessionStatusMeta[status];

  return (
    <span
      className={[
        "inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium",
        meta.badgeClass,
      ].join(" ")}
    >
      {meta.label}
    </span>
  );
}

export function RepairSessionDangerBadge({
  isDangerous,
}: {
  isDangerous: boolean;
}) {
  if (!isDangerous) return null;

  return (
    <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 text-xs font-medium text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300">
      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
      Nguy hiểm
    </span>
  );
}

export function RepairSessionStuckBadge({
  duration,
}: {
  duration: string | null;
}) {
  if (!duration) return null;

  return (
    <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 text-xs font-medium text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300">
      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
      Treo {duration}
    </span>
  );
}
