"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { Pagination } from "@/app/components/Pagination";

import AdminShell from "../dashboard/components/Action/AdminShell";
import DispatchDrawer from "./components/DispatchDrawer";
import DispatchFilters from "./components/DispatchFilters";
import DispatchHeader from "./components/DispatchHeader";
import DispatchTable from "./components/DispatchTable";
import { useDispatchApi } from "./hooks";
import type { ChatSession, JobStatus } from "./types/dispatch.types";

type ToastMessage = {
  id: string;
  type: "success" | "warning" | "error" | "info";
  text: string;
};

const DEFAULT_PAGE_SIZE = 10;

export default function DispatchPage() {
  const {
    sessions,
    candidates,
    history,
    isLoading,
    error,
    refetch,
    assign,
    unassign,
    reject,
    simulateTimeout,
  } = useDispatchApi();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | JobStatus>("ALL");
  const [deviceFilter, setDeviceFilter] = useState("ALL");
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [page, setPage] = useState(1);

  const addToast = (type: ToastMessage["type"], text: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [toasts]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const summary = useMemo(
    () => ({
      total: sessions.length,
      broadcasting: sessions.filter(
        (session) => session.status === "BROADCASTING",
      ).length,
      matched: sessions.filter((session) =>
        ["MATCHED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(
          session.status,
        ),
      ).length,
      completed: sessions.filter((session) => session.status === "COMPLETED")
        .length,
    }),
    [sessions],
  );

  const filteredSessions = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesSearch =
        !keyword ||
        session.id.toLowerCase().includes(keyword) ||
        session.symptom.toLowerCase().includes(keyword) ||
        session.customerName.toLowerCase().includes(keyword) ||
        session.customerPhone.includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || session.status === statusFilter;

      const matchesDevice =
        deviceFilter === "ALL" || session.deviceType === deviceFilter;

      const matchesArea =
        areaFilter === "ALL" || session.address.includes(areaFilter);

      return matchesSearch && matchesStatus && matchesDevice && matchesArea;
    });
  }, [sessions, searchTerm, statusFilter, deviceFilter, areaFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / DEFAULT_PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * DEFAULT_PAGE_SIZE;
    return filteredSessions.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [currentPage, filteredSessions]);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) || null,
    [sessions, selectedSessionId],
  );

  return (
    <AdminShell>
      <main className="min-h-screen w-full">
        <ToastStack toasts={toasts} onRemove={removeToast} />

        <div className="w-full space-y-5">
          <DispatchHeader summary={summary} />

          {error ? (
            <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-5">
              <p className="text-sm font-semibold text-[var(--admin-error)]">
                Không tải được dữ liệu điều phối.
              </p>

              <p className="mt-1 text-sm font-medium text-[var(--admin-error)]">
                {error.message}
              </p>

              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 inline-flex h-10 items-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-semibold text-[var(--admin-error)] transition hover:bg-red-500/15"
              >
                Thử lại
              </button>
            </section>
          ) : null}

          {isLoading ? (
            <section className="admin-card rounded-[28px] p-5 text-sm font-medium text-[var(--admin-strong-text)] sm:p-6">
              Đang tải dữ liệu điều phối...
            </section>
          ) : null}

          {!isLoading && !error ? (
            <div className="space-y-5">
              <DispatchFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                deviceFilter={deviceFilter}
                areaFilter={areaFilter}
                onSearchChange={(value: string) => {
                  setSearchTerm(value);
                  setPage(1);
                }}
                onStatusChange={(value: "ALL" | JobStatus) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
                onDeviceChange={(value: string) => {
                  setDeviceFilter(value);
                  setPage(1);
                }}
                onAreaChange={(value: string) => {
                  setAreaFilter(value);
                  setPage(1);
                }}
              />

              <DispatchTable
                rows={paginatedSessions}
                onSelectSession={(session: ChatSession) =>
                  setSelectedSessionId(session.id)
                }
              />

              <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 sm:p-5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
                <div className="flex flex-col gap-3 border-b border-[var(--admin-soft-panel-border)] pb-4 sm:flex-row sm:items-center sm:justify-between [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
                  <div>
                    <p className="text-sm font-semibold text-[var(--admin-strong-text)]">
                      Điều hướng danh sách điều phối
                    </p>

                    <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
                      Trang {currentPage}/{totalPages} • Hiển thị{" "}
                      {paginatedSessions.length} yêu cầu trên trang hiện tại
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#FF8A1F]/20 bg-[#FF8A1F]/10 px-3 py-1 text-xs font-medium text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
                    Tổng {filteredSessions.length} yêu cầu phù hợp bộ lọc
                  </div>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </section>
            </div>
          ) : null}

          <DispatchDrawer
            session={selectedSession}
            isOpen={selectedSessionId !== null}
            onClose={() => setSelectedSessionId(null)}
            candidates={candidates}
            history={history}
            onAssign={async (sessionId: string, technicianId: string) => {
              await assign(sessionId, technicianId);

              const technician = candidates.find(
                (item) => item.id === technicianId,
              );

              addToast(
                "success",
                `Đã gán thợ ${technician?.fullName ?? technicianId
                } cho đơn ${sessionId}.`,
              );
            }}
            onUnassign={async (sessionId: string, reason: string) => {
              await unassign(sessionId, reason);

              addToast("warning", `Đã hủy gán thợ cho đơn ${sessionId}.`);
            }}
            onReject={async (sessionId: string, reason: string) => {
              await reject(sessionId, reason);

              addToast(
                "warning",
                `Đơn ${sessionId} đã quay lại hàng chờ điều phối.`,
              );
            }}
            onSimulateTimeout={async (sessionId: string) => {
              await simulateTimeout(sessionId);

              addToast(
                "warning",
                `Đơn ${sessionId} đã bị hoàn tác do hết thời gian phản hồi.`,
              );
            }}
          />
        </div>
      </main>
    </AdminShell>
  );
}

function ToastStack({
  toasts,
  onRemove,
}: {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-[80] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            "flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md",
            toast.type === "success"
              ? "border-[#047857] bg-[#065F46]/85 text-[#A7F3D0]"
              : toast.type === "warning"
                ? "border-[#D97706] bg-[#78350F]/85 text-[#FDE68A]"
                : toast.type === "error"
                  ? "border-[#B91C1C] bg-[#7F1D1D]/85 text-[#FEE2E2]"
                  : "border-[#1D4ED8] bg-[#1E3A8A]/85 text-[#DBEAFE]",
          ].join(" ")}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#34D399]" />
          ) : null}

          {toast.type === "warning" ? (
            <Info className="h-5 w-5 shrink-0 text-[#FBBF24]" />
          ) : null}

          {toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-[#F87171]" />
          ) : null}

          {toast.type === "info" ? (
            <Info className="h-5 w-5 shrink-0 text-[#60A5FA]" />
          ) : null}

          <div className="min-w-0 flex-1 text-sm font-semibold leading-6">
            {toast.text}
          </div>

          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            className="shrink-0 rounded-lg p-1 text-[#CBD5E1] transition hover:bg-white/10 hover:text-white"
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}