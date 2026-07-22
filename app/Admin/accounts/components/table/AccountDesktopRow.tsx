import Link from "next/link";

import { AdminDetailAction } from "../../../_shared/components/AdminDetailAction";
import type { AccountItem } from "../../types/account.types";
import { getActiveBadge } from "../../utils/accountFormatters";

type Props = {
  row: AccountItem;
  onViewDetail: (account: AccountItem) => void;
};

function getRoleLabel(role: AccountItem["role"]) {
  if (role === "USER") return "Khách hàng";
  if (role === "TECHNICIAN") return "Kỹ thuật viên";
  return "Quản trị viên";
}

export default function AccountDesktopRow({ row, onViewDetail }: Props) {
  return (
    <tr className="border-b border-[var(--admin-row-border)] text-[var(--admin-theme-text)] transition hover:bg-[var(--admin-row-hover)]">
      <td className="px-5 py-4.5 align-middle whitespace-nowrap">
        <span className="text-sm font-bold leading-5 text-[var(--admin-strong-text)]">
          #{row.id}
        </span>
      </td>

      <td className="px-5 py-4.5 align-middle">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-[15px] font-bold leading-5 text-[var(--admin-strong-text)]">
            {row.fullName}
          </p>
        </div>
      </td>

      <td className="px-5 py-4.5 align-middle">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium leading-5 text-[var(--admin-theme-text)]">
            {row.email || "Chưa có email"}
          </p>
        </div>
      </td>

      <td className="px-5 py-4.5 align-middle">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-semibold leading-5 text-[var(--admin-strong-text)]">
            {getRoleLabel(row.role)}
          </p>
        </div>
      </td>

      <td className="px-5 py-4.5 align-middle whitespace-nowrap">
        <span
          className={[
            "inline-flex h-7 items-center rounded-full border px-3 text-xs font-semibold",
            getActiveBadge(row.isActive),
          ].join(" ")}
        >
          {row.isActive ? "Hoạt động" : "Bị khóa"}
        </span>
      </td>

      <td className="px-5 py-4.5 align-middle">
        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          <AdminDetailAction onClick={() => onViewDetail(row)} />

          <Link
            href={`/admin/accounts/${row.id}/edit`}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/80 bg-amber-100 px-3.5 text-sm font-bold leading-5 text-amber-800 transition-colors hover:border-amber-500/80 hover:bg-amber-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#7C4A10] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#2A1607] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:border-[#A16207] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40"
          >
            {"S\u1eeda"}
          </Link>
        </div>
      </td>
    </tr>
  );
}
