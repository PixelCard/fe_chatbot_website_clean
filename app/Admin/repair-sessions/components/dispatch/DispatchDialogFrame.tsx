"use client";

import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";

export type DispatchDialogBaseProps = {
  open: boolean;
  submitting: boolean;
  onClose: () => void;
};

export function DispatchDialogFrame({
  open,
  title,
  description,
  submitting,
  onClose,
  children,
}: DispatchDialogBaseProps & {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open, submitting]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#020817]/80 p-3 backdrop-blur-sm sm:items-center sm:p-5"
    >
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        className="absolute inset-0 cursor-default"
        disabled={submitting}
        onClick={onClose}
      />

      <section className="relative z-10 max-h-[92dvh] w-full max-w-xl overflow-hidden rounded-3xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] shadow-2xl [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#31415C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--admin-soft-panel-border)] px-4 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#26364F] sm:px-5">
          <div className="min-w-0">
            <h3
              id={titleId}
              className="text-lg font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
            >
              {title}
            </h3>
            <p className="mt-1 text-sm font-medium leading-6 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Đóng"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-theme-text)] transition hover:border-[var(--admin-control-hover-border)] hover:text-[var(--admin-strong-text)] disabled:opacity-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#31415C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {children}
      </section>
    </div>
  );
}

export function DispatchDialogFooter({
  submitting,
  confirmLabel,
  disabled,
  danger = false,
  onClose,
}: {
  submitting: boolean;
  confirmLabel: string;
  disabled: boolean;
  danger?: boolean;
  onClose: () => void;
}) {
  return (
    <footer className="flex flex-col-reverse gap-3 border-t border-[var(--admin-soft-panel-border)] px-4 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#26364F] sm:flex-row sm:justify-end sm:px-5">
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="h-11 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-5 text-sm font-semibold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] disabled:opacity-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#26364F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]"
      >
        Quay lại
      </button>
      <button
        type="submit"
        disabled={disabled || submitting}
        className={[
          "h-11 rounded-xl px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50",
          danger
            ? "bg-rose-600 hover:bg-rose-700"
            : "bg-[#0E7490] hover:bg-[#155E75] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#04101F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:brightness-110",
        ].join(" ")}
      >
        {submitting ? "Đang xử lý..." : confirmLabel}
      </button>
    </footer>
  );
}
