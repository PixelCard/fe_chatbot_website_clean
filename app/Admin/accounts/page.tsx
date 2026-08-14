"use client";

import { useEffect, useMemo, useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import AccountHeader from "./components/layout/AccountHeader";
import AccountKpiGrid from "./components/layout/AccountKpiGrid";
import AccountFilters from "./components/filters/AccountFilters";
import AccountTable from "./components/table/AccountTable";
import AccountDetailModal from "./components/dialogs/AccountDetailModal";
import AdminToastStack, {
  type AdminToast,
} from "@/app/components/admin/AdminToastStack";
import { Pagination } from "@/app/components/Pagination";
import { useAccounts } from "./hooks";

import type {
  AccountItem,
  AccountSearchType,
  RoleFilter,
  StatusFilter,
  VerifiedFilter,
} from "./types/account.types";
import type { AccountListQuery } from "./services";

const DEFAULT_PAGE_SIZE = 10;

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<AccountSearchType>("ALL");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>("ALL");
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(
    null,
  );
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const pushToast = (type: AdminToast["type"], text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const [page, setPage] = useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;

  const query = useMemo<AccountListQuery>(
    () => ({
      keyword: searchTerm.trim() || undefined,
      role: roleFilter === "ALL" ? undefined : roleFilter,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      verified: verifiedFilter === "ALL" ? undefined : verifiedFilter,
      page,
      pageSize,
    }),
    [page, pageSize, roleFilter, searchTerm, statusFilter, verifiedFilter],
  );

  const {
    items: accounts,
    total,
    summary,
    isLoading,
    isMutating,
    error,
    refetch,
    updateQuery,
    lockAccount,
    unlockAccount,
    requestAccountVerificationOtp,
    verifyAccountWithOtp,
    unverifyAccount,
  } = useAccounts(query);

  useEffect(() => {
    updateQuery(query);
  }, [query, updateQuery]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const resetToFirstPage = () => setPage(1);

  const handleToggleLock = async (reason: string) => {
    if (!selectedAccount) return;

    try {
      const name =
        selectedAccount.fullName ||
        selectedAccount.email ||
        selectedAccount.phoneNumber;
      const isLocking = selectedAccount.isActive;
      const updated = isLocking
        ? await lockAccount(selectedAccount.id, { reason })
        : await unlockAccount(selectedAccount.id, { reason });

      setSelectedAccount(updated);
      if (isLocking) {
        pushToast("warning", `Đã khóa tài khoản ${name}`);
      } else {
        pushToast("success", `Đã mở khóa tài khoản ${name} thành công!`);
      }
    } catch (err) {
      pushToast(
        "error",
        `Lỗi thao tác: ${err instanceof Error ? err.message : "Đã có lỗi xảy ra"}`,
      );
    }
  };

  const handleUnverify = async (reason: string) => {
    if (!selectedAccount) return;

    try {
      const name =
        selectedAccount.fullName || selectedAccount.email || selectedAccount.phoneNumber;
      const updated = await unverifyAccount(selectedAccount.id, { reason });

      setSelectedAccount(updated);
      pushToast("warning", `Đã hủy xác minh tài khoản ${name}`);
    } catch (err) {
      pushToast(
        "error",
        `Thao tác thất bại: ${err instanceof Error ? err.message : "Đã có lỗi xảy ra"}`,
      );
    }
  };

  const handleRequestVerifyOtp = async () => {
    if (!selectedAccount) return;
    try {
      await requestAccountVerificationOtp(selectedAccount.id);
      pushToast("info", "Đã gửi mã OTP xác minh đến tài khoản thành công!");
    } catch (err) {
      pushToast(
        "error",
        `Gửi OTP thất bại: ${err instanceof Error ? err.message : "Đã có lỗi xảy ra"}`,
      );
    }
  };

  const handleConfirmVerifyOtp = async (otp: string) => {
    if (!selectedAccount) return;

    try {
      const updated = await verifyAccountWithOtp(selectedAccount.id, { otp });
      setSelectedAccount(updated);
      pushToast("success", "Đã xác minh tài khoản thành công!");
    } catch (err) {
      pushToast(
        "error",
        `Mã OTP không hợp lệ hoặc đã hết hạn: ${
          err instanceof Error ? err.message : "Đã có lỗi xảy ra"
        }`,
      );
    }
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <AccountHeader />

        <AccountKpiGrid summary={summary} />

        <AccountFilters
          searchTerm={searchTerm}
          searchType={searchType}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          verifiedFilter={verifiedFilter}
          onSearchChange={(value) => {
            setSearchTerm(value);
            resetToFirstPage();
          }}
          onSearchTypeChange={(value) => {
            setSearchType(value);
            resetToFirstPage();
          }}
          onRoleChange={(value) => {
            setRoleFilter(value);
            resetToFirstPage();
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            resetToFirstPage();
          }}
          onVerifiedChange={(value) => {
            setVerifiedFilter(value);
            resetToFirstPage();
          }}
        />

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
            <p className="text-sm font-medium text-red-200">
              Không tải được danh sách tài khoản.
            </p>
            <p className="mt-1 text-sm text-red-100/90">{error.message}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex h-10 items-center rounded-lg border border-red-300/40 px-4 text-sm font-medium text-red-100 transition-all duration-150 ease-out hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
            >
              Thử lại
            </button>
          </section>
        ) : null}

        {!error && isLoading ? (
          <section className="admin-card rounded-2xl p-4 sm:p-6">
            <p className="text-sm text-[var(--admin-muted-text)]">
              Đang tải dữ liệu tài khoản...
            </p>
          </section>
        ) : null}

        {!error && !isLoading ? (
          <>
            <AccountTable rows={accounts} onViewDetail={setSelectedAccount} />

            <section className="admin-card rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col gap-3 border-b border-[var(--admin-soft-panel-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--admin-strong-text)]">
                    Điều hướng danh sách tài khoản
                  </p>
                  <p className="mt-1 text-xs text-[var(--admin-muted-text)] sm:text-sm">
                    Trang {currentPage}/{totalPages} • Hiển thị {accounts.length} tài
                    khoản trên trang hiện tại
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#06B6D4]/20 bg-[#06B6D4]/10 px-3 py-1 text-xs font-medium text-[#22D3EE]">
                  Bộ lọc hiện tại đang áp dụng trên toàn danh sách
                </div>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </section>
          </>
        ) : null}

        <AccountDetailModal
          open={selectedAccount !== null}
          account={selectedAccount}
          actionLoading={isMutating}
          onClose={() => setSelectedAccount(null)}
          onToggleLock={handleToggleLock}
          onUnverify={handleUnverify}
          onRequestVerifyOtp={handleRequestVerifyOtp}
          onConfirmVerifyOtp={handleConfirmVerifyOtp}
        />
      </div>

      <AdminToastStack
        toasts={toasts}
        onRemove={(id) =>
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </AdminShell>
  );
}
