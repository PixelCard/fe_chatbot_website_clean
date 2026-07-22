import Link from "next/link";
import { ArrowUpRight, UserCheck, Wrench } from "lucide-react";

import type { Technician } from "../../type/types";

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return 0;
}

function getSafeText(value?: string | null, fallback = "Chưa cập nhật") {
  if (!value) return fallback;
  return value.trim() ? value : fallback;
}

function getInitials(name?: string | null) {
  const safeName = getSafeText(name, "T");

  return safeName
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function getWorkloadStatus(activeJobs: number) {
  if (activeJobs >= 3) {
    return {
      label: "Sắp bận",
      badge:
        "border-[#F59E0B]/30 bg-[#FFF7ED] text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
      dot: "bg-[#F59E0B]",
    };
  }

  if (activeJobs >= 1) {
    return {
      label: "Đang xử lý",
      badge:
        "border-[#06B6D4]/30 bg-[#ECFEFF] text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
      dot: "bg-[#06B6D4]",
    };
  }

  return {
    label: "Rảnh",
    badge:
      "border-[#22C55E]/30 bg-[#F0FDF4] text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    dot: "bg-[#22C55E]",
  };
}

export default function OnlineTechniciansTable({
  rows,
  loading,
  error,
}: {
  rows: Technician[];
  loading?: boolean;
  error?: string | null;
}) {
  if (loading) {
    return (
      <div className="h-72 animate-pulse rounded-3xl border border-[#D0D5DD] bg-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]" />
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm font-semibold text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
        Không tải được danh sách thợ online: {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-[#D0D5DD] bg-white p-5 text-sm font-medium text-[#475467] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
        Chưa có thợ online.
      </div>
    );
  }

  const visibleRows = rows.slice(0, 4);
  const remaining = Math.max(0, rows.length - visibleRows.length);
  const freeCount = rows.filter((row) => toNumber(row.activeJobs) === 0).length;

  return (
    <article className="overflow-hidden rounded-3xl border border-[#D0D5DD] bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.14)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <div className="border-b border-[#E4E7EC] px-5 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#22C55E]/25 bg-[#F0FDF4] text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
              <UserCheck className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                Thợ đang online
              </h3>

              <p className="mt-0.5 text-sm font-medium text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                Danh sách thợ có thể nhận đơn.
              </p>
            </div>
          </div>

          <Link
            href="/admin/technicians"
            className="inline-flex shrink-0 items-center gap-1 rounded-xl px-2 py-1 text-sm font-semibold text-[#0891B2] transition hover:bg-[#ECFEFF] hover:text-[#0E7490] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white"
          >
            Quản lý
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <SummaryPill label="Online" value={rows.length} tone="default" />
          <SummaryPill label="Rảnh" value={freeCount} tone="green" />
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {visibleRows.map((row) => {
            const activeJobs = toNumber(row.activeJobs);
            const workload = getWorkloadStatus(activeJobs);

            return (
              <Link
                key={row.id}
                href={`/admin/accounts/${row.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-3 transition hover:border-[#CBD5E1] hover:bg-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#122039]"
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22C55E] via-[#06B6D4] to-[#0EA5E9] text-sm font-bold text-white shadow-[0_14px_28px_-20px_rgba(6,182,212,0.75)]">
                  {getInitials(row.name)}

                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22C55E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#0D1728]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                        {getSafeText(row.name, "Không rõ thợ")}
                      </p>

                      <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm font-normal text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                        <Wrench className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {getSafeText(row.expertise, "Chưa có chuyên môn")}
                        </span>
                      </p>
                    </div>

                    <span
                      className={[
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        workload.badge,
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          workload.dot,
                        ].join(" ")}
                      />
                      {workload.label}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {remaining > 0 ? (
          <Link
            href="/admin/technicians"
            className="mt-3 flex h-11 items-center justify-center rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] text-sm font-semibold text-[#475467] transition hover:border-[#06B6D4]/35 hover:bg-[#ECFEFF] hover:text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#122039] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#22D3EE]"
          >
            Xem thêm {remaining} thợ
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "default" | "green";
}) {
  const toneClass = {
    default:
      "border-[#D0D5DD] bg-white text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]",
    green:
      "border-[#22C55E]/25 bg-[#F0FDF4] text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
  }[tone];

  return (
    <span
      className={[
        "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-semibold",
        toneClass,
      ].join(" ")}
    >
      <span>{label}</span>
      <strong className="text-sm font-bold">{value}</strong>
    </span>
  );
}
