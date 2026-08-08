import type { ReactNode } from "react";
import { Eye, Lock, ShieldCheck, Unlock } from "lucide-react";

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
          title="ThÃ´ng tin cÃ¡ nhÃ¢n"
          titleClass="text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
        >
          <InfoText label="Há» tÃªn" value={technician.fullName} strong />
          <InfoText label="Sá»‘ Ä‘iá»‡n thoáº¡i" value={technician.phoneNumber} />
          <InfoText label="Email" value={technician.email} breakWords />
        </PanelCard>

        <PanelCard
          title="Tráº¡ng thÃ¡i & hiá»‡u suáº¥t"
          titleClass="text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
        >
          <InfoText
            label="Trá»±c tuyáº¿n"
            value={technician.isOnline ? "Online" : "Offline"}
            valueClass={
              technician.isOnline
                ? "text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
                : "text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]"
            }
          />

          <InfoText
            label="XÃ¡c minh"
            value={technician.isVerified ? "ÄÃ£ xÃ¡c minh" : "ChÆ°a xÃ¡c minh"}
            valueClass={
              technician.isVerified
                ? "text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                : "text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
            }
          />

          <InfoText
            label="TÃ i khoáº£n"
            value={technician.isActive ? "Äang hoáº¡t Ä‘á»™ng" : "Bá»‹ khÃ³a"}
            valueClass={
              technician.isActive
                ? "text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
                : "text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]"
            }
          />

          <OrderSummaryRow
            label="ÄÆ¡n"
            processingCount={technician.activeJobCount}
            completedCount={technician.completedJobCount}
          />

          <InfoText
            label="ÄÃ¡nh giÃ¡"
            value={`${formatRating(technician.averageRating)} sao`}
          />
        </PanelCard>

        <PanelCard
          title="ÄÆ¡n hiá»‡n táº¡i"
          titleClass="text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
        >
          {technician.currentJob ? (
            <>
              <InfoText label="MÃ£ Ä‘Æ¡n" value={technician.currentJob.id} strong />

              <InfoText
                label="Tráº¡ng thÃ¡i"
                value={
                  jobStatusLabel[technician.currentJob.status] ??
                  technician.currentJob.status
                }
              />

              <InfoText
                label="Thiáº¿t bá»‹"
                value={technician.currentJob.deviceType}
              />

              <InfoText
                label="Triá»‡u chá»©ng"
                value={technician.currentJob.symptom}
                breakWords
              />
            </>
          ) : (
            <div className="rounded-xl border border-[#22C55E]/25 bg-[#F0FDF4] px-3 py-2 text-sm font-semibold text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
              ChÆ°a nháº­n Ä‘Æ¡n nÃ o.
            </div>
          )}
        </PanelCard>

        <article className="flex flex-col gap-2.5 rounded-2xl border border-[#D0D5DD] bg-white p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] xl:w-[180px]">
          <h4 className="mb-1 text-base font-extrabold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
            HÃ nh Ä‘á»™ng
          </h4>

          <ActionButton
            href={`/admin/accounts/${technician.id}`}
            label="Chi tiáº¿t"
            fullWidth
            className={technicianActionClass("neutral")}
            icon={<Eye className="h-4 w-4" strokeWidth={2.6} />}
          />

          {!technician.isVerified ? (
            <ActionButton
              label="XÃ¡c minh"
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
            label={technician.isActive ? "KhÃ³a" : "Má»Ÿ khÃ³a"}
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
          displayValue === "ChÆ°a cáº­p nháº­t"
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
          {processing} Ä‘ang xá»­ lÃ½
        </span>

        <span className="text-[#98A2B3] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
          |
        </span>

        <span className="text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
          {completed} hoÃ n thÃ nh
        </span>
      </div>
    </div>
  );
}

// Giá»¯ khÃ¡c biá»‡t mÃ u cho tá»«ng action nhÆ°ng thá»‘ng nháº¥t cáº¥u trÃºc qua shared button.
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
  if (value === null || value === undefined) return "ChÆ°a cáº­p nháº­t";

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "ChÆ°a cáº­p nháº­t";
  }

  return value.trim() ? value : "ChÆ°a cáº­p nháº­t";
}

function formatCount(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return value.toLocaleString("vi-VN");
}

function formatRating(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.0";
  return value.toFixed(1);
}



