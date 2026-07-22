import {
  BriefcaseBusiness,
  MapPin,
  Phone,
  Star,
  UserCheck,
} from "lucide-react";

import type {
  RepairSession,
  Technician,
} from "../../types/repairSession.types";

export function DispatchTechnicianPicker({
  session,
  technicians,
  selectedTechnicianId,
  onSelect,
  onConfirm,
  disabled,
}: {
  session: RepairSession;
  technicians: Technician[];
  selectedTechnicianId: string;
  onSelect: (technicianId: string) => void;
  onConfirm: () => void;
  disabled: boolean;
}) {
  const currentTechnician = session.technician;
  const assignLabel = currentTechnician
    ? "Xác nhận gán lại"
    : "Xác nhận phân công";

  return (
    <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
            Kỹ thuật viên phụ trách
          </h3>
          <p className="mt-1 text-sm font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
            {currentTechnician
              ? `${currentTechnician.fullName} đang phụ trách ca này.`
              : "Ca chưa được phân công kỹ thuật viên."}
          </p>
        </div>

        <span
          className={[
            "inline-flex min-h-7 shrink-0 items-center rounded-full border px-2.5 text-xs font-medium",
            currentTechnician?.isOnline
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-300"
              : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#334155] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]",
          ].join(" ")}
        >
          {currentTechnician
            ? currentTechnician.isOnline
              ? "Online"
              : "Offline"
            : "Chưa có thợ"}
        </span>
      </div>

      {currentTechnician ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Metric
            icon={Phone}
            label="Liên hệ"
            value={currentTechnician.phoneNumber || "Chưa cập nhật"}
          />
          <Metric
            icon={Star}
            label="Đánh giá"
            value={`${currentTechnician.averageRating ?? 0}/5 · ${currentTechnician.totalReviews ?? 0} lượt`}
          />
        </div>
      ) : null}

      <div className="mt-4 border-t border-[var(--admin-soft-panel-border)] pt-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              Chọn thợ phù hợp
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
              Ưu tiên thợ gần, đang online và có tải việc thấp.
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
            {technicians.length} thợ
          </span>
        </div>

        {technicians.length > 0 ? (
          <div className="mt-3 space-y-2">
            {technicians.slice(0, 6).map((technician) => {
              const selected = technician.id === selectedTechnicianId;

              return (
                <button
                  key={technician.id}
                  type="button"
                  onClick={() => onSelect(technician.id)}
                  disabled={disabled}
                  aria-pressed={selected}
                  className={[
                    "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60",
                    selected
                      ? "border-[#FF8A1F]/50 bg-[#FF8A1F]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22D3EE]/55 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10"
                      : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mt-1 h-4 w-4 shrink-0 rounded-full border-2",
                      selected
                        ? "border-[#FF8A1F] bg-[#FF8A1F] shadow-[inset_0_0_0_3px_white] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22D3EE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22D3EE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-[inset_0_0_0_3px_#0D1728]"
                        : "border-[var(--admin-muted-text)]",
                    ].join(" ")}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                        {technician.fullName}
                      </p>
                      <span className="text-xs font-medium text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                        {technician.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {technician.distanceKm != null
                          ? `${technician.distanceKm} km`
                          : "Chưa rõ khoảng cách"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                        {technician.currentWorkload
                          ? `${technician.currentWorkload} ca`
                          : "Rảnh"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {technician.averageRating ?? 0}/5
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-[var(--admin-soft-panel-border)] p-4 text-center text-sm font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#334155] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
            Chưa có kỹ thuật viên gợi ý phù hợp.
          </p>
        )}

        <button
          type="button"
          onClick={onConfirm}
          disabled={disabled || !selectedTechnicianId}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#FF8A1F]/35 bg-[#FF8A1F]/10 px-4 text-sm font-semibold text-[#C2410C] transition hover:border-[#FF8A1F]/55 hover:bg-[#FF8A1F]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
        >
          <UserCheck className="h-4 w-4" />
          {assignLabel}
        </button>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 py-2.5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <p className="text-xs font-medium text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
        {label}
      </p>
      <p className="mt-1 flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
        <Icon className="h-3.5 w-3.5 shrink-0 text-[#EA580C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]" />
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}
