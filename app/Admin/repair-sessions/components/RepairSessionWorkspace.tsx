"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
  RepairSession,
  Technician,
} from "../types/repairSession.types";
import { RepairSessionDetailPanel } from "./detail/RepairSessionDetailPanel";
import { DispatchActionPanel } from "./dispatch/DispatchActionPanel";
import { RepairSessionListPanel } from "./left/RepairSessionListPanel";

type RepairSessionWorkspaceProps = {
  sessions: RepairSession[];
  selectedSession: RepairSession | null;
  suggestedTechnicians: Technician[];
  onSelectSession: (session: RepairSession) => void;
  onReassign: (technicianId: string, reason: string) => Promise<void>;
  onUnassign: (reason: string) => Promise<void>;
  onCancel: (reason: string) => Promise<void>;
  submitting: boolean;
};

export function RepairSessionWorkspace({
  sessions,
  selectedSession,
  suggestedTechnicians,
  onSelectSession,
  onReassign,
  onUnassign,
  onCancel,
  submitting,
}: RepairSessionWorkspaceProps) {
  const [dispatchOpen, setDispatchOpen] = useState(false);

  useEffect(() => {
    if (!dispatchOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        setDispatchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dispatchOpen, submitting]);

  return (
    <>
      <section className="w-full max-w-none">
        <div className="grid grid-cols-1 gap-4 xl:h-[clamp(620px,calc(100dvh-250px),900px)] xl:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[390px_minmax(0,1fr)]">
          <RepairSessionListPanel
            sessions={sessions}
            selectedSessionId={selectedSession?.id ?? null}
            onSelectSession={onSelectSession}
          />

          <RepairSessionDetailPanel
            session={selectedSession}
            onOpenDispatch={() => setDispatchOpen(true)}
          />
        </div>
      </section>

      {dispatchOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bảng điều phối ca sửa chữa"
          className="fixed inset-0 z-[9000] flex justify-end bg-black/55 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="Đóng bảng điều phối"
            disabled={submitting}
            className="absolute inset-0 cursor-default"
            onClick={() => setDispatchOpen(false)}
          />

          <aside className="relative z-10 flex h-full w-full max-w-[min(580px,100vw)] flex-col border-l border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] shadow-2xl [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F]">
            <header className="flex shrink-0 items-center justify-between border-b border-[var(--admin-soft-panel-border)] px-4 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] sm:px-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EA580C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
                  Điều phối kỹ thuật viên
                </p>
                <h2 className="mt-1 truncate text-lg font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                  {selectedSession
                    ? `Ca #${selectedSession.id}`
                    : "Chưa chọn ca"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setDispatchOpen(false)}
                disabled={submitting}
                aria-label="Đóng"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] text-[var(--admin-theme-text)] transition hover:border-[var(--admin-control-hover-border)] hover:text-[var(--admin-strong-text)] disabled:opacity-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
              <DispatchActionPanel
                session={selectedSession}
                suggestedTechnicians={suggestedTechnicians}
                onCloseDrawer={() => setDispatchOpen(false)}
                onReassign={onReassign}
                onUnassign={onUnassign}
                onCancel={onCancel}
                submitting={submitting}
              />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
