"use client";

import { Loader2, ShieldCheck, ShieldX, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { AccountItem } from "../../types/account.types";
import AccountConfirmActionDialog from "../actions/AccountConfirmActionDialog";

type Props = {
  open: boolean;
  account: AccountItem | null;
  loading?: boolean;
  onClose: () => void;
  onUnverify: (reason: string) => Promise<void>;
  onRequestOtp: () => Promise<void>;
  onConfirmOtp: (otp: string) => Promise<void>;
};

export default function AccountVerifyDialog({
  open,
  account,
  loading = false,
  onClose,
  onUnverify,
  onRequestOtp,
  onConfirmOtp,
}: Props) {
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = useCallback(() => {
    setOtp("");
    setOtpRequested(false);
    setSubmitted(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, loading, open]);

  if (!account || !open) return null;

  if (account.isVerified) {
    return (
      <AccountConfirmActionDialog
        open={open}
        title={"Huy xac minh tai khoan"}
        description={
          "Tài khoản này sẽ bị chuyển về trạng thái chưa xác minh."
        }
        accountName={account.fullName}
        accountId={account.id}
        confirmLabel={"Huy xac minh"}
        tone="warning"
        icon={ShieldX}
        loading={loading}
        requireReason
        onClose={onClose}
        onConfirm={onUnverify}
      />
    );
  }

  const otpError =
    submitted && !/^\d{6}$/.test(otp.trim())
      ? "Vui lòng nhập đúng mã OTP gồm 6 chữ số."
      : null;

  const handleRequestOtp = async () => {
    await onRequestOtp();
    setOtpRequested(true);
  };

  const handleConfirm = async () => {
    setSubmitted(true);
    if (!/^\d{6}$/.test(otp.trim())) return;
    await onConfirmOtp(otp.trim());
    resetForm();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-verify-dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#1E2A3F] bg-[#101B2E] shadow-[0_24px_80px_-45px_rgba(0,0,0,0.9)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#1E2A3F] p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10">
              <ShieldCheck className="h-5 w-5 text-[#FBBF24]" />
            </span>

            <div className="min-w-0">
              <h2
                id="account-verify-dialog-title"
                className="text-lg font-semibold text-white"
              >
                Xac minh tai khoan bang OTP email
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">
                Gửi mã OTP tới email của tài khoản rồi nhập lại mã để hoàn tất xác minh.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Dong hop thoai"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1E2A3F] bg-[#0D1728] text-[#9CA3AF] transition hover:border-[#64748B]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <section className="rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
              Tai khoan duoc xac minh
            </p>

            <div className="mt-3 space-y-1">
              <p className="truncate text-base font-semibold text-white">
                {account.fullName}
              </p>
              <p className="truncate text-sm font-medium text-[#D1D5DB]">
                {account.email || "Chua co email"}
              </p>
            </div>
          </section>

          {!account.email ? (
            <p className="rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#FCA5A5]">
              Tài khoản này chưa có email nên không thể xác minh bằng OTP.
            </p>
          ) : null}

          <div className="space-y-2">
            <label
              htmlFor="verify-account-otp"
              className="text-sm font-semibold text-[#D1D5DB]"
            >
              Ma OTP xac minh
            </label>

            <input
              id="verify-account-otp"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={loading || !account.email}
              placeholder="Nhap 6 so OTP"
              className={[
                "h-11 w-full rounded-2xl border bg-[#07111F] px-4 text-base text-white outline-none transition placeholder:text-[#64748B]",
                otpError
                  ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
                  : "border-[#1E2A3F] focus:border-[#06B6D4]/60 focus:ring-[#06B6D4]/25",
                "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            />

            {otpError ? (
              <p className="text-sm font-medium text-[#F87171]">{otpError}</p>
            ) : otpRequested ? (
              <p className="text-sm leading-6 text-[#94A3B8]">
                Mã OTP đã được gửi. Hãy kiểm tra email rồi nhập mã để xác minh.
              </p>
            ) : (
              <p className="text-sm leading-6 text-[#64748B]">
                Bấm gửi OTP trước khi xác minh tài khoản.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#1E2A3F] p-4 sm:flex-row sm:justify-between sm:p-5">
          <button
            type="button"
            onClick={handleRequestOtp}
            disabled={loading || !account.email}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 px-4 text-base font-semibold text-[#22D3EE] transition hover:border-[#06B6D4]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Gui OTP
          </button>

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#1E2A3F] bg-[#0D1728] px-4 text-base font-semibold text-[#D1D5DB] transition hover:border-[#64748B]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748B]/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Huy
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || !account.email || !otpRequested}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 text-base font-semibold text-white transition hover:bg-[#D97706] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Xac minh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
