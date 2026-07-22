import { Fragment } from "react";
import { ChevronDown, Star, Wrench } from "lucide-react";

import type { Technician } from "../../types/technician.types";
import TechnicianExpandedPanel from "./TechnicianExpandedPanel";
import TechnicianStatusBadge from "./TechnicianStatusBadge";
import {
  getInitials,
  getTechnicianDisplayStatus,
} from "../../utils/technicianStatusMeta";

type TechnicianTableProps = {
  rows: Technician[];
  expandedId: string | null;
  actionLoading?: boolean;
  onToggleExpand: (id: string) => void;
  onVerifyTechnician?: (technician: Technician) => void;
  onToggleTechnicianActive?: (technician: Technician) => void;
};

export default function TechnicianTable({
  rows,
  expandedId,
  actionLoading = false,
  onToggleExpand,
  onVerifyTechnician,
  onToggleTechnicianActive,
}: TechnicianTableProps) {
  if (!rows.length) {
    return (
      <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-6 text-center text-sm font-semibold text-[var(--admin-muted-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
        Không tìm thấy thợ phù hợp với bộ lọc hiện tại.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
      <div className="space-y-3 p-3 lg:hidden">
        {rows.map((technician) => {
          const displayStatus = getTechnicianDisplayStatus(technician);
          const isExpanded = expandedId === technician.id;

          return (
            <article
              key={technician.id}
              className={[
                "overflow-hidden rounded-2xl border bg-[var(--admin-control-bg)] transition [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]",
                isExpanded
                  ? "border-[#FF8A1F]/45 shadow-[0_18px_55px_-38px_rgba(255,138,31,0.45)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-[0_18px_55px_-38px_rgba(6,182,212,0.55)]"
                  : "border-[var(--admin-soft-panel-border)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => onToggleExpand(technician.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <Avatar technician={technician} size="lg" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-[var(--admin-strong-text)]">
                          {getSafeText(technician.fullName, "Không rõ thợ")}
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
                          {getSafeText(
                            technician.phoneNumber,
                            "Chưa có số điện thoại",
                          )}
                        </p>
                      </div>

                      <ChevronDown
                        className={[
                          "mt-1 h-5 w-5 shrink-0 text-[var(--admin-subtle-text)] transition",
                          isExpanded
                            ? "rotate-180 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                            : "",
                        ].join(" ")}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <TechnicianStatusBadge status={displayStatus} />

                      <RatingBadge
                        rating={technician.averageRating}
                        totalReviews={technician.totalReviews}
                      />
                    </div>

                    <CurrentJobInline technician={technician} />
                  </div>
                </div>
              </button>

              <ExpandableRow expanded={isExpanded}>
                <TechnicianExpandedPanel
                  technician={technician}
                  actionLoading={actionLoading}
                  onVerify={onVerifyTechnician}
                  onToggleActive={onToggleTechnicianActive}
                />
              </ExpandableRow>
            </article>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <div className="scrollbar-hidden w-full overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[34%]" />
              <col className="w-[18%]" />
              <col className="w-[26%]" />
              <col className="w-[14%]" />
              <col className="w-[8%]" />
            </colgroup>

            <thead>
              <tr className="border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-table-header-bg)] text-xs uppercase tracking-[0.12em] text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F]">
                <th className="px-4 py-3 font-bold">Thợ</th>
                <th className="px-4 py-3 font-bold">Trạng thái</th>
                <th className="px-4 py-3 font-bold">Đơn đang xử lý</th>
                <th className="px-4 py-3 font-bold">Đánh giá</th>
                <th className="px-4 py-3 text-right font-bold">Mở rộng</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((technician) => {
                const displayStatus = getTechnicianDisplayStatus(technician);
                const isExpanded = expandedId === technician.id;

                return (
                  <Fragment key={technician.id}>
                    <tr
                      onClick={() => onToggleExpand(technician.id)}
                      className={[
                        "group cursor-pointer border-b transition hover:bg-[var(--admin-control-hover-bg)]",
                        isExpanded
                          ? "border-[#FF8A1F]/35 bg-[#FF8A1F]/[0.05] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/[0.06]"
                          : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]",
                      ].join(" ")}
                    >
                      <td className="px-4 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar technician={technician} />

                          <div className="min-w-0">
                            <p className="truncate font-bold text-[var(--admin-strong-text)]">
                              {getSafeText(
                                technician.fullName,
                                "Không rõ thợ",
                              )}
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
                              {getSafeText(
                                technician.phoneNumber,
                                "Chưa có số điện thoại",
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <TechnicianStatusBadge status={displayStatus} />
                      </td>

                      <td className="px-4 py-4">
                        <CurrentJobCell technician={technician} />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-[#F59E0B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-bold">
                            {formatRating(technician.averageRating)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-semibold text-[var(--admin-subtle-text)]">
                          {formatCount(technician.totalReviews)} đánh giá
                        </p>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggleExpand(technician.id);
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-subtle-text)] transition hover:border-[#FF8A1F]/40 hover:text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#22D3EE]"
                          aria-label="Mở rộng thông tin thợ"
                        >
                          <ChevronDown
                            className={[
                              "h-4 w-4 transition-transform",
                              isExpanded ? "rotate-180" : "",
                            ].join(" ")}
                          />
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={5} className="p-0">
                        <ExpandableRow expanded={isExpanded}>
                          <TechnicianExpandedPanel
                            technician={technician}
                            actionLoading={actionLoading}
                            onVerify={onVerifyTechnician}
                            onToggleActive={onToggleTechnicianActive}
                          />
                        </ExpandableRow>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Avatar({
  technician,
  size = "md",
}: {
  technician: Technician;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={[
        "relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#FF8A1F] to-[#FDBA74] font-bold text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:from-[#22C55E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:via-[#06B6D4] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:to-[#0EA5E9]",
        size === "lg" ? "h-12 w-12 text-sm" : "h-11 w-11 text-sm",
      ].join(" ")}
    >
      {getInitials(getSafeText(technician.fullName, "T"))}

      <span
        className={[
          "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#101B2E]",
          technician.isOnline ? "bg-[#22C55E]" : "bg-[#EF4444]",
        ].join(" ")}
      />
    </div>
  );
}

function CurrentJobCell({ technician }: { technician: Technician }) {
  const job = technician.currentJob;

  if (!job) {
    return (
      <span className="inline-flex max-w-full items-center rounded-full border border-[#22C55E]/25 bg-[#22C55E]/10 px-3 py-1.5 text-sm font-bold text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
        Không có đơn
      </span>
    );
  }

  return (
    <div className="min-w-0">
      <p className="truncate font-bold text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
        {getSafeText(job.id)} · {getSafeText(job.deviceType)}
      </p>

      <p className="mt-1 line-clamp-1 text-xs font-semibold text-[var(--admin-muted-text)]">
        {getSafeText(job.symptom, "Chưa có mô tả")}
      </p>
    </div>
  );
}

function CurrentJobInline({ technician }: { technician: Technician }) {
  const job = technician.currentJob;

  if (!job) {
    return (
      <p className="mt-3 text-sm font-semibold text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
        Không có đơn đang xử lý
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 p-3">
      <div className="flex items-start gap-2">
        <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]" />

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
            {getSafeText(job.id)} · {getSafeText(job.deviceType)}
          </p>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#D1D5DB]">
            {getSafeText(job.symptom, "Chưa có mô tả")}
          </p>
        </div>
      </div>
    </div>
  );
}

function RatingBadge({
  rating,
  totalReviews,
}: {
  rating?: number | null;
  totalReviews?: number | null;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-2.5 py-1 text-xs font-bold text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
      <Star className="h-3.5 w-3.5 fill-current" />
      {formatRating(rating)}
      <span className="font-semibold opacity-75">
        ({formatCount(totalReviews)})
      </span>
    </span>
  );
}

function ExpandableRow({
  expanded,
  children,
}: {
  expanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "grid transition-all duration-300 ease-in-out",
        expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      ].join(" ")}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function getSafeText(value?: string | null, fallback = "Chưa cập nhật") {
  if (!value) return fallback;
  return value.trim() ? value : fallback;
}

function formatRating(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.0";
  return value.toFixed(1);
}

function formatCount(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return value.toLocaleString("vi-VN");
}
