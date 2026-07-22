"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  History,
  MapPin,
  Phone,
  RotateCw,
  Sliders,
  Star,
  User,
  UserCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";

import type {
  CandidateTechnician,
  ChatSession,
  SessionAssignmentHistory,
} from "../types/dispatch.types";
import { ASSIGNMENT_ACTION_VI, JOB_STATUS_VI } from "../types/dispatch.types";
import { getStatusBadgeStyle } from "./DispatchTable";

type DispatchDrawerProps = {
  session: ChatSession | null;
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidateTechnician[];
  history: SessionAssignmentHistory[];
  onAssign: (
    sessionId: string,
    technicianId: string,
    version?: number,
  ) => Promise<void> | void;
  onUnassign: (
    sessionId: string,
    reason: string,
    version?: number,
  ) => Promise<void> | void;
  onReject: (
    sessionId: string,
    reason: string,
    version?: number,
  ) => Promise<void> | void;
  onSimulateTimeout: (
    sessionId: string,
    version?: number,
  ) => Promise<void> | void;
};

type ModalTab = "technicians" | "history" | "simulation";

export default function DispatchDrawer({
  session,
  isOpen,
  onClose,
  candidates,
  history,
  onAssign,
  onUnassign,
  onReject,
  onSimulateTimeout,
}: DispatchDrawerProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("technicians");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [simulateConflict, setSimulateConflict] = useState(false);

  const sessionHistory = useMemo(() => {
    if (!session) return [];

    return history
      .filter((item) => item.sessionId === session.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [history, session]);

  const recommendedCandidates = useMemo(() => {
    return candidates
      .filter((tech) => tech.isActive)
      .sort((a, b) => {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return a.distance - b.distance;
      });
  }, [candidates]);

  if (!isOpen || !session) return null;

  const canAssign =
    session.status === "BROADCASTING" || session.status === "AI_CONSULTING";

  const canUnassign =
    session.status === "MATCHED" ||
    session.status === "EN_ROUTE" ||
    session.status === "ARRIVED";

  const versionForAction = simulateConflict
    ? session.version - 1
    : session.version;

  const handleAssignClick = (techId: string) => {
    void onAssign(session.id, techId, versionForAction);
  };

  const handleUnassignClick = () => {
    void onUnassign(
      session.id,
      cancelReason || "Admin hủy gán để điều phối lại",
      versionForAction,
    );

    setShowCancelInput(false);
    setCancelReason("");
  };

  const handleRejectClick = () => {
    void onReject(
      session.id,
      "Khách hàng báo bận/yêu cầu đổi thợ",
      versionForAction,
    );
  };

  const handleTimeoutClick = () => {
    void onSimulateTimeout(session.id, versionForAction);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#020617]/60 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng chi tiết điều phối"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <section className="relative z-10 flex h-[min(820px,calc(100dvh-40px))] w-[min(1200px,calc(100vw-32px))] flex-col overflow-hidden rounded-[28px] border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] text-[var(--admin-strong-text)] shadow-[0_30px_100px_-36px_rgba(15,23,42,0.58)] ring-1 ring-black/5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-white/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#111c31] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-[0_30px_100px_-34px_rgba(0,0,0,0.86)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:ring-white/5">
        <header className="shrink-0 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-black text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFB366]">
                  #{session.id}
                </span>

                <span
                  className={[
                    "inline-flex h-8 items-center rounded-full border px-3 text-sm font-semibold",
                    getStatusBadgeStyle(session.status),
                  ].join(" ")}
                >
                  {JOB_STATUS_VI[session.status]}
                </span>

                <span className="inline-flex h-8 max-w-full items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 text-sm font-semibold text-[var(--admin-muted-text)] shadow-sm">
                  <span className="truncate">
                    {session.technician
                      ? `Thợ xử lý: ${session.technician.fullName}`
                      : "Chưa có thợ nhận"}
                  </span>
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--admin-strong-text)]">
                Chi tiết điều phối
              </h2>

              <p className="mt-1 truncate text-sm font-medium text-[var(--admin-muted-text)]">
                {session.deviceType} · phiên bản v{session.version}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] shadow-sm transition hover:border-[#FF7A00]/45 hover:bg-[#FF7A00]/10 hover:text-[#FF7A00]"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_430px]">
          <main className="min-h-0 overflow-y-auto border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5 lg:border-b-0 lg:border-r">
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <SectionCard title="Thông tin khách hàng" icon={User}>
                  <div className="space-y-3">
                    <InfoRow label="Khách hàng" value={session.customerName} />

                    <InfoRow
                      label="Số điện thoại"
                      value={session.customerPhone || "Chưa có số điện thoại"}
                      icon={Phone}
                    />

                    <InfoRow
                      label="Địa chỉ"
                      value={session.address || "Chưa cập nhật địa chỉ"}
                      icon={MapPin}
                      multiline
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Thông tin sự cố" icon={Wrench}>
                  <div className="space-y-3">
                    <InfoRow label="Thiết bị" value={session.deviceType} />

                    <InfoRow
                      label="Triệu chứng"
                      value={session.symptom || "Chưa có mô tả triệu chứng"}
                      multiline
                    />

                    <InfoRow
                      label="Trạng thái"
                      value={JOB_STATUS_VI[session.status]}
                    />

                    <InfoRow label="Phiên bản" value={`v${session.version}`} />
                  </div>
                </SectionCard>
              </div>

              <SectionCard title="Tóm tắt xử lý" icon={AlertTriangle}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SummaryPill
                    label="Tình trạng gán thợ"
                    value={
                      session.technician
                        ? session.technician.fullName
                        : "Chưa có thợ nhận"
                    }
                    tone={session.technician ? "green" : "amber"}
                  />

                  <SummaryPill
                    label="Có thể gán thợ"
                    value={canAssign ? "Có thể thao tác" : "Không khả dụng"}
                    tone={canAssign ? "orange" : "muted"}
                  />

                  <SummaryPill
                    label="Có thể hủy gán"
                    value={canUnassign ? "Có thể thao tác" : "Không khả dụng"}
                    tone={canUnassign ? "rose" : "muted"}
                  />

                  <SummaryPill
                    label="Số thợ đề xuất"
                    value={`${recommendedCandidates.length} thợ`}
                    tone="orange"
                  />
                </div>
              </SectionCard>

              {session.technician ? (
                <SectionCard title="Thợ đang xử lý" icon={UserCheck}>
                  <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4 shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-white/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#16233d]">
                    <p className="text-lg font-black text-[var(--admin-strong-text)]">
                      {session.technician.fullName}
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InfoRow
                        label="Liên hệ"
                        value={
                          session.technician.phoneNumber || "Chưa cập nhật"
                        }
                        icon={Phone}
                      />

                      <InfoRow
                        label="Đánh giá"
                        value={`${session.technician.averageRating ?? 0} sao`}
                        icon={Star}
                      />
                    </div>
                  </div>
                </SectionCard>
              ) : null}
            </div>
          </main>

          <aside className="flex min-h-0 flex-col bg-[var(--admin-card-soft-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0f172a]">
            <div className="shrink-0 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101a2d]">
              <h3 className="text-lg font-black text-[var(--admin-strong-text)]">
                Gán thợ
              </h3>

              <p className="mt-1 text-sm leading-6 text-[var(--admin-muted-text)]">
                Chọn kỹ thuật viên phù hợp để điều phối cho ca này.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-1.5 shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-white/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#16233d]">
                <TabButton
                  active={activeTab === "technicians"}
                  onClick={() => setActiveTab("technicians")}
                  icon={Users}
                >
                  Thợ
                </TabButton>

                <TabButton
                  active={activeTab === "history"}
                  onClick={() => setActiveTab("history")}
                  icon={History}
                >
                  Lịch sử
                </TabButton>

                <TabButton
                  active={activeTab === "simulation"}
                  onClick={() => setActiveTab("simulation")}
                  icon={Sliders}
                >
                  Mô phỏng
                </TabButton>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {activeTab === "technicians" ? (
                <TechnicianTab
                  session={session}
                  candidates={recommendedCandidates}
                  canAssign={canAssign}
                  canUnassign={canUnassign}
                  showCancelInput={showCancelInput}
                  cancelReason={cancelReason}
                  onCancelReasonChange={setCancelReason}
                  onShowCancelInput={() => setShowCancelInput(true)}
                  onHideCancelInput={() => {
                    setShowCancelInput(false);
                    setCancelReason("");
                  }}
                  onAssign={handleAssignClick}
                  onUnassign={handleUnassignClick}
                  onReject={handleRejectClick}
                />
              ) : null}

              {activeTab === "history" ? (
                <HistoryTab history={sessionHistory} />
              ) : null}

              {activeTab === "simulation" ? (
                <SimulationTab
                  session={session}
                  simulateConflict={simulateConflict}
                  onToggleConflict={() =>
                    setSimulateConflict((current) => !current)
                  }
                  onSimulateTimeout={handleTimeoutClick}
                />
              ) : null}
            </div>
          </aside>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-6 py-4 shadow-[0_-10px_30px_rgba(15,23,42,0.04)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101a2d]">
          <p className="text-sm font-medium text-[var(--admin-muted-text)]">
            Bên trái là thông tin đơn. Bên phải là khu vực gán thợ và lịch sử.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] shadow-sm transition hover:border-[#FF7A00]/45 hover:bg-[#FF7A00]/10 hover:text-[#FF7A00]"
          >
            Đóng
          </button>
        </footer>
      </section>
    </div>
  );
}

function TechnicianTab({
  session,
  candidates,
  canAssign,
  canUnassign,
  showCancelInput,
  cancelReason,
  onCancelReasonChange,
  onShowCancelInput,
  onHideCancelInput,
  onAssign,
  onUnassign,
  onReject,
}: {
  session: ChatSession;
  candidates: CandidateTechnician[];
  canAssign: boolean;
  canUnassign: boolean;
  showCancelInput: boolean;
  cancelReason: string;
  onCancelReasonChange: (value: string) => void;
  onShowCancelInput: () => void;
  onHideCancelInput: () => void;
  onAssign: (technicianId: string) => void;
  onUnassign: () => void;
  onReject: () => void;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-white/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#111c31]">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22D3EE]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#67E8F9]">
            <UserCheck className="h-5 w-5" />
          </span>

          <div>
            <h4 className="text-base font-black text-[var(--admin-strong-text)]">
              Trạng thái phân công
            </h4>

            <p className="mt-2 text-sm leading-6 text-[var(--admin-muted-text)]">
              {session.technician
                ? `Ca này đang được xử lý bởi ${session.technician.fullName}.`
                : "Ca này chưa có kỹ thuật viên nhận. Chọn một thợ phù hợp bên dưới để điều phối thủ công."}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-white/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#111c31]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="text-base font-black text-[var(--admin-strong-text)]">
            Thợ đề xuất
          </h4>

          <span className="rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-3 py-1 text-sm font-bold text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#FBBF24]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFD08A]">
            {candidates.length} thợ
          </span>
        </div>

        {candidates.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4 text-center text-sm font-medium text-[var(--admin-muted-text)]">
            Không có thợ sửa chữa hoạt động.
          </p>
        ) : (
          <div className="space-y-3">
            {candidates.map((tech) => {
              const isCurrentTech = session.technicianId === tech.id;
              const canAssignTech = canAssign && tech.isOnline;

              return (
                <article
                  key={tech.id}
                  className={[
                    "rounded-2xl border p-4 shadow-sm transition-colors",
                    isCurrentTech
                      ? "border-[#22C55E]/40 bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22C55E]/28 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#132a24]"
                      : "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] hover:border-[#F59E0B]/35 hover:bg-[#F59E0B]/5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-white/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#16233d] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#F59E0B]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#1c2a45]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={[
                            "h-2.5 w-2.5 shrink-0 rounded-full",
                            tech.isOnline ? "bg-[#22C55E]" : "bg-[#64748B]",
                          ].join(" ")}
                        />

                        <h5 className="truncate text-base font-black text-[var(--admin-strong-text)]">
                          {tech.fullName}
                        </h5>
                      </div>

                      <div className="mt-2 space-y-1 text-sm font-medium text-[var(--admin-muted-text)]">
                        <p>SĐT: {tech.phoneNumber}</p>

                        <p>
                          <span className="font-bold text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
                            ★ {tech.averageRating.toFixed(1)}
                          </span>
                          <span className="mx-2 text-[var(--admin-muted-text)]">
                            ·
                          </span>
                          {tech.distance.toFixed(1)} km
                          <span className="mx-2 text-[var(--admin-muted-text)]">
                            ·
                          </span>
                          {tech.activeJobCount} đơn
                        </p>
                      </div>
                    </div>

                    {isCurrentTech ? (
                      <span className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl border border-[#22C55E]/25 bg-[#22C55E]/10 px-3 text-sm font-bold text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
                        <Check className="h-4 w-4" />
                        Đang gán
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAssign(tech.id)}
                        disabled={!canAssignTech}
                        className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/12 px-4 text-sm font-bold text-[#B45309] shadow-sm transition hover:border-[#F59E0B]/55 hover:bg-[#F59E0B]/18 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#FBBF24]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/14 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFE2AE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#F59E0B]/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Gán thợ
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {canUnassign ? (
        <section className="rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/10 p-4 shadow-sm">
          <h4 className="text-base font-black text-[var(--admin-strong-text)]">
            Thao tác điều phối
          </h4>

          {!showCancelInput ? (
            <div className="mt-4 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={onReject}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-3 text-sm font-bold text-[#B45309] transition hover:border-[#F59E0B]/60 hover:bg-[#F59E0B]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
              >
                Khách từ chối thợ
              </button>

              <button
                type="button"
                onClick={onShowCancelInput}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#EF4444]/35 bg-[#EF4444]/10 px-3 text-sm font-bold text-[#B91C1C] transition hover:border-[#EF4444]/60 hover:bg-[#EF4444]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]"
              >
                Hủy gán thợ
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <input
                value={cancelReason}
                onChange={(event) => onCancelReasonChange(event.target.value)}
                placeholder="Nhập lý do hủy gán..."
                className="h-11 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] focus:border-[#EF4444]/60 focus:ring-2 focus:ring-red-500/20"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onHideCancelInput}
                  className="h-10 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)]"
                >
                  Hủy bỏ
                </button>

                <button
                  type="button"
                  onClick={onUnassign}
                  disabled={!cancelReason.trim()}
                  className="h-10 rounded-xl bg-[#EF4444] px-4 text-sm font-bold text-white transition hover:bg-[#DC2626] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

function HistoryTab({ history }: { history: SessionAssignmentHistory[] }) {
  if (history.length === 0) {
    return (
      <section className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 shadow-sm">
        <p className="text-center text-sm font-medium text-[var(--admin-muted-text)]">
          Chưa có lịch sử điều phối cho đơn này.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 shadow-sm">
      <h4 className="mb-4 text-base font-black text-[var(--admin-strong-text)]">
        Lịch sử điều phối
      </h4>

      <div className="space-y-3">
        {history.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black text-[var(--admin-strong-text)]">
                  {ASSIGNMENT_ACTION_VI[item.action]}
                  {item.technicianName ? (
                    <span className="text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFB366]">
                      {" "}
                      · {item.technicianName}
                    </span>
                  ) : null}
                </p>

                <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
                  Người thực hiện:{" "}
                  <span className="font-bold text-[var(--admin-strong-text)]">
                    {item.operatorName}
                  </span>
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-2.5 py-1 text-xs font-bold text-[var(--admin-muted-text)]">
                {formatTime(item.createdAt)}
              </span>
            </div>

            {item.reason ? (
              <p className="mt-3 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-3 text-sm leading-6 text-[var(--admin-muted-text)]">
                Lý do: {item.reason}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function SimulationTab({
  session,
  simulateConflict,
  onToggleConflict,
  onSimulateTimeout,
}: {
  session: ChatSession;
  simulateConflict: boolean;
  onToggleConflict: () => void;
  onSimulateTimeout: () => void;
}) {
  return (
    <section className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 shadow-sm">
      <h4 className="text-base font-black text-[var(--admin-strong-text)]">
        Công cụ mô phỏng
      </h4>

      <p className="mt-2 text-sm leading-6 text-[var(--admin-muted-text)]">
        Chỉ dùng để kiểm tra nghiệp vụ điều phối trong môi trường phát triển.
      </p>

      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={onToggleConflict}
          className={[
            "inline-flex min-h-10 w-full items-center justify-center rounded-xl border px-3 text-sm font-bold transition",
            simulateConflict
              ? "border-[#EF4444]/55 bg-[#EF4444]/15 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]"
              : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] hover:border-[#FF7A00]/45 hover:bg-[#FF7A00]/10 hover:text-[#FF7A00]",
          ].join(" ")}
        >
          {simulateConflict
            ? "Đang giả lập xung đột phiên bản"
            : "Giả lập xung đột gán đúp"}
        </button>

        {session.status === "MATCHED" ? (
          <button
            type="button"
            onClick={onSimulateTimeout}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 text-sm font-bold text-[#B45309] transition hover:border-[#F59E0B]/70 hover:bg-[#F59E0B]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
          >
            <RotateCw className="h-4 w-4" />
            Giả lập hết giờ phản hồi
          </button>
        ) : null}

        {simulateConflict ? (
          <p className="rounded-xl border border-[#EF4444]/25 bg-[#EF4444]/10 p-3 text-sm leading-6 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
            Khi kích hoạt, thao tác điều phối sẽ gửi phiên bản cũ để mô phỏng
            lỗi cập nhật đồng thời.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  const toneClass =
    Icon === User
      ? {
          rail: "bg-gradient-to-r from-[#06B6D4] via-[#22D3EE] to-transparent",
          icon: "border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22D3EE]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#67E8F9]",
        }
      : Icon === AlertTriangle
        ? {
            rail: "bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-transparent",
            icon: "border-[#0EA5E9]/25 bg-[#0EA5E9]/10 text-[#0369A1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#38BDF8]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0EA5E9]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#7DD3FC]",
          }
        : Icon === UserCheck
          ? {
              rail: "bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-transparent",
              icon: "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#4ADE80]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#86EFAC]",
            }
          : {
              rail: "bg-gradient-to-r from-[#F59E0B] via-[#FB923C] to-transparent",
              icon: "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#FBBF24]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
            };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-white/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#111c31]">
      <span
        aria-hidden="true"
        className={["absolute inset-x-0 top-0 h-1", toneClass.rail].join(" ")}
      />

      <div className="mb-4 flex items-center gap-3">
        <span className={["grid h-10 w-10 shrink-0 place-items-center rounded-xl border", toneClass.icon].join(" ")}>
          <Icon className="h-5 w-5" />
        </span>

        <h3 className="text-base font-black text-[var(--admin-strong-text)]">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
  multiline = false,
}: {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
  multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-[128px_minmax(0,1fr)] gap-3 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 py-3 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
        {label}
      </p>

      <div className="flex min-w-0 items-start gap-2">
        {Icon ? (
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]" />
        ) : null}

        <p
          className={[
            "min-w-0 text-sm font-black text-[var(--admin-strong-text)]",
            multiline
              ? "break-words leading-6 [overflow-wrap:anywhere]"
              : "truncate",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "orange" | "green" | "amber" | "rose" | "muted";
}) {
  const toneClass = {
    orange:
      "border-[#FB923C]/30 bg-[#FB923C]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#FB923C]/22 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#FB923C]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFD08A]",
    green:
      "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22C55E]/22 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#123126] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#86EFAC]",
    amber:
      "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/22 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#2b2316] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCD34D]",
    rose:
      "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#EF4444]/22 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#31171a] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
    muted:
      "border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] text-[var(--admin-muted-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-white/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#16233d]",
  }[tone];

  return (
    <div className={["rounded-2xl border p-4 shadow-sm", toneClass].join(" ")}>
      <p className="text-xs font-black uppercase tracking-[0.12em] opacity-80">
        {label}
      </p>

      <p className="mt-1 text-base font-black">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 text-sm font-bold transition",
        active
          ? "border border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#FBBF24]/18 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFD08A]"
          : "text-[var(--admin-muted-text)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{children}</span>
    </button>
  );
}

function formatTime(dateStr: string) {
  try {
    const date = new Date(dateStr);

    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
