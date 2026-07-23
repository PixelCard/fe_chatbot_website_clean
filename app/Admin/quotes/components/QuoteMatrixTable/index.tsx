"use client";

import { KeyboardEvent, useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  ReceiptText,
  Zap,
} from "lucide-react";

import { Pagination } from "@/app/components/Pagination";
import { AdminDetailAction } from "@/app/Admin/_shared/components/AdminDetailAction";
import { getAdminDetailActionClass } from "@/app/Admin/_shared/styles/detailAction";

import type { QuoteItem } from "../../types/quote.types";

interface QuoteMatrixTableProps {
  data: QuoteItem[];
  selectedId?: string;
  onSelect: (quote: QuoteItem) => void;
  onOpenAction: (quote: QuoteItem) => void;
}

const ITEMS_PER_PAGE = 10;

export default function QuoteMatrixTable({
  data,
  selectedId,
  onSelect,
  onOpenAction,
}: QuoteMatrixTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedData = data.slice(
    (effectivePage - 1) * ITEMS_PER_PAGE,
    effectivePage * ITEMS_PER_PAGE,
  );

  const openQuote = (quote: QuoteItem) => {
    onSelect(quote);
    onOpenAction(quote);
  };

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    quote: QuoteItem,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openQuote(quote);
    }
  };

  if (data.length === 0) {
    return (
      <section className="admin-card flex min-h-[420px] flex-col overflow-hidden rounded-2xl">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-sm rounded-2xl border border-dashed border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-6 text-center [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#31415C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F]">
            <ReceiptText className="mx-auto h-8 w-8 text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]" />

            <p className="mt-3 text-lg font-semibold text-[var(--admin-strong-text)]">
              Không có báo giá phù hợp
            </p>

            <p className="mt-2 text-base text-[var(--admin-muted-text)]">
              Thay đổi từ khóa hoặc bộ lọc để xem dữ liệu.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-card flex min-h-[420px] flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-soft-panel-border)] px-4 py-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] sm:px-5">
        <div>
          <p className="text-sm font-semibold text-[var(--admin-strong-text)]">
            Ma trận báo giá
          </p>
          <p className="mt-1 text-xs text-[var(--admin-muted-text)] sm:text-sm">
            Trang {effectivePage}/{totalPages} • Hiển thị{" "}
            {paginatedData.length} báo giá trên trang hiện tại
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#FF8A1F]/20 bg-[#FF8A1F]/10 px-3 py-1 text-xs font-medium text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
          Tổng {data.length} báo giá phù hợp bộ lọc
        </div>
      </div>

      <div className="hidden min-h-0 flex-1 overflow-auto lg:block">
        <table className="w-full min-w-[1120px] border-collapse text-left">
          <thead className="sticky top-0 z-20 border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-table-header-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#132039]">
            <tr className="text-sm font-semibold text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
              <th className="w-[170px] px-5 py-4">Mã báo giá</th>
              <th className="min-w-[260px] px-5 py-4">Khách hàng</th>
              <th className="w-[220px] px-5 py-4">Kỹ thuật viên</th>
              <th className="w-[170px] px-5 py-4 text-right">Tổng tiền</th>
              <th className="w-[190px] px-5 py-4 text-center">Trạng thái</th>
              <th className="w-[190px] px-5 py-4 text-center">Cảnh báo</th>
              <th className="w-[150px] px-5 py-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--admin-soft-panel-border)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:divide-[#1E2A3F]">
            {paginatedData.map((quote) => {
              const selected = selectedId === quote.id;

              return (
                <tr
                  key={quote.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => openQuote(quote)}
                  onKeyDown={(event) => handleRowKeyDown(event, quote)}
                  className={[
                    "group cursor-pointer outline-none transition-colors duration-200",
                    selected
                      ? "bg-[#FF8A1F]/[0.06] shadow-[inset_3px_0_0_#FF8A1F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B2233] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-[inset_3px_0_0_#22D3EE]"
                      : "bg-[var(--admin-card-bg)] hover:bg-[var(--admin-control-hover-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#0D1728]",
                    "focus-visible:bg-[var(--admin-control-hover-bg)]",
                  ].join(" ")}
                >
                  <td className="px-5 py-4 align-middle">
                    <p className="truncate font-mono text-base font-semibold text-[var(--admin-strong-text)]">
                      {quote.id}
                    </p>
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <p className="truncate text-base font-semibold text-[var(--admin-strong-text)]">
                      {quote.customerName || "--"}
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-[var(--admin-muted-text)]">
                      {quote.customerPhone || "--"}
                    </p>
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <p className="truncate text-base font-semibold text-[var(--admin-strong-text)]">
                      {quote.technicianName || "--"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-right align-middle">
                    <p
                      className={[
                        "whitespace-nowrap font-mono text-lg font-semibold",
                        quote.isAbnormalAmount
                          ? "text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
                          : "text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#E5E7EB]",
                      ].join(" ")}
                    >
                      {formatVND(quote.totalAmount)}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-center align-middle">
                    <div className="flex justify-center">
                      <QuoteStatusBadge status={quote.status} />
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center align-middle">
                    <div className="flex justify-center">
                      <WarningBadge quote={quote} />
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center align-middle">
                    <AdminDetailAction
                      onClick={(event) => {
                        event.stopPropagation();
                        openQuote(quote);
                      }}
                      size="md"
                      className="min-w-[112px]"
                      trailing={<ChevronRight className="h-4 w-4 shrink-0" />}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 lg:hidden">
        {paginatedData.map((quote) => {
          const selected = selectedId === quote.id;

          return (
            <article
              key={quote.id}
              className={[
                "overflow-hidden rounded-2xl border transition-colors duration-200",
                selected
                  ? "border-[#FF8A1F]/60 bg-[#FF8A1F]/[0.06] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B2233]"
                  : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => openQuote(quote)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-base font-semibold text-[var(--admin-strong-text)]">
                      {quote.id}
                    </p>

                    <p className="mt-1 truncate text-base font-semibold text-[var(--admin-strong-text)]">
                      {quote.customerName || "--"}
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-[var(--admin-muted-text)]">
                      {quote.customerPhone || "--"}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-[var(--admin-subtle-text)]" />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p
                    className={[
                      "whitespace-nowrap font-mono text-lg font-semibold",
                      quote.isAbnormalAmount
                        ? "text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
                        : "text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#E5E7EB]",
                    ].join(" ")}
                  >
                    {formatVND(quote.totalAmount)}
                  </p>

                  <QuoteStatusBadge status={quote.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <WarningBadge quote={quote} />
                </div>

                <div className="mt-4 flex justify-end">
                  <span className={getAdminDetailActionClass({ size: "md" })}>
                    Xem chi tiết
                  </span>
                </div>
              </button>
            </article>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
        <Pagination
          currentPage={effectivePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

function QuoteStatusBadge({ status }: { status: QuoteItem["status"] }) {
  return (
    <span
      className={[
        "inline-flex h-9 min-w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-xl border px-3.5 text-sm font-semibold leading-none",
        status === "PENDING" &&
          "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
        status === "ACCEPTED" &&
          "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
        status === "REJECTED" &&
          "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {getQuoteStatusLabel(status)}
    </span>
  );
}

function WarningBadge({ quote }: { quote: QuoteItem }) {
  if (quote.status === "PENDING" && quote.isOverdueLv2) {
    return (
      <span className="inline-flex h-9 min-w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#EF4444]/35 bg-[#EF4444]/10 px-3.5 text-sm font-semibold leading-none text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Quá hạn nặng
      </span>
    );
  }

  if (quote.status === "PENDING" && quote.isOverdueLv1) {
    return (
      <span className="inline-flex h-9 min-w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-3.5 text-sm font-semibold leading-none text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
        <Zap className="h-4 w-4 shrink-0" />
        Quá hạn nhẹ
      </span>
    );
  }

  if (quote.isStateMismatch) {
    return (
      <span className="inline-flex h-9 min-w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-[#A855F7]/35 bg-[#A855F7]/10 px-3.5 text-sm font-semibold leading-none text-[#7E22CE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#C084FC]">
        Lệch trạng thái
      </span>
    );
  }

  if (quote.isAbnormalAmount) {
    return (
      <span className="inline-flex h-9 min-w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#F97316]/35 bg-[#F97316]/10 px-3.5 text-sm font-semibold leading-none text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]">
        <HelpCircle className="h-4 w-4 shrink-0" />
        Giá bất thường
      </span>
    );
  }

  return (
    <span className="inline-flex h-9 min-w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-[#22C55E]/25 bg-[#22C55E]/10 px-3.5 text-sm font-semibold leading-none text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
      Ổn định
    </span>
  );
}

function getQuoteStatusLabel(status: QuoteItem["status"]) {
  if (status === "PENDING") return "Chờ phản hồi";
  if (status === "ACCEPTED") return "Đã chấp nhận";
  if (status === "REJECTED") return "Đã từ chối";

  return status;
}

function formatVND(amount: number) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)} đ`;
}
