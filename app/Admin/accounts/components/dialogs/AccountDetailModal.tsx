"use client";

import Link from "next/link";
import { Mail, SquarePen, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AccountItem } from "../../types/account.types";
import AccountDetailPanel from "../detail-panel/AccountDetailPanel";
import AccountLockDialog from "./AccountLockDialog";
import AccountVerifyDialog from "./AccountVerifyDialog";
import { getActiveBadge, getInitials } from "../../utils/accountFormatters";

type Props = {
  open: boolean;
  account: AccountItem | null;
  actionLoading?: boolean;
  onClose: () => void;
  onToggleLock: (reason: string) => Promise<void>;
  onUnverify: (reason: string) => Promise<void>;
  onRequestVerifyOtp: () => Promise<void>;
  onConfirmVerifyOtp: (otp: string) => Promise<void>;
};

export default function AccountDetailModal({
  open,
  account,
  actionLoading = false,
  onClose,
  onToggleLock,
  onUnverify,
  onRequestVerifyOtp,
  onConfirmVerifyOtp,
}: Props) {
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !actionLoading &&
        !lockDialogOpen &&
        !verifyDialogOpen
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actionLoading, lockDialogOpen, onClose, open, verifyDialogOpen]);

  if (!open || !account) return null;

  const handleLockConfirm = async (reason: string) => {
    await onToggleLock(reason);
    setLockDialogOpen(false);
  };

  const handleUnverifyConfirm = async (reason: string) => {
    await onUnverify(reason);
    setVerifyDialogOpen(false);
  };

  const handleRequestVerifyOtp = async () => {
    await onRequestVerifyOtp();
  };

  const handleConfirmVerifyOtp = async (otp: string) => {
    await onConfirmVerifyOtp(otp);
    setVerifyDialogOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-detail-modal-title"
      onClick={(event) => {
        if (
          event.target === event.currentTarget &&
          !actionLoading &&
          !lockDialogOpen &&
          !verifyDialogOpen
        ) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020817]/55 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-6"
    >
      <div className="flex max-h-[calc(100dvh-32px)] w-[min(1120px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] shadow-[0_32px_120px_-45px_rgba(0,0,0,0.45)] sm:rounded-3xl">
        <header className="shrink-0 border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 py-4 sm:px-5 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#FF8A1F] to-[#0EA5E9] text-sm font-bold text-white">
                {account.avatarUrl ? (
                  <img
                    src={account.avatarUrl}
                    alt={account.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(account.fullName)
                )}
              </div>

              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h2
                    id="account-detail-modal-title"
                    title={account.fullName}
                    className="truncate text-lg font-semibold text-[var(--admin-strong-text)] sm:text-xl"
                  >
                    {account.fullName}
                  </h2>

                  <span className="font-mono text-sm font-medium text-[var(--admin-muted-text)]">
                    #{account.id}
                  </span>

                  <span className="text-sm font-semibold text-[var(--admin-theme-text)]">
                    {getRoleLabel(account.role)}
                  </span>

                  <span
                    className={[
                      "inline-flex rounded-full border px-2.5 py-1 text-sm font-bold",
                      getActiveBadge(account.isActive),
                    ].join(" ")}
                  >
                    {account.isActive ? "Hoạt động" : "Bị khóa"}
                  </span>
                </div>

                <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-[var(--admin-theme-text)]">
                  <Mail className="h-4 w-4 shrink-0 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]" />
                  <p
                    title={getSafeText(account.email)}
                    className="min-w-0 truncate font-semibold text-[var(--admin-strong-text)]"
                  >
                    {getSafeText(account.email)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/accounts/${account.id}/edit`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-400/80 bg-amber-100 px-3 text-sm font-bold text-amber-800 transition hover:border-amber-500/80 hover:bg-amber-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#2A1607] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:border-[#FBBF24]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:bg-[#3A1E07] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40"
              >
                <SquarePen className="h-4 w-4" />
                Chỉnh sửa
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng popup chi tiết tài khoản"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] transition hover:border-[#06B6D4]/50 hover:bg-cyan-100 hover:text-cyan-800 [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:bg-[#0D2538] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--admin-card-bg)]">
          <AccountDetailPanel
            account={account}
            actionLoading={actionLoading}
            onToggleVerify={() => setVerifyDialogOpen(true)}
            onToggleLock={() => setLockDialogOpen(true)}
          />
        </div>
      </div>
      <AccountLockDialog
        open={lockDialogOpen}
        account={account}
        loading={actionLoading}
        onClose={() => setLockDialogOpen(false)}
        onConfirm={handleLockConfirm}
      />
      <AccountVerifyDialog
        open={verifyDialogOpen}
        account={account}
        loading={actionLoading}
        onClose={() => setVerifyDialogOpen(false)}
        onUnverify={handleUnverifyConfirm}
        onRequestOtp={handleRequestVerifyOtp}
        onConfirmOtp={handleConfirmVerifyOtp}
      />
    </div>
  );
}

function getRoleLabel(role: AccountItem["role"]) {
  if (role === "USER") return "Khách hàng";
  if (role === "TECHNICIAN") return "Kỹ thuật viên";
  return "Quản trị viên";
}

function getSafeText(value?: string | null) {
  if (!value) return "Chưa cập nhật";
  return value.trim() ? value : "Chưa cập nhật";
}
