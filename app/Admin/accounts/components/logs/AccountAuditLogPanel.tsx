"use client";

import { useMemo, useState } from "react";
import { FileClock } from "lucide-react";
import type {
  AccountAuditLogItem as AuditLog,
  AuditActionFilter,
} from "../../types/account.types";
import AccountAuditLogFilters from "./AccountAuditLogFilters";
import AccountAuditLogItem from "./AccountAuditLogItem";

type Props = {
  logs: AuditLog[];
  loading?: boolean;
  error?: string | null;
};

export default function AccountAuditLogPanel({
  logs,
  loading,
  error,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditActionFilter>("ALL");

  const filteredLogs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return logs.filter((item) => {
      const matchesAction = actionFilter === "ALL" || item.action === actionFilter;

      const matchesSearch =
        !keyword ||
        item.actorName.toLowerCase().includes(keyword) ||
        item.targetAccountName.toLowerCase().includes(keyword) ||
        item.reason.toLowerCase().includes(keyword) ||
        item.oldValue?.toLowerCase().includes(keyword) ||
        item.newValue?.toLowerCase().includes(keyword);

      return matchesAction && matchesSearch;
    });
  }, [logs, searchTerm, actionFilter]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-3xl border border-[#1E2A3F] bg-[#101B2E]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-6">
        <h3 className="text-base font-semibold text-[#F87171]">
          Không tải được nhật ký
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#D1D5DB]">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <AccountAuditLogFilters
        searchTerm={searchTerm}
        actionFilter={actionFilter}
        onSearchChange={setSearchTerm}
        onActionChange={setActionFilter}
      />

      {!filteredLogs.length ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#1E2A3F] bg-[#101B2E] p-8 text-center">
          <FileClock className="h-10 w-10 text-[#64748B]" />
          <h3 className="mt-4 text-base font-semibold text-white">
            Chưa có nhật ký phù hợp
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#9CA3AF]">
            Các thay đổi nhạy cảm như khóa tài khoản, đổi vai trò hoặc reset mật
            khẩu sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((item) => (
            <AccountAuditLogItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}