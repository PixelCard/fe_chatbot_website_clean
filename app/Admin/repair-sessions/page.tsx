"use client";

import { useMemo, useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import { RepairSessionWorkspace } from "./components/RepairSessionWorkspace";
import { RepairSessionFilterBar } from "./components/filter/RepairSessionFilterBar";
import { useRepairSessionFilters } from "./hooks/useRepairSessionFilters";
import { useRepairSessionsApi } from "./hooks/useRepairSessionsApi";
import type { Technician } from "./types/repairSession.types";

export default function RepairSessionsPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const {
    items: sessions,
    isLoading,
    error,
    refetch,
    isMutating,
    reassign,
    unassign,
    cancel,
  } = useRepairSessionsApi();

  const { filters, setFilters, resetFilters, filteredSessions } =
    useRepairSessionFilters(sessions);

  const selectedSession = useMemo(
    () =>
      filteredSessions.find((session) => session.id === selectedSessionId) ??
      filteredSessions[0] ??
      null,
    [filteredSessions, selectedSessionId],
  );

  const suggestedTechnicians = useMemo(() => {
    const technicians = new Map<string, Technician>();

    for (const session of sessions) {
      if (session.technician?.id) {
        technicians.set(session.technician.id, session.technician);
      }
    }

    return Array.from(technicians.values());
  }, [sessions]);

  return (
    <AdminShell>
      <main className="min-h-screen w-full">
        <div className="w-full min-w-0 space-y-5 py-4 sm:py-5">
          {error ? (
            <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
              <p className="text-sm font-semibold text-red-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-red-200">
                Không thể xử lý dữ liệu ca sửa chữa.
              </p>
              <p className="mt-1 text-sm text-red-700/90 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-red-100/90">
                {error.message}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 inline-flex h-10 items-center rounded-xl border border-red-300/50 px-4 text-sm font-semibold text-red-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-red-100"
              >
                Thử lại
              </button>
            </section>
          ) : null}

          {isLoading ? (
            <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] p-4 text-sm font-medium text-[var(--admin-theme-text)] sm:p-6">
              Đang tải dữ liệu ca sửa chữa...
            </section>
          ) : null}

          {!isLoading && !error ? (
            <>
              <RepairSessionFilterBar
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
                sessions={sessions}
              />

              <RepairSessionWorkspace
                sessions={filteredSessions}
                selectedSession={selectedSession}
                suggestedTechnicians={suggestedTechnicians}
                onSelectSession={(session) => setSelectedSessionId(session.id)}
                onReassign={async (technicianId, _reason) => {
                  if (!selectedSession) return;
                  await reassign(selectedSession.id, technicianId);
                }}
                onUnassign={async (_reason) => {
                  if (!selectedSession) return;
                  await unassign(selectedSession.id);
                }}
                onCancel={async (_reason) => {
                  if (!selectedSession) return;
                  await cancel(selectedSession.id);
                }}
                submitting={isMutating}
              />
            </>
          ) : null}
        </div>
      </main>
    </AdminShell>
  );
}
