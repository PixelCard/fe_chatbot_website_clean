import Link from "next/link";
import { BarChart3, Wrench } from "lucide-react";
import type { OverviewData } from "../../type/types";

export default function DashboardHeader({
  loading,
}: {
  data: OverviewData;
  loading?: boolean;
}) {
  void loading;

  return (
    <header className="admin-card relative overflow-hidden rounded-2xl px-4 py-3 sm:px-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(6,182,212,0.08),transparent_36%),radial-gradient(circle_at_right,rgba(249,115,22,0.06),transparent_32%)]"
      />

      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">

          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold tracking-tight text-[var(--admin-strong-text)] sm:text-2xl">
              Tổng quan hệ thống
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href="/admin/reports"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-4 text-sm font-bold text-[#344054] transition hover:border-[#FF8A1F]/45 hover:text-[#C2410C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#22D3EE]"
          >
            <BarChart3 className="h-4 w-4" />
            Báo cáo
          </Link>

          <Link
            href="/admin/repair-sessions"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FF8A1F] px-4 text-sm font-extrabold text-white shadow-[0_14px_30px_-20px_rgba(255,138,31,0.85)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]"
          >
            <Wrench className="h-4 w-4" />
            Ca sửa chữa
          </Link>
        </div>
      </div>
    </header>
  );
}
