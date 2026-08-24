"use client";

import {
  AlertTriangle,  ChevronRight,
  BookmarkCheck,
  Flag,
  LayoutGrid,
  ShieldAlert,
  X,
} from "lucide-react";

import { ActionButton } from "@/app/components/common/action-button/ActionButton";

import type { ChatSession } from "../../types/chat.types";

type Props = {
  session: ChatSession;
  onClose: () => void;
  onToggleFlag: () => void;
};

export function ChatActionDrawer({
  session,
  onClose,
  onToggleFlag,
}: Props) {
  const statusText = session.isDangerous
    ? "Nguy hiểm"
    : session.isFlagged
      ? "Đang theo dõi"
      : "Bình thường";

  return (
    <div className="flex h-full flex-col bg-[var(--admin-card-bg)] text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B1220]">
      <header className="sticky top-0 z-10 border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 py-3.5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-extrabold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              Phiên hội thoại
            </h2>

            <p className="mt-1 truncate font-mono text-xs font-bold text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
              {session.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng panel"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition hover:border-[#FF8A1F]/45 hover:text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#334155] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3">
          <StatusPill
            dangerous={session.isDangerous}
            flagged={session.isFlagged}
            label={statusText}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3.5">
        <section className="space-y-2.5 rounded-[24px] border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)]/55 p-2.5">
          <ActionButton
            onClick={onToggleFlag}
            label={session.isFlagged ? "Gỡ gắn cờ" : "Gắn cờ hội thoại"}
            tone={session.isFlagged ? "warning" : "neutral"}
            fullWidth
            heightClassName="h-14"
            className={chatDrawerActionClass}
            contentClassName="flex-1"
            labelClassName="text-sm font-extrabold leading-5 text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
            icon={
              <span className={chatDrawerActionIconClass}>
                <Flag className="h-4 w-4" />
              </span>
            }
            trailing={
              <ChevronRight className="h-4 w-4 text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]" />
            }
          />

          <ActionButton
            href="/admin/repair-sessions"
            label="Mở ca sửa chữa"
            tone="warning"
            fullWidth
            heightClassName="h-14"
            className="rounded-2xl border-[#FF8A1F]/35 bg-[#FF8A1F]/10 px-3.5 text-left hover:border-[#FF8A1F]/55 hover:bg-[#FF8A1F]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B2233] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/55 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#0D2B42]"
            contentClassName="flex-1"
            labelClassName="text-sm font-extrabold leading-5 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
            icon={
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF8A1F]/30 bg-[#FF8A1F]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
                <LayoutGrid className="h-4.5 w-4.5" />
              </span>
            }
            trailing={
              <ChevronRight className="h-4 w-4 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]" />
            }
          />

          {false ? (
            <ActionButton
              disabled
              label="Khóa gửi tin nhắn"
              tone="neutral"
              fullWidth
              heightClassName="h-14"
              className="rounded-2xl border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3.5 text-left opacity-60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]"
              contentClassName="flex-1"
              labelClassName="text-sm font-extrabold leading-5 text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
              icon={
                <span className={chatDrawerActionIconClass}>
                  <BookmarkCheck className="h-4 w-4" />
                </span>
              }
              trailing={
                <span className="rounded-lg border border-[#334155] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                  Soon
                </span>
              }
            />
          ) : null}
        </section>

        {session.flagReason ? (
          <section className="mt-3 rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-3.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]" />

              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
                  Lý do gắn cờ
                </p>

                <p className="mt-1 text-sm font-semibold leading-6 text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDE68A]">
                  {session.flagReason}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {session.isDangerous ? (
          <section className="mt-3 rounded-2xl border border-[#EF4444]/35 bg-[#EF4444]/10 p-3.5">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]" />

              <p className="text-sm font-bold leading-6 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
                Hệ thống đánh dấu phiên chat có rủi ro cao. Cần admin kiểm tra
                trước khi tiếp tục xử lý.
              </p>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

// Giữ style thao tác hội thoại tại chỗ để shared button chỉ xử lý cấu trúc dùng chung.
const chatDrawerActionClass =
  "rounded-2xl border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-3.5 text-left hover:border-[#FF8A1F]/45 hover:bg-[#FFF7ED] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#334155] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#132039]";

const chatDrawerActionIconClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#334155] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]";

function StatusPill({
  dangerous,
  flagged,
  label,
}: {
  dangerous: boolean;
  flagged: boolean;
  label: string;
}) {
  const toneClass = dangerous
    ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]"
    : flagged
      ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
      : "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]";

  return (
    <span
      className={[
        "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-extrabold",
        toneClass,
      ].join(" ")}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

