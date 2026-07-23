import Link from "next/link";
import { Eye, SquarePen } from "lucide-react";

import { AdminDetailAction } from "../../../_shared/components/AdminDetailAction";
import { AdminStatusPill } from "../../../_shared/components/AdminStatusPill";
import type { AccountItem } from "../../types/account.types";
import {
  getInitials,
  getRoleBadge,
  getRoleLabel,
} from "../../utils/accountFormatters";

type Props = {
  row: AccountItem;
  onViewDetail: (account: AccountItem) => void;
};

function formatLastSeen(value: string) {
  if (!value) return "Chưa đăng nhập";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Không xác định";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AccountMobileCard({ row, onViewDetail }: Props) {
  return (
    <article className="rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
      <div className="flex items-start gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#FF8A1F] to-[#0EA5E9] text-sm font-bold text-white">
          {row.avatarUrl ? (
            <img
              src={row.avatarUrl}
              alt={row.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(row.fullName)
          )}

          <span
            className={[
              "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0D1728]",
              row.isOnline ? "bg-[#22C55E]" : "bg-[#64748B]",
            ].join(" ")}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-bold text-[#94A3B8]">#{row.id}</p>

          <h3 title={row.fullName} className="mt-1 truncate text-base font-bold text-white">
            {row.fullName}
          </h3>

          <p className="mt-1 truncate text-sm text-[#CBD5E1]">{row.phoneNumber}</p>
          <p className="mt-1 truncate text-xs text-[#64748B]">
            {row.email || "Chưa có email"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={[
                "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
                getRoleBadge(row.role),
              ].join(" ")}
            >
              {getRoleLabel(row.role)}
            </span>

            <AdminStatusPill
              tone={row.isActive ? "success" : "cancel"}
              className="px-2.5 py-1"
            >
              {row.isActive ? "Hoạt động" : "Bị khóa"}
            </AdminStatusPill>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[#1E2A3F] bg-[#0D1728]/90 p-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#64748B]">
            Thiết bị
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {row.devicesCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#1E2A3F] bg-[#0D1728]/90 p-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#64748B]">
            Đơn sửa
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {row.repairJobsCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#1E2A3F] bg-[#0D1728]/90 p-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#64748B]">
            Đánh giá
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {row.reviewsCount}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[#1E2A3F] bg-[#0D1728]/75 px-3 py-2.5 text-xs text-[#94A3B8]">
        <p>{row.isOnline ? "Đang online" : "Hiện offline"}</p>
        <p className="mt-1 text-[#64748B]">
          Đăng nhập gần nhất: {formatLastSeen(row.lastLogin)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <AdminDetailAction
          onClick={() => onViewDetail(row)}
          size="lg"
          icon={<Eye className="h-4 w-4" />}
        />

        <Link
          href={`/admin/accounts/${row.id}/edit`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/80 bg-amber-100 px-4 text-sm font-bold text-amber-800 transition hover:border-amber-500/80 hover:bg-amber-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:border-[#F59E0B]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:bg-[#1F1609] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40"
        >
          <SquarePen className="h-4 w-4" />
          Sửa
        </Link>
      </div>
    </article>
  );
}
