"use client";

import { AlertTriangle, ShieldAlert, UserX, Zap } from "lucide-react";

import type {
  RepairSession,
  Technician,
} from "../../types/repairSession.types";
import { isStuckSession } from "../../utils/repairSessionRules";
import { RepairSessionEmptyState } from "../common/RepairSessionUi";
import { AssignTechnicianDialog } from "./AssignTechnicianDialog";
import {
  CancelRepairSessionDialog,
  UnassignTechnicianDialog,
} from "./ReasonActionDialogs";
import { DispatchTechnicianPicker } from "./DispatchTechnicianPicker";
import { useDispatchPanelState } from "./useDispatchPanelState";

type DispatchActionPanelProps = {
  session: RepairSession | null;
  suggestedTechnicians: Technician[];
  onCloseDrawer: () => void;
  onReassign: (technicianId: string, reason: string) => Promise<void>;
  onUnassign: (reason: string) => Promise<void>;
  onCancel: (reason: string) => Promise<void>;
  submitting: boolean;
};

export function DispatchActionPanel({
  session,
  suggestedTechnicians,
  onCloseDrawer,
  onReassign,
  onUnassign,
  onCancel,
  submitting,
}: DispatchActionPanelProps) {
  if (!session) {
    return (
      <section className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] p-6 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
        <RepairSessionEmptyState
          title="Chưa có thao tác điều phối"
          description="Chọn một ca sửa chữa để gán thợ, gỡ phân công hoặc hủy ca."
        />
      </section>
    );
  }

  return (
    <DispatchActionPanelContent
      key={session.id}
      session={session}
      suggestedTechnicians={suggestedTechnicians}
      onCloseDrawer={onCloseDrawer}
      onReassign={onReassign}
      onUnassign={onUnassign}
      onCancel={onCancel}
      submitting={submitting}
    />
  );
}

function DispatchActionPanelContent({
  session,
  suggestedTechnicians,
  onCloseDrawer,
  onReassign,
  onUnassign,
  onCancel,
  submitting,
}: Omit<DispatchActionPanelProps, "session"> & { session: RepairSession }) {
  const state = useDispatchPanelState(session, suggestedTechnicians);
  const selectedTechnician =
    state.technicians.find(
      (technician) => technician.id === state.selectedTechnicianId,
    ) ?? null;

  const closeAfter = async (action: () => Promise<void>) => {
    await action();
    state.closeDialog();
    onCloseDrawer();
  };

  return (
    <section className="flex h-full min-h-[320px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <header className="shrink-0 border-b border-[var(--admin-soft-panel-border)] px-4 py-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
          Điều phối ca sửa chữa
        </p>
        <h3 className="mt-1 text-lg font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
          Ca #{session.id} · {session.deviceType || "Thiết bị chưa xác định"}
        </h3>
        <p className="mt-1 text-sm font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
          {session.customer.fullName || "Khách chưa xác định"}
          {session.address ? ` · ${session.address}` : " · Chưa có địa chỉ"}
        </p>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {session.isDangerous || isStuckSession(session) ? (
          <div className="space-y-2">
            {session.isDangerous ? (
              <WarningNotice
                icon={ShieldAlert}
                title="Ca có dấu hiệu nguy hiểm"
                description="Xác minh an toàn hiện trường trước khi phân công kỹ thuật viên."
                danger
              />
            ) : null}
            {isStuckSession(session) ? (
              <WarningNotice
                icon={Zap}
                title="Ca đang quá hạn theo dõi"
                description="Nên gán lại hoặc can thiệp điều phối sớm."
              />
            ) : null}
          </div>
        ) : null}

        <DispatchTechnicianPicker
          session={session}
          technicians={state.technicians}
          selectedTechnicianId={state.selectedTechnicianId}
          onSelect={state.setSelectedTechnicianId}
          onConfirm={() => state.openDialog("assign")}
          disabled={!state.canAssign || submitting}
        />

        <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
          <h3 className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
            Thao tác khác
          </h3>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => state.openDialog("unassign")}
              disabled={!state.canUnassign || submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-semibold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#334155] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]"
            >
              <UserX className="h-4 w-4" />
              Gỡ kỹ thuật viên
            </button>

            <button
              type="button"
              onClick={() => state.openDialog("cancel")}
              disabled={!state.canCancel || submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:border-rose-400 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300"
            >
              <AlertTriangle className="h-4 w-4" />
              Hủy ca sửa chữa
            </button>
          </div>
        </section>
      </div>

      <AssignTechnicianDialog
        open={state.dialog === "assign"}
        mode={state.hasTechnician ? "reassign" : "assign"}
        sessionId={session.id}
        technician={selectedTechnician}
        submitting={submitting}
        onClose={state.closeDialog}
        onConfirm={(reason) =>
          closeAfter(() => onReassign(state.selectedTechnicianId, reason))
        }
      />

      <UnassignTechnicianDialog
        open={state.dialog === "unassign"}
        submitting={submitting}
        onClose={state.closeDialog}
        onConfirm={(reason) => closeAfter(() => onUnassign(reason))}
      />

      <CancelRepairSessionDialog
        open={state.dialog === "cancel"}
        submitting={submitting}
        onClose={state.closeDialog}
        onConfirm={(reason) => closeAfter(() => onCancel(reason))}
      />
    </section>
  );
}

function WarningNotice({
  icon: Icon,
  title,
  description,
  danger = false,
}: {
  icon: typeof ShieldAlert;
  title: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-start gap-3 rounded-xl border px-3 py-3",
        danger
          ? "border-rose-300 bg-rose-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10"
          : "border-amber-300 bg-amber-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10",
      ].join(" ")}
    >
      <Icon
        className={[
          "mt-0.5 h-4 w-4 shrink-0",
          danger
            ? "text-rose-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300"
            : "text-amber-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300",
        ].join(" ")}
      />
      <div>
        <p className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
          {title}
        </p>
        <p className="mt-1 text-sm font-medium leading-6 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
          {description}
        </p>
      </div>
    </div>
  );
}
