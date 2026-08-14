"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type AdminToast = {
  id: string;
  type: "success" | "warning" | "error" | "info";
  text: string;
};

type AdminToastStackProps = {
  toasts: AdminToast[];
  onRemove: (id: string) => void;
  autoCloseMs?: number;
};

export default function AdminToastStack({
  toasts,
  onRemove,
  autoCloseMs = 10000,
}: AdminToastStackProps) {
  const [closingIds, setClosingIds] = useState<string[]>([]);

  const sortedToasts = useMemo(() => {
    const priority = {
      error: 0,
      warning: 1,
      success: 2,
      info: 3,
    } as const;

    return [...toasts]
      .map((toast, index) => ({ toast, index }))
      .sort(
        (left, right) =>
          priority[left.toast.type] - priority[right.toast.type] ||
          right.index - left.index,
      )
      .map(({ toast }) => toast);
  }, [toasts]);

  const requestRemove = useCallback(
    (id: string) => {
      setClosingIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

      window.setTimeout(() => {
        onRemove(id);
        setClosingIds((prev) => prev.filter((item) => item !== id));
      }, 180);
    },
    [onRemove],
  );

  useEffect(() => {
    if (sortedToasts.length === 0) return;

    const activeToast = sortedToasts[0];

    if (closingIds.includes(activeToast.id)) return;

    const timer = window.setTimeout(() => {
      requestRemove(activeToast.id);
    }, autoCloseMs);

    return () => window.clearTimeout(timer);
  }, [autoCloseMs, closingIds, requestRemove, sortedToasts]);

  if (sortedToasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-6 top-24 z-[99999] flex w-full max-w-sm flex-col gap-3 [&>*]:pointer-events-auto">
      {sortedToasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            "relative overflow-hidden flex items-start gap-3 rounded-2xl border px-4 py-4 shadow-2xl backdrop-blur-md sm:px-5 sm:py-[18px]",
            closingIds.includes(toast.id) ? "toast-exit" : "toast-enter",
            toast.type === "success"
              ? "border-[#047857] bg-[#065F46]/85 text-white"
              : toast.type === "warning"
                ? "border-[#D97706] bg-[#78350F]/85 text-[#FDE68A]"
                : toast.type === "error"
                  ? "border-[#B91C1C] bg-[#7F1D1D]/85 text-[#FEE2E2]"
                  : "border-[#1D4ED8] bg-[#1E3A8A]/85 text-[#DBEAFE]",
          ].join(" ")}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#34D399]" />
          ) : null}

          {toast.type === "warning" ? (
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#FBBF24]" />
          ) : null}

          {toast.type === "error" ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#F87171]" />
          ) : null}

          {toast.type === "info" ? (
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#60A5FA]" />
          ) : null}

          <div className="min-w-0 flex-1 text-[15px] font-bold leading-7 sm:text-base">
            {toast.text}
          </div>

          <button
            type="button"
            onClick={() => requestRemove(toast.id)}
            className="shrink-0 rounded-lg p-1.5 text-[#CBD5E1] transition hover:bg-white/10 hover:text-white"
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>

          <div
            className="toast-progress-bar absolute bottom-0 left-0 h-1 w-full origin-left opacity-90"
            style={{
              animationDuration: `${autoCloseMs}ms`,
              backgroundColor:
                toast.type === "success"
                  ? "#34D399"
                  : toast.type === "warning"
                    ? "#FBBF24"
                    : toast.type === "error"
                      ? "#F87171"
                      : "#60A5FA",
            }}
          />
        </div>
      ))}

      <style jsx>{`
        .toast-enter {
          animation: toast-pop 240ms cubic-bezier(0.18, 0.9, 0.32, 1.15) both;
        }

        .toast-exit {
          animation: toast-fade 180ms ease both;
        }

        .toast-progress-bar {
          animation: toast-progress linear forwards;
        }

        @keyframes toast-pop {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toast-fade {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          to {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
        }

        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}
