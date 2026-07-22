"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  RepairSession,
  Technician,
} from "../../types/repairSession.types";
import { isClosedStatus } from "../../utils/repairSessionRules";

export type DispatchDialog = "assign" | "unassign" | "cancel" | null;

export function useDispatchPanelState(
  session: RepairSession,
  suggestedTechnicians: Technician[],
) {
  const technicians = useMemo(
    () => suggestedTechnicians.filter((technician) => Boolean(technician.id)),
    [suggestedTechnicians],
  );

  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [dialog, setDialog] = useState<DispatchDialog>(null);

  useEffect(() => {
    const currentTechnicianId = session.technician?.id ?? session.technicianId;
    const fallbackTechnicianId = technicians[0]?.id ?? "";

    setSelectedTechnicianId(currentTechnicianId || fallbackTechnicianId);
    setDialog(null);
  }, [session.id, session.technician?.id, session.technicianId, technicians]);

  const closed = isClosedStatus(session.status);
  const hasTechnician = Boolean(session.technicianId || session.technician?.id);

  return {
    technicians,
    selectedTechnicianId,
    setSelectedTechnicianId,
    dialog,
    openDialog: setDialog,
    closeDialog: () => setDialog(null),
    hasTechnician,
    canAssign: !closed && technicians.length > 0,
    canUnassign: !closed && hasTechnician,
    canCancel: !closed,
  };
}
