"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import type { ComponentType } from "react";
import { useCallback, useEffect, useState } from "react";

type ConfirmTone = "success" | "warning" | "danger" | "info";

type Props = {
  open: boolean;
  title: string;
  description: string;
  accountName?: string;
  accountId?: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  icon?: ComponentType<{ className?: string }>;
  requireReason?: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const toneClass: Record<
  ConfirmTone,
  {
    iconWrap: string;
    icon: string;
    confirmButton: string;
  }
> = {
  info: {
    iconWrap: "border-[#06B6D4]/25 bg-[#06B6D4]/10",
    icon: "text-[#22D3EE]",
    confirmButton:
      "bg-[#06B6D4] text-white hover:bg-[#0891B2] focus-visible:ring-[#06B6D4]/40",
  },
  success: {
    iconWrap: "border-[#F59E0B]/25 bg-[#F59E0B]/10",
    icon: "text-[#FBBF24]",
    confirmButton:
      "bg-[#F59E0B] text-white hover:bg-[#D97706] focus-visible:ring-[#F59E0B]/40",
  },
  warning: {
    iconWrap: "border-[#F59E0B]/25 bg-[#F59E0B]/10",
    icon: "text-[#FBBF24]",
    confirmButton:
      "bg-[#F59E0B] text-white hover:bg-[#D97706] focus-visible:ring-[#F59E0B]/40",
  },
  danger: {
    iconWrap: "border-[#EF4444]/25 bg-[#EF4444]/10",
    icon: "text-[#F87171]",
    confirmButton:
      "bg-[#EF4444] text-white hover:bg-[#DC2626] focus-visible:ring-[#EF4444]/40",
  },
};

export default function AccountConfirmActionDialog({
  open,
  title,
  description,
  accountName,
  accountId,
  confirmLabel,
  cancelLabel = "Hủy",
  tone = "warning",
  icon: Icon = AlertTriangle,
  requireReason = true,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    setReason("");
    setSubmitted(false);
    onClose();
  }, [onClose]);

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

  if (!open) return null;

  const reasonError =
    requireReason && submitted && reason.trim().length < 5
      ? "Vui lòng nhập lý do tối thiểu 5 ký tự."
      : null;

  const handleConfirm = () => {
    setSubmitted(true);

    if (requireReason && reason.trim().length < 5) return;

    setReason("");
    setSubmitted(false);
    onConfirm(reason.trim());
  };

  const toneStyle = toneClass[tone];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-confirm-title"
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#1E2A3F] bg-[#101B2E] shadow-[0_24px_80px_-45px_rgba(0,0,0,0.9)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#1E2A3F] p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                toneStyle.iconWrap,
              ].join(" ")}
            >
              <Icon className={["h-5 w-5", toneStyle.icon].join(" ")} />
            </span>

            <div className="min-w-0">
              <h2
                id="account-confirm-title"
                className="text-lg font-semibold text-white"
              >
                {title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Đóng hộp thoại"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1E2A3F] bg-[#0D1728] text-[#9CA3AF] transition hover:border-[#64748B]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {(accountName || accountId) && (
            <section className="rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
                Tài khoản bị ảnh hưởng
              </p>

              <div className="mt-3 space-y-1">
                {accountName ? (
                  <p className="truncate text-base font-semibold text-white">
                    {accountName}
                  </p>
                ) : null}

                {accountId ? (
                  <p className="font-mono text-sm font-semibold text-[#94A3B8]">
                    #{accountId}
                  </p>
                ) : null}
              </div>
            </section>
          )}

          {requireReason ? (
            <div className="space-y-2">
              <label
                htmlFor="confirm-reason"
                className="text-sm font-semibold text-[#D1D5DB]"
              >
                Lý do thực hiện
              </label>

              <textarea
                id="confirm-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                disabled={loading}
                rows={4}
                placeholder="Nhập lý do để lưu vào nhật ký quản trị..."
                className={[
                  "w-full resize-none rounded-2xl border bg-[#07111F] px-3 py-3 text-base text-white outline-none transition placeholder:text-[#64748B]",
                  reasonError
                    ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
                    : "border-[#1E2A3F] focus:border-[#06B6D4]/60 focus:ring-[#06B6D4]/25",
                  "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              />

              {reasonError ? (
                <p className="text-sm font-medium text-[#F87171]">
                  {reasonError}
                </p>
              ) : (
                <p className="text-sm leading-6 text-[#64748B]">
                  Lý do sẽ được dùng cho audit log trong môi trường production.
                </p>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#1E2A3F] p-4 sm:flex-row sm:justify-end sm:p-5">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#1E2A3F] bg-[#0D1728] px-4 text-base font-semibold text-[#D1D5DB] transition hover:border-[#64748B]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748B]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={[
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold transition",
              "focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
              toneStyle.confirmButton,
            ].join(" ")}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
