"use client";

import { Search } from "lucide-react";
import type { AuditActionFilter } from "../../types/account.types";

type Props = {
  searchTerm: string;
  actionFilter: AuditActionFilter;
  onSearchChange: (value: string) => void;
  onActionChange: (value: AuditActionFilter) => void;
};

const ACTION_OPTIONS: { value: AuditActionFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả hành động" },
  { value: "CREATE", label: "Tạo tài khoản" },
  { value: "UPDATE_PROFILE", label: "Cập nhật hồ sơ" },
  { value: "LOCK", label: "Khóa" },
  { value: "UNLOCK", label: "Mở khóa" },
  { value: "VERIFY", label: "Xác minh" },
  { value: "UNVERIFY", label: "Hủy xác minh" },
  { value: "CHANGE_ROLE", label: "Đổi vai trò" },
  { value: "RESET_PASSWORD", label: "Reset mật khẩu" },
];

export default function AccountAuditLogFilters({
  searchTerm,
  actionFilter,
  onSearchChange,
  onActionChange,
}: Props) {
  return (
    <section className="rounded-3xl border border-[#1E2A3F] bg-[#101B2E] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo admin, lý do, giá trị thay đổi..."
            className="h-11 w-full rounded-2xl border border-[#1E2A3F] bg-[#07111F] pl-10 pr-3 text-base font-medium text-white outline-none placeholder:text-[#64748B] focus:border-[#06B6D4]/70 focus:ring-2 focus:ring-[#06B6D4]/25"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(event) => onActionChange(event.target.value as AuditActionFilter)}
          className="h-11 w-full rounded-2xl border border-[#1E2A3F] bg-[#07111F] px-3 text-base font-medium text-white outline-none focus:border-[#06B6D4]/70 focus:ring-2 focus:ring-[#06B6D4]/25"
        >
          {ACTION_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}