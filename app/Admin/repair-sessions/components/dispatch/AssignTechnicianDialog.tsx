"use client";

import { useEffect, useState, type FormEvent } from "react";
import { UserCheck } from "lucide-react";

import { REASSIGN_REASONS } from "../../constants/repairSession.constants";
import type { Technician } from "../../types/repairSession.types";
import {
  DispatchDialogFooter,
  DispatchDialogFrame,
  type DispatchDialogBaseProps,
} from "./DispatchDialogFrame";
import { DispatchReasonFields } from "./DispatchReasonFields";

export function AssignTechnicianDialog({
  open,
  mode,
  sessionId,
  technician,
  submitting,
  onClose,
  onConfirm,
}: DispatchDialogBaseProps & {
  mode: "assign" | "reassign";
  sessionId: string;
  technician: Technician | null;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState<string>(REASSIGN_REASONS[0] ?? "");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setReason(REASSIGN_REASONS[0] ?? "");
      setNote("");
    }
  }, [open, technician?.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!technician || submitting) return;

    const detail = note.trim() ? `${reason}. ${note.trim()}` : reason;
    await onConfirm(
      `${detail}. ${mode === "assign" ? "Phân công" : "Gán lại"} cho thợ: ${technician.fullName}`,
    );
  };

  return (
    <DispatchDialogFrame
      open={open}
      submitting={submitting}
      onClose={onClose}
      title={
        mode === "assign"
          ? `Gán thợ cho ca #${sessionId}`
          : `Gán lại thợ cho ca #${sessionId}`
      }
      description="Kiểm tra kỹ thuật viên được chọn và xác nhận lý do điều phối."
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 p-4 sm:p-5">
          <div className="rounded-2xl border border-[#FF8A1F]/30 bg-[#FF8A1F]/10 p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF8A1F]/15 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
                <UserCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                  Kỹ thuật viên được chọn
                </p>
                <p className="mt-1 truncate text-base font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                  {technician?.fullName || "Chưa chọn kỹ thuật viên"}
                </p>
              </div>
            </div>
          </div>

          <DispatchReasonFields
            reason={reason}
            note={note}
            reasons={REASSIGN_REASONS}
            onReasonChange={setReason}
            onNoteChange={setNote}
          />
        </div>

        <DispatchDialogFooter
          submitting={submitting}
          confirmLabel={
            mode === "assign" ? "Xác nhận phân công" : "Xác nhận gán lại"
          }
          disabled={!technician || !reason}
          onClose={onClose}
        />
      </form>
    </DispatchDialogFrame>
  );
}
