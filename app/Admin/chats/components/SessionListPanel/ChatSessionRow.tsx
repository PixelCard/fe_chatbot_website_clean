"use client";

import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Flag,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

import {
  AdminStatusPill,
  type AdminStatusPillTone,
} from "@/app/Admin/_shared/components/AdminStatusPill";

import type { ChatSession } from "../../types/chat.types";

type Props = {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
};

export function ChatSessionRow({ session, isActive, onSelect }: Props) {
  const state = getSessionState(session);

  return (
    <div className="shrink-0 select-none px-1 py-1.5">
      <button
        type="button"
        onClick={onSelect}
        className={[
          "group relative w-full overflow-hidden rounded-2xl border p-3.5 text-left transition-[border-color,background-color,box-shadow,transform] duration-150",
          isActive
            ? "border-cyan-300/80 bg-cyan-50 shadow-[0_22px_40px_-32px_rgba(14,165,233,0.45)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/10"
            : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] hover:-translate-y-[1px] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-row-hover)] hover:shadow-[0_18px_35px_-34px_rgba(15,23,42,0.28)]",
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-y-0 left-0 w-[3px]",
            isActive
              ? "bg-[#06B6D4]"
              : session.isDangerous
                ? "bg-[#EF4444]"
                : session.isFlagged
                  ? "bg-[#F59E0B]"
                  : "bg-transparent",
          ].join(" ")}
        />

        <div className="flex items-start gap-3">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
              state.iconBoxClass,
            ].join(" ")}
          >
            {session.isDangerous ? (
              <ShieldAlert className="h-4 w-4" />
            ) : session.isFlagged ? (
              <Flag className="h-4 w-4" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--admin-strong-text)]">
                  {session.customerName}
                </p>

                <p className="mt-0.5 truncate font-mono text-[11px] font-semibold text-[var(--admin-muted-text)]">
                  {session.id}
                </p>
              </div>

              <ChevronRight
                className={[
                  "mt-1 h-4 w-4 shrink-0 transition",
                  isActive
                    ? "text-cyan-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300"
                    : "text-[var(--admin-divider-text)] group-hover:translate-x-0.5 group-hover:text-[var(--admin-muted-text)]",
                ].join(" ")}
              />
            </div>

            <p
              className={[
                "mt-2 line-clamp-2 text-sm font-medium leading-[1.35rem]",
                isActive
                  ? "text-[var(--admin-theme-text)]"
                  : "text-[var(--admin-muted-text)]",
              ].join(" ")}
            >
              {session.lastMessage || "Chưa có tin nhắn gần nhất."}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--admin-row-border)] pt-2.5">
              <div className="flex min-w-0 flex-wrap gap-1.5">
                <StatusBadge
                  label={state.label}
                  tone={state.tone}
                />
              </div>

              <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[var(--admin-muted-text)]">
                <Clock className="h-3.5 w-3.5" />
                {formatChatTime(session.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: AdminStatusPillTone;
}) {
  return (
    <AdminStatusPill
      tone={tone}
      className="min-h-8 px-3 text-[12px] font-black"
    >
      {label}
    </AdminStatusPill>
  );
}

function getSessionState(session: ChatSession) {
  if (session.isDangerous) {
    return {
      label: "Nguy hiểm",
      icon: AlertTriangle,
      tone: "danger" as const,
      iconBoxClass:
        "border-rose-300/80 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300",
    };
  }

  if (session.isFlagged) {
    return {
      label: "Đã đánh dấu",
      icon: Flag,
      tone: "warning" as const,
      iconBoxClass:
        "border-amber-300/80 bg-amber-50 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300",
    };
  }

  return {
    label: "Ổn định",
    icon: MessageSquare,
    tone: "success" as const,
    iconBoxClass:
      "border-emerald-300/80 bg-emerald-50 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-300",
  };
}

function formatChatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}
