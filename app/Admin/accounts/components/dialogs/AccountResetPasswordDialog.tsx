"use client";

import { useState } from "react";
import { KeyRound, Loader2, X } from "lucide-react";

import type {
  AccountItem,
  ResetPasswordFormValues,
} from "../../types/account.types";
import {
  hasValidationErrors,
  validateResetPasswordForm,
} from "../../utils/accountValidation";

type Props = {
  open: boolean;
  account: AccountItem | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (values: ResetPasswordFormValues) => void;
};

export default function AccountResetPasswordDialog({
  open,
  account,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const [values, setValues] = useState<ResetPasswordFormValues>({
    password: "",
    confirmPassword: "",
    requireChangePassword: true,
    reason: "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!open || !account) return null;

  const errors = submitted ? validateResetPasswordForm(values) : {};

  const updateField = <K extends keyof ResetPasswordFormValues>(
    key: K,
    value: ResetPasswordFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleConfirm = () => {
    setSubmitted(true);

    const nextErrors = validateResetPasswordForm(values);
    if (hasValidationErrors(nextErrors)) return;

    onConfirm({
      ...values,
      password: values.password,
      confirmPassword: values.confirmPassword,
      reason: values.reason.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#1E2A3F] bg-[#101B2E] shadow-[0_24px_80px_-45px_rgba(0,0,0,0.9)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#1E2A3F] p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#FBBF24]">
              <KeyRound className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h2
                id="reset-password-title"
                className="text-lg font-semibold text-white"
              >
                Reset mật khẩu
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">
                Tạo mật khẩu mới cho tài khoản. Không hiển thị hoặc trả mật
                khẩu cũ ra giao diện.
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

            <p className="mt-3 truncate text-base font-semibold text-white">
              {account.fullName}
            </p>

            <p className="font-mono text-sm font-semibold text-[#94A3B8]">
              #{account.id}
            </p>
          </section>

          <FieldError
            label="Mật khẩu mới"
            error={errors.password}
            input={
              <input
                type="password"
                value={values.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                disabled={loading}
                placeholder="Tối thiểu 8 ký tự, có chữ và số"
                className={inputClass(Boolean(errors.password))}
              />
            }
          />

          <FieldError
            label="Nhập lại mật khẩu"
            error={errors.confirmPassword}
            input={
              <input
                type="password"
                value={values.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                disabled={loading}
                placeholder="Nhập lại mật khẩu mới"
                className={inputClass(Boolean(errors.confirmPassword))}
              />
            }
          />

          <label className="flex items-start gap-3 rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-3">
            <input
              type="checkbox"
              checked={values.requireChangePassword}
              onChange={(event) =>
                updateField("requireChangePassword", event.target.checked)
              }
              disabled={loading}
              className="mt-1 h-4 w-4 rounded border-[#1E2A3F]"
            />

            <span>
              <span className="block text-sm font-semibold text-white">
                Yêu cầu đổi mật khẩu sau khi đăng nhập
              </span>

              <span className="mt-1 block text-sm leading-6 text-[#9CA3AF]">
                Nên bật khi admin reset mật khẩu tạm.
              </span>
            </span>
          </label>

          <div className="space-y-2">
            <label
              htmlFor="reset-reason"
              className="text-sm font-semibold text-[#D1D5DB]"
            >
              Lý do reset
            </label>

            <textarea
              id="reset-reason"
              value={values.reason}
              onChange={(event) => updateField("reason", event.target.value)}
              disabled={loading}
              rows={4}
              placeholder="Ví dụ: Người dùng yêu cầu reset qua hỗ trợ..."
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
            ) : null}
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
            {loading ? "Đang xử lý..." : "Reset mật khẩu"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function FieldError({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#D1D5DB]">{label}</label>
      {input}

      {error ? (
        <p className="text-sm font-medium text-[#F87171]">{error}</p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "h-11 w-full rounded-2xl border bg-[#07111F] px-3 text-base text-white outline-none transition placeholder:text-[#64748B]",
    hasError
      ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
      : "border-[#1E2A3F] focus:border-[#06B6D4]/60 focus:ring-[#06B6D4]/25",
    "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
  ].join(" ");
}
