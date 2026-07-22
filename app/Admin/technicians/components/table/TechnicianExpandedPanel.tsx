import type { ReactNode } from "react";
import { Eye, Lock, ShieldCheck, Unlock, Wrench } from "lucide-react";

import { ActionButton } from "@/app/components/common/action-button/ActionButton";

import type { Technician } from "../../types/technician.types";
import { jobStatusLabel } from "../../utils/technicianStatusMeta";

export default function TechnicianExpandedPanel({
  technician,
  actionLoading = false,
  onVerify,
  onToggleActive,
}: {
  technician: Technician;
  actionLoading?: boolean;
  onVerify?: (technician: Technician) => void;
  onToggleActive?: (technician: Technician) => void;
}) {
  return (
    <div className="border-t border-[#D0D5DD] bg-[#F8FAFC] px-4 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_auto]">
        <PanelCard
          title="Thông tin cá nhân"
          titleClass="text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
        >
          <InfoText label="Họ tên" value={technician.fullName} strong />
          <InfoText label="Số điện thoại" value={technician.phoneNumber} />
          <InfoText label="Email" value={technician.email} breakWords />
        </PanelCard>

        <PanelCard
          title="Trạng thái & hiệu suất"
          titleClass="text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
        >
          <InfoText
            label="Trực tuyến"
            value={technician.isOnline ? "Online" : "Offline"}
            valueClass={
              technician.isOnline
                ? "text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
                : "text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]"
            }
          />

          <InfoText
            label="Xác minh"
            value={technician.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            valueClass={
              technician.isVerified
                ? "text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                : "text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
            }
          />

          <InfoText
            label="Tài khoản"
            value={technician.isActive ? "Đang hoạt động" : "Bị khóa"}
            valueClass={
              technician.isActive
                ? "text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
                : "text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]"
            }
          />

          <OrderSummaryRow
            label="Đơn"
            processingCount={technician.activeJobCount}
            completedCount={technician.completedJobCount}
          />

          <InfoText
            label="Đánh giá"
            value={`${formatRating(technician.averageRating)} sao`}
          />
        </PanelCard>

        <PanelCard
          title="Đơn hiện tại"
          titleClass="text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
        >
          {technician.currentJob ? (
            <>
              <InfoText label="Mã đơn" value={technician.currentJob.id} strong />

              <InfoText
                label="Trạng thái"
                value={
                  jobStatusLabel[technician.currentJob.status] ??
                  technician.currentJob.status
                }
              />

              <InfoText
                label="Thiết bị"
                value={technician.currentJob.deviceType}
              />

              <InfoText
                label="Triệu chứng"
                value={technician.currentJob.symptom}
                breakWords
              />
            </>
          ) : (
            <div className="rounded-xl border border-[#22C55E]/25 bg-[#F0FDF4] px-3 py-2 text-sm font-semibold text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
              Chưa nhận đơn nào.
            </div>
          )}
        </PanelCard>

        <article className="flex flex-col gap-2.5 rounded-2xl border border-[#D0D5DD] bg-white p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] xl:w-[180px]">
          <h4 className="mb-1 text-base font-extrabold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
            Hành động
          </h4>

          <ActionButton
            href={`/admin/accounts/${technician.id}`}
            label="Chi tiết"
            fullWidth
            className={technicianActionClass("neutral")}
            icon={<Eye className="h-4 w-4" strokeWidth={2.6} />}
          />

          {!technician.isVerified ? (
            <ActionButton
              label="Xác minh"
              fullWidth
              tone="info"
              disabled={!onVerify || actionLoading}
              loading={actionLoading}
              onClick={() => onVerify?.(technician)}
              className={technicianActionClass("info")}
              icon={<ShieldCheck className="h-4 w-4" strokeWidth={2.6} />}
            />
          ) : null}

          <ActionButton
            label={technician.isActive ? "Khóa" : "Mở khóa"}
            fullWidth
            tone={technician.isActive ? "danger" : "success"}
            disabled={!onToggleActive || actionLoading}
            loading={actionLoading}
            onClick={() => onToggleActive?.(technician)}
            className={technicianActionClass(
              technician.isActive ? "danger" : "success",
            )}
            icon={
              technician.isActive ? (
                <Lock className="h-4 w-4" strokeWidth={2.6} />
              ) : (
                <Unlock className="h-4 w-4" strokeWidth={2.6} />
              )
            }
          />

          <ActionButton
            label="Xem đơn"
            fullWidth
            tone="warning"
            disabled={!technician.currentJob}
            onClick={() => {
              if (!technician.currentJob) return;
              window.location.href = `/admin/chats?sessionId=${technician.currentJob.id}`;
            }}
            className={technicianActionClass("warning")}
            icon={<Wrench className="h-4 w-4" strokeWidth={2.6} />}
          />
        </article>
      </div>
    </div>
  );
}

function PanelCard({
  title,
  titleClass,
  children,
}: {
  title: string;
  titleClass: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#D0D5DD] bg-white p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
      <h4 className={`mb-3 text-base font-extrabold ${titleClass}`}>
        {title}
      </h4>

      <div className="space-y-2.5">{children}</div>
    </article>
  );
}

function InfoText({
  label,
  value,
  breakWords = false,
  strong = false,
  valueClass,
}: {
  label: string;
  value: string | number | null | undefined;
  breakWords?: boolean;
  strong?: boolean;
  valueClass?: string;
}) {
  const displayValue = getDisplayValue(value);

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-2.5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <p className="text-[13px] font-semibold text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
        {label}
      </p>

      <p
        title={displayValue}
        className={[
          "mt-0.5 text-[15px] leading-6",
          strong ? "font-extrabold" : "font-bold",
          valueClass ||
            "text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white",
          breakWords ? "break-words [overflow-wrap:anywhere]" : "truncate",
          displayValue === "Chưa cập nhật"
            ? "italic text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]"
            : "",
        ].join(" ")}
      >
        {displayValue}
      </p>
    </div>
  );
}

function OrderSummaryRow({
  label,
  processingCount,
  completedCount,
}: {
  label: string;
  processingCount?: number | null;
  completedCount?: number | null;
}) {
  const processing = formatCount(processingCount);
  const completed = formatCount(completedCount);

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-2.5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <p className="text-[13px] font-semibold text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
        {label}
      </p>

      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[15px] font-extrabold leading-6">
        <span className="text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
          {processing} đang xử lý
        </span>

        <span className="text-[#98A2B3] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
          |
        </span>

        <span className="text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
          {completed} hoàn thành
        </span>
      </div>
    </div>
  );
}

// Giữ khác biệt màu cho từng action nhưng thống nhất cấu trúc qua shared button.
function technicianActionClass(
  tone: "neutral" | "info" | "danger" | "success" | "warning",
) {
  if (tone === "info") {
    return "h-11 border-2 font-extrabold border-[#06B6D4]/45 bg-[#ECFEFF] text-[#0891B2] shadow-[0_10px_24px_-20px_rgba(6,182,212,0.65)] hover:border-[#06B6D4]/70 hover:bg-[#CFFAFE] hover:text-[#0E7490] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white";
  }

  if (tone === "danger") {
    return "h-11 border-2 font-extrabold border-[#EF4444]/45 bg-[#FEF2F2] text-[#B91C1C] shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)] hover:border-[#EF4444]/70 hover:bg-[#FEE2E2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#EF4444]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white";
  }

  if (tone === "success") {
    return "h-11 border-2 font-extrabold border-[#22C55E]/45 bg-[#F0FDF4] text-[#15803D] shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)] hover:border-[#22C55E]/70 hover:bg-[#DCFCE7] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white";
  }

  if (tone === "warning") {
    return "h-11 border-2 font-extrabold border-[#F59E0B]/45 bg-[#FFF7ED] text-[#B45309] shadow-[0_10px_24px_-20px_rgba(245,158,11,0.65)] hover:border-[#F59E0B]/70 hover:bg-[#FFEDD5] hover:text-[#92400E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white";
  }

  return "h-11 border font-bold border-[#D0D5DD] bg-[#F8FAFC] text-[#344054] hover:border-[#FF8A1F]/40 hover:bg-white hover:text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#D1D5DB] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#22D3EE]";
}

function getDisplayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "Chưa cập nhật";

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "Chưa cập nhật";
  }

  return value.trim() ? value : "Chưa cập nhật";
}

function formatCount(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return value.toLocaleString("vi-VN");
}

function formatRating(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.0";
  return value.toFixed(1);
}
