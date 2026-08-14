"use client";

import { ActionButton } from "@/app/components/common/action-button/ActionButton";
import { motion } from "framer-motion";
import { Info, MessageSquare, Phone, ShieldAlert, Wrench } from "lucide-react";

import type { ChatSession } from "../../types/chat.types";
import { MessageBubble } from "./MessageBubble";

type Props = {
  session: ChatSession | null;
  onOpenDrawer: () => void;
};

export function ChatThreadPanel({ session, onOpenDrawer }: Props) {
  if (!session) {
    return (
      <section className="admin-card flex h-full min-h-0 flex-col items-center justify-center rounded-2xl p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/70 bg-cyan-50 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300">
          <MessageSquare className="h-7 w-7" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-[var(--admin-strong-text)]">
          Chọn một phiên chat
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--admin-muted-text)]">
          Chọn phiên hội thoại bên trái để xem nội dung chat, trạng thái cảnh báo
          và thao tác can thiệp.
        </p>
      </section>
    );
  }

  return (
    <motion.section
      key={session.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="admin-card flex h-full min-h-0 flex-col overflow-hidden rounded-2xl shadow-[0_22px_50px_-40px_rgba(15,23,42,0.26)]"
    >
      <header className="shrink-0 border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 py-3.5 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-black",
                session.isDangerous
                  ? "border-rose-300/80 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300"
                  : session.isFlagged
                    ? "border-amber-300/80 bg-amber-50 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300"
                    : "border-cyan-300/80 bg-cyan-50 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300",
              ].join(" ")}
            >
              {session.customerName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-bold text-[var(--admin-strong-text)] sm:text-lg">
                  {session.customerName}
                </h2>

                <span className="rounded-lg border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-2 py-0.5 font-mono text-[11px] font-bold text-[var(--admin-muted-text)]">
                  {session.id}
                </span>

                <span className="rounded-lg border border-cyan-500/35 bg-cyan-500/15 px-2 py-0.5 text-[11px] font-bold text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300">
                  {session.messages.length} tin nhắn
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-[var(--admin-muted-text)]">
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {session.customerPhone}
                </span>

                {session.technicianName ? (
                  <span className="inline-flex items-center gap-1 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300">
                    <Wrench className="h-3.5 w-3.5" />
                    {session.technicianName}
                  </span>
                ) : (
                  <span className="text-[var(--admin-subtle-text)]">Chưa có thợ</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDrawer}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#06B6D4]/35 bg-[#06B6D4]/10 px-3.5 text-xs font-black text-[#0891B2] transition hover:bg-[#06B6D4]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
          >
            <Info className="h-4 w-4" />
            Can thiệp
          </button>
        </div>

        {(session.isDangerous || session.isFlagged) && (
          <div className="mt-3 rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300" />
              <p className="text-sm leading-6 text-amber-800 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-200">
                {session.flagReason ||
                  "Phiên chat đang có dấu hiệu bất thường, cần theo dõi."}
              </p>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto bg-[var(--admin-control-bg)] px-3 py-4 sm:px-5">
        {session.messages.length > 0 ? (
          <div className="flex flex-col gap-4">
            {session.messages.map((message) => {
              if (message.senderType === "SYSTEM") {
                return (
                  <SystemMessage
                    key={message.id}
                    content={message.content}
                    createdAt={message.createdAt}
                  />
                );
              }

              return <MessageBubble key={message.id} message={message} />;
            })}
          </div>
        ) : (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center p-6 text-center text-sm text-[var(--admin-muted-text)]">
            Chưa có lịch sử tin nhắn ghi nhận trong phiên này.
          </div>
        )}
      </div>
    </motion.section>
  );
}

function SystemMessage({
  content,
  createdAt,
}: {
  content: string;
  createdAt: string;
}) {
  return (
    <div className="flex justify-center">
      <div className="max-w-[90%] rounded-full border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-3 py-1.5 text-center text-[11px] font-semibold leading-5 text-[var(--admin-muted-text)]">
        <span>{content}</span>
        <span className="mx-1.5 text-[var(--admin-divider-text)]">•</span>
        <span>{formatMessageTime(createdAt)}</span>
      </div>
    </div>
  );
}

function formatMessageTime(value: string) {
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
