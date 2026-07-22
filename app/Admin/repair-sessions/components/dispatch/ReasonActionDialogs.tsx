"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, UserX } from "lucide-react";

import {
  CANCEL_REASONS,
  UNASSIGN_REASONS,
} from "../../constants/repairSession.constants";
import {
  DispatchDialogFooter,
  DispatchDialogFrame,
  type DispatchDialogBaseProps,
} from "./DispatchDialogFrame";
import { DispatchReasonFields } from "./DispatchReasonFields";

export function UnassignTechnicianDialog({
  open,
  submitting,
  onClose,
  onConfirm,
}: DispatchDialogBaseProps & {
  onConfirm: (reason: string) => Promise<void>;
}) {
  return (
    <ReasonActionDialog
      open={open}
      submitting={submitting}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Gỡ kỹ thuật viên khỏi ca?"
      description="Ca sẽ quay lại hàng chờ để tiếp tục tìm kỹ thuật viên phù hợp."
      confirmLabel="Gỡ kỹ thuật viên"
      reasons={UNASSIGN_REASONS}
      icon={<UserX className="h-5 w-5" />}
    />
  );
}

export function CancelRepairSessionDialog({
  open,
  submitting,
  onClose,
  onConfirm,
}: DispatchDialogBaseProps & {
  onConfirm: (reason: string) => Promise<void>;
}) {
  return (
    <ReasonActionDialog
      open={open}
      submitting={submitting}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hủy ca sửa chữa?"
      description="Sau khi hủy, các thao tác điều phối khác của ca sẽ bị khóa."
      confirmLabel="Xác nhận hủy ca"
      reasons={CANCEL_REASONS}
      danger
      icon={<AlertTriangle className="h-5 w-5" />}
    />
  );
}

function ReasonActionDialog({
  open,
  title,
  description,
  confirmLabel,
  reasons,
  icon,
  danger = false,
  submitting,
  onClose,
  onConfirm,
}: DispatchDialogBaseProps & {
  title: string;
  description: string;
  confirmLabel: string;
  reasons: readonly string[];
  icon: ReactNode;
  danger?: boolean;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState(reasons[0] ?? "");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setReason(reasons[0] ?? "");
      setNote("");
    }
  }, [open, reasons]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason || submitting) return;
    await onConfirm(note.trim() ? `${reason}. ${note.trim()}` : reason);
  };

  return (
    <DispatchDialogFrame
      open={open}
      title={title}
      description={description}
      submitting={submitting}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 p-4 sm:p-5">
          <div
            className={[
              "flex items-center gap-3 rounded-2xl border p-4",
              danger
                ? "border-rose-300 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300"
                : "border-amber-300 bg-amber-50 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300",
            ].join(" ")}
          >
            {icon}
            <p className="text-sm font-semibold">
              Hành động này sẽ được lưu vào lịch sử điều phối.
            </p>
          </div>

          <DispatchReasonFields
            reason={reason}
            note={note}
            reasons={reasons}
            onReasonChange={setReason}
            onNoteChange={setNote}
          />
        </div>

        <DispatchDialogFooter
          submitting={submitting}
          confirmLabel={confirmLabel}
          disabled={!reason}
          danger={danger}
          onClose={onClose}
        />
      </form>
    </DispatchDialogFrame>
  );
}
