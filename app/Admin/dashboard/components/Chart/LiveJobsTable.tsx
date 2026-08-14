"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  UserPlus,
  Wrench,
} from "lucide-react";
import { getStatusTone, JOB_STATUS_LABEL } from "../../type/status";
import type { LiveJob } from "../../type/types";

const statusStyle = {
  good: {
    badge: "border-emerald-400/25 bg-emerald-400/8 text-emerald-300",
    dot: "bg-emerald-400",
  },
  warn: {
    badge: "border-amber-400/25 bg-amber-400/8 text-amber-300",
    dot: "bg-amber-400",
  },
  info: {
    badge: "border-cyan-400/25 bg-cyan-400/8 text-cyan-300",
    dot: "bg-cyan-400",
  },
  danger: {
    badge: "border-rose-400/25 bg-rose-400/8 text-rose-300",
    dot: "bg-rose-400",
  },
};

type LiveJobExtra = LiveJob & {
  description?: string;
  issueDetail?: string;
  detail?: string;

  technicianName?: string;
  technician?: string;
  assignedTechnician?: string;
  technicianPhone?: string;
  phone?: string;

  address?: string;
  customerName?: string;
  createdAt?: string;
};

function formatJobId(id: string) {
  return id.replace("#", "");
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
}

function getJobDetail(row: LiveJobExtra) {
  return (
    row.description ||
    row.issueDetail ||
    row.detail ||
    `Khách hàng báo sự cố: ${row.issue}. Cần kiểm tra thiết bị, xác nhận tình trạng thực tế và phân công thợ phù hợp.`
  );
}

function getTechnicianName(row: LiveJobExtra) {
  return (
    row.technicianName ||
    row.technician ||
    row.assignedTechnician ||
    "Chưa có thợ nhận"
  );
}

function getTechnicianPhone(row: LiveJobExtra) {
  return row.technicianPhone || row.phone || "Chưa có số điện thoại";
}

export default function LiveJobsTable({
  rows,
  loading,
  error,
}: {
  rows: LiveJob[];
  loading?: boolean;
  error?: string | null;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const currentRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const visiblePages = useMemo(
    () => getVisiblePages(page, totalPages),
    [page, totalPages],
  );

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
    setExpandedId(null);
  };

  const toggleRow = (id: string) => {
    setExpandedId((currentId) => (currentId === id ? null : id));
  };

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-3xl border border-[#D0D5DD] bg-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]" />
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200">
        Không tải được đơn ưu tiên: {error}
      </div>
    );
  }

  if (!rows.length) {
    return null;
  }

  return (
    <article className="w-full min-w-0 overflow-hidden rounded-3xl border border-[#D0D5DD] bg-white shadow-[0_24px_80px_-55px_rgba(15,23,42,0.18)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-[0_24px_80px_-55px_rgba(6,182,212,0.55)]">
      <div className="relative p-4 sm:p-5 lg:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(245,158,11,0.07),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.07),transparent_30%)]"
        />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/8 text-amber-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white sm:text-xl">
                Đơn cần xử lý ngay
              </h3>

              <p className="mt-0.5 text-sm text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#9CA3AF]">
                Bấm vào từng dòng để xem chi tiết và thao tác xử lý.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <select
              value={pageSize}
              onChange={(event) =>
                handlePageSizeChange(Number(event.target.value))
              }
              className="h-10 rounded-xl border border-[#D0D5DD] bg-[#F8FAFC] px-3 text-sm font-medium text-[#344054] outline-none transition focus:border-[#06B6D4]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#D1D5DB]"
            >
              <option value={5}>5 dòng</option>
              <option value={10}>10 dòng</option>
              <option value={15}>15 dòng</option>
            </select>

            <Link
              href="/admin/repair-sessions"
              className="inline-flex h-10 items-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 text-sm font-semibold text-cyan-700 transition hover:border-cyan-500/50 hover:bg-cyan-500/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-400/8 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300"
            >
              Xem tất cả
            </Link>
          </div>
        </div>

        <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]/70">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[14%]" />
                <col className="w-[25%]" />
                <col className="w-[34%]" />
                <col className="w-[27%]" />
              </colgroup>

              <thead>
                <tr className="border-b border-[#E4E7EC] bg-[#F2F4F7] text-xs uppercase tracking-[0.12em] text-[#475569] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F]/80 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
                  <th className="px-4 py-3 font-bold">MÃ ĐƠN</th>
                  <th className="px-4 py-3 font-bold">TÊN THIẾT BỊ</th>
                  <th className="px-4 py-3 font-bold">SỰ CỐ</th>
                  <th className="px-4 py-3 font-bold">TRẠNG THÁI</th>
                </tr>
              </thead>

              <tbody>
                {currentRows.map((rawRow) => {
                  const row = rawRow as LiveJobExtra;
                  const statusTone = getStatusTone(row.status);
                  const status = statusStyle[statusTone];
                  const jobId = formatJobId(row.id);
                  const isExpanded = expandedId === row.id;
                  const technicianName = getTechnicianName(row);
                  const technicianPhone = getTechnicianPhone(row);

                  return (
                    <Fragment key={row.id}>
                      <tr
                        onClick={() => toggleRow(row.id)}
                        className={[
                          "group cursor-pointer border-b text-[#344054] transition last:border-b-0 hover:bg-[#F2F4F7] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#E5E7EB] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#101B2E]/90",
                          isExpanded
                            ? "border-cyan-400/35 bg-cyan-400/[0.06]"
                            : "border-[#E4E7EC] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]/60",
                        ].join(" ")}
                      >
                        <td className="px-4 py-4">
                          <span className="font-semibold text-[#111827] transition group-hover:text-cyan-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:group-hover:text-cyan-300">
                            {row.id}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            title={row.device}
                            className="block truncate font-medium text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#D1D5DB]"
                          >
                            {row.device}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            title={row.issue}
                            className="block truncate text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#9CA3AF]"
                          >
                            {row.issue}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <span
                              title={JOB_STATUS_LABEL[row.status]}
                              className={[
                                "inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold",
                                status.badge,
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "h-1.5 w-1.5 shrink-0 rounded-full",
                                  status.dot,
                                ].join(" ")}
                              />

                              <span className="truncate">
                                {JOB_STATUS_LABEL[row.status]}
                              </span>
                            </span>

                            <ChevronDown
                              className={[
                                "h-4 w-4 shrink-0 text-[#64748B] transition-transform duration-200 group-hover:text-cyan-300",
                                isExpanded ? "rotate-180 text-cyan-300" : "",
                              ].join(" ")}
                            />
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={4} className="p-0">
                          <div
                            className={[
                              "grid transition-all duration-300 ease-in-out",
                              isExpanded
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0",
                            ].join(" ")}
                          >
                            <div className="overflow-hidden">
                              <div className="border-b border-[#E4E7EC] bg-[#F8FAFC] px-4 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]/70">
                                <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_auto] xl:items-stretch">
                                  <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]/80">
                                    <div className="flex items-center gap-2 text-sm font-bold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                                      <Wrench className="h-4 w-4 text-cyan-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300" />
                                      Mô tả chi tiết sự cố
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-[#475569] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#9CA3AF]">
                                      {getJobDetail(row)}
                                    </p>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                      <div className="rounded-xl bg-[#F1F5F9] px-3 py-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
                                        <p className="text-xs font-semibold text-[#64748B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
                                          Mức độ
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                                          {row.severity}
                                        </p>
                                      </div>

                                      <div className="rounded-xl bg-[#F1F5F9] px-3 py-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
                                        <p className="text-xs font-semibold text-[#64748B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
                                          Khách hàng
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                                          {row.customerName || "Chưa có dữ liệu"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]/80">
                                    <div className="flex items-center gap-2 text-sm font-bold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                                      <UserPlus className="h-4 w-4 text-cyan-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300" />
                                      Thợ nhận đơn
                                    </div>

                                    <div className="mt-3 space-y-3">
                                      <div className="rounded-xl bg-[#F1F5F9] px-3 py-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
                                        <p className="text-xs font-semibold text-[#64748B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
                                          Tên thợ
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                                          {technicianName}
                                        </p>
                                      </div>

                                      <div className="rounded-xl bg-[#F1F5F9] px-3 py-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
                                        <p className="flex items-center gap-1 text-xs font-semibold text-[#64748B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
                                          <Phone className="h-3.5 w-3.5" />
                                          Số điện thoại
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                                          {technicianPhone}
                                        </p>
                                      </div>

                                      <div className="rounded-xl bg-[#F1F5F9] px-3 py-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
                                        <p className="flex items-center gap-1 text-xs font-semibold text-[#64748B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
                                          <MapPin className="h-3.5 w-3.5" />
                                          Địa chỉ
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                                          {row.address || "Chưa có dữ liệu"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-2 xl:w-[150px]">
                                    <Link
                                      href={`/admin/dispatch?sessionId=${jobId}`}
                                      onClick={(event) => event.stopPropagation()}
                                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 text-sm font-semibold text-cyan-700 transition hover:border-cyan-500/50 hover:bg-cyan-500/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-400/8 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300"
                                    >
                                      <UserPlus className="h-4 w-4" />
                                      Gán thợ
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="relative mt-5 flex justify-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-3 text-xs font-medium text-[#475569] transition hover:border-cyan-500/35 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#D0D5DD] disabled:hover:text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#9CA3AF] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:disabled:hover:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:disabled:hover:text-[#9CA3AF]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Trước</span>
            </button>

            {visiblePages.map((pageNumber, index) => {
              const previousPage = visiblePages[index - 1];
              const hasGap = previousPage && pageNumber - previousPage > 1;

              return (
                <div key={pageNumber} className="flex items-center gap-2">
                  {hasGap ? (
                    <span className="text-xs text-[#64748B]">...</span>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    className={[
                      "h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition",
                      page === pageNumber
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-400/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
                        : "border-[#D0D5DD] bg-white text-[#475569] hover:border-cyan-500/35 hover:text-cyan-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#9CA3AF] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white",
                    ].join(" ")}
                  >
                    {pageNumber}
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-3 text-xs font-medium text-[#475569] transition hover:border-cyan-500/35 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#D0D5DD] disabled:hover:text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#9CA3AF] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:disabled:hover:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:disabled:hover:text-[#9CA3AF]"
            >
              <span className="hidden sm:inline">Sau</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}






