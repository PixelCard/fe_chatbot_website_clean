import { AlertTriangle, Clock3 } from "lucide-react";

import { AdminStatusPill } from "@/app/Admin/_shared/components/AdminStatusPill";

import type { JobStatus } from "../../types/repairSession.types";
import { repairSessionStatusMeta } from "../../utils/repairSessionStatusMeta";

export function RepairSessionStatusBadge({
  status,
  variant,
  className = "",
}: {
  status: JobStatus;
  variant?: "solid" | "soft";
  className?: string;
}) {
  const meta = repairSessionStatusMeta[status];

  return (
    <AdminStatusPill tone={meta.badgeTone} variant={variant} className={className}>
      {meta.label}
    </AdminStatusPill>
  );
}

export function RepairSessionDangerBadge({
  isDangerous,
}: {
  isDangerous: boolean;
}) {
  if (!isDangerous) return null;

  return (
    <AdminStatusPill tone="danger" icon={AlertTriangle}>
      Nguy hiểm
    </AdminStatusPill>
  );
}

export function RepairSessionStuckBadge({
  duration,
}: {
  duration: string | null;
}) {
  if (!duration) return null;

  return (
    <AdminStatusPill tone="warning" icon={Clock3}>
      Treo {duration}
    </AdminStatusPill>
  );
}
