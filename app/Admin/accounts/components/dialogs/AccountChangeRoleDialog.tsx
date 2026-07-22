"use client";

import { useState } from "react";
import { Loader2, ShieldAlert, X } from "lucide-react";

import type {
  AccountItem,
  AccountRole,
  ChangeRoleFormValues,
} from "../../types/account.types";
import { ACCOUNT_ROLE_OPTIONS } from "../../constants/account.constants";
import {
  hasValidationErrors,
  validateChangeRoleForm,
} from "../../utils/accountValidation";
import { getRoleLabel } from "../../utils/accountFormatters";

type Props = {
  open: boolean;
  account: AccountItem | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (values: ChangeRoleFormValues) => void;
};

export default function AccountChangeRoleDialog({
  open,
  account,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const [role, setRole] = useState<AccountRole>("USER");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open || !account) return null;

  const values: ChangeRoleFormValues = {
    role,
    reason,
  };

  const errors = submitted
    ? validateChangeRoleForm(values, account.role)
    : {};

  const handleConfirm = () => {
    setSubmitted(true);

    const nextErrors = validateChangeRoleForm(values, account.role);
    if (hasValidationErrors(nextErrors)) return;

    onConfirm({
      role,
      reason: reason.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-role-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#1E2A3F] bg-[#101B2E] shadow-[0_24px_80px_-45px_rgba(0,0,0,0.9)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#1E2A3F] p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#FBBF24]">
              <ShieldAlert className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h2
                id="change-role-title"
                className="text-lg font-semibold text-white"
              >
                Đổi vai trò tài khoản
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">
                Thao tác này ảnh hưởng trực tiếp đến quyền truy cập của tài
                khoản. Cần nhập lý do để lưu nhật ký quản trị.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Đóng hộp thoại"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1E2A3F] bg-[#0D1728] text-[#9CA3AF] transition hover:border-[#64748B]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 p-4 sm:p-5">
          <section className="rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
              Tài khoản
            </p>

            <div className="mt-3 space-y-1">
              <p className="truncate text-base font-semibold text-white">
                {account.fullName}
              </p>

              <p className="font-mono text-sm font-semibold text-[#94A3B8]">
                #{account.id}
              </p>

              <p className="text-sm text-[#9CA3AF]">
                Vai trò hiện tại:{" "}
                <span className="font-semibold text-white">
                  {getRoleLabel(account.role)}
                </span>
              </p>
            </div>
          </section>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#D1D5DB]">
              Vai trò mới
            </label>

            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AccountRole)}
              disabled={loading}
              className={[
                "h-11 w-full rounded-2xl border bg-[#07111F] px-3 text-base text-white outline-none transition",
                errors.role
                  ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
                  : "border-[#1E2A3F] focus:border-[#06B6D4]/60 focus:ring-[#06B6D4]/25",
                "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {ACCOUNT_ROLE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {errors.role ? (
              <p className="text-sm font-medium text-[#F87171]">
                {errors.role}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="change-role-reason"
              className="text-sm font-semibold text-[#D1D5DB]"
            >
              Lý do đổi vai trò
            </label>

            <textarea
              id="change-role-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={loading}
              rows={4}
              placeholder="Ví dụ: Đã xác minh hồ sơ kỹ thuật viên..."
              className={[
                "w-full resize-none rounded-2xl border bg-[#07111F] px-3 py-3 text-base text-white outline-none transition placeholder:text-[#64748B]",
                errors.reason
                  ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
                  : "border-[#1E2A3F] focus:border-[#06B6D4]/60 focus:ring-[#06B6D4]/25",
                "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            />

            {errors.reason ? (
              <p className="text-sm font-medium text-[#F87171]">
                {errors.reason}
              </p>
            ) : (
              <p className="text-sm leading-6 text-[#64748B]">
                Lý do sẽ được ghi vào audit log.
              </p>
            )}
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-[#1E2A3F] p-4 sm:flex-row sm:justify-end sm:p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#1E2A3F] bg-[#0D1728] px-4 text-base font-semibold text-[#D1D5DB] transition hover:border-[#64748B]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748B]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 text-base font-semibold text-white transition hover:bg-[#D97706] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Đang xử lý..." : "Xác nhận đổi vai trò"}
          </button>
        </footer>
      </div>
    </div>
  );
}
