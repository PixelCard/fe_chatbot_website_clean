"use client";

import {
  ChevronDown,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import type { ChatHistoryItem } from "@/app/services/common";

type ChatHistorySidebarProps = {
  isSidebarOpen: boolean;
  profileName: string;
  sessionId: number | null;
  currentDeviceLabel: string;
  historyItems: ChatHistoryItem[];
  isHistoryLoading: boolean;
  isSelectingSession?: boolean;
  onCloseSidebar: () => void;
  onNewChat: () => void;
  onSelectSession: (item: ChatHistoryItem) => void;
};

function formatHistoryTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getHistoryTitle(item: ChatHistoryItem) {
  return item.deviceType?.trim() || "Phiên chẩn đoán";
}

export function ChatHistorySidebar({
  isSidebarOpen,
  profileName,
  sessionId,
  currentDeviceLabel,
  historyItems,
  isHistoryLoading,
  isSelectingSession = false,
  onCloseSidebar,
  onNewChat,
  onSelectSession,
}: ChatHistorySidebarProps) {
  return (
    <>
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Đóng lịch sử hội thoại"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseSidebar}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[300px] shrink-0 flex-col border-r border-[var(--client-card-border)] bg-[var(--client-shell-soft-bg)] text-[var(--client-text-primary)] shadow-[0_30px_80px_rgba(255,138,31,0.10)] backdrop-blur-2xl transition-transform duration-300 dark:shadow-[0_30px_80px_rgba(0,0,0,0.28)] lg:relative lg:z-auto lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="relative flex h-[72px] shrink-0 items-center gap-3 border-b border-[var(--client-card-border)] px-4">
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent dark:via-blue-400/40" />
          <button
            type="button"
            onClick={onNewChat}
            className="group flex h-11 flex-1 items-center gap-3 rounded-[16px] border border-orange-100/90 bg-white/88 px-4 text-[14px] font-black text-slate-900 shadow-[0_12px_28px_rgba(255,138,31,0.10)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white hover:shadow-[0_16px_34px_rgba(255,138,31,0.14)] active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900/78 dark:text-white dark:shadow-[0_14px_34px_rgba(0,0,0,0.18)] dark:hover:border-blue-500/40 dark:hover:bg-slate-900"
          >
            <span className="client-accent-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm">
              <Plus className="h-4 w-4" />
            </span>
            Tạo hội thoại mới
          </button>

          <button
            type="button"
            aria-label="Đóng menu"
            onClick={onCloseSidebar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-[var(--client-text-muted)] transition hover:bg-[var(--client-control-hover-bg)] hover:text-[var(--client-text-primary)] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[var(--client-card-border)] px-4 py-3">
          <div className="flex h-10 items-center gap-3 rounded-[14px] border border-[var(--client-card-border)] bg-white/84 px-3 text-[13px] font-semibold text-[var(--client-text-muted)] shadow-[0_10px_24px_rgba(255,138,31,0.06)] dark:bg-slate-900/70 dark:shadow-none">
            <Search className="h-4 w-4 shrink-0" />
            <span className="truncate">Tìm kiếm lịch sử</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="mb-2.5 flex items-center justify-between px-2">
            <div className="flex items-center gap-1 text-[13px] font-black uppercase tracking-[0.12em] text-[var(--client-text-muted)]">
              <span>Gần đây</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            <span className="client-accent-soft inline-flex h-7 w-7 items-center justify-center rounded-full">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              className={[
                "w-full rounded-[18px] border px-3 py-2.5 text-left transition",
                sessionId
                  ? "border-orange-200/90 bg-white shadow-[0_14px_32px_rgba(255,138,31,0.10)] dark:border-blue-500/30 dark:bg-slate-900/82 dark:shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
                  : "border-transparent bg-transparent hover:border-orange-100 hover:bg-white/82 hover:shadow-[0_12px_28px_rgba(255,138,31,0.08)] dark:hover:border-slate-700 dark:hover:bg-slate-900/62 dark:hover:shadow-none",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className="client-accent-soft mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px]">
                  <MessageSquareText className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-black text-[var(--client-text-primary)]">
                    {sessionId ? `Phiên hiện tại #${sessionId}` : "Phiên mới"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[var(--client-text-secondary)]">
                    Thiết bị: {currentDeviceLabel}
                  </p>
                </div>
              </div>
            </button>

            {isHistoryLoading ? (
              <div className="space-y-2 px-1 py-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`history-skeleton-${index}`}
                    className="h-[56px] animate-pulse rounded-[18px] border border-[var(--client-card-border)] bg-white/65 dark:bg-slate-900/55"
                  />
                ))}
              </div>
            ) : historyItems.length ? (
              historyItems.map((item) => {
                const isActive = item.id === sessionId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isSelectingSession}
                    onClick={() => onSelectSession(item)}
                    className={[
                        "w-full rounded-[18px] border px-3 py-2.5 text-left transition disabled:cursor-wait disabled:opacity-70",
                      isActive
                        ? "border-orange-200/90 bg-white shadow-[0_14px_32px_rgba(255,138,31,0.10)] dark:border-blue-500/30 dark:bg-slate-900/82 dark:shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
                        : "border-transparent bg-transparent hover:border-orange-100 hover:bg-white/82 hover:shadow-[0_12px_28px_rgba(255,138,31,0.08)] dark:hover:border-slate-700 dark:hover:bg-slate-900/62 dark:hover:shadow-none",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                        <div className="client-accent-soft mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px]">
                        <MessageSquareText className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-black text-[var(--client-text-primary)]">
                          {getHistoryTitle(item)}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-[var(--client-text-muted)]">
                          {formatHistoryTime(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[20px] border border-dashed border-[var(--client-card-border)] bg-white/58 px-4 py-5 text-sm font-semibold text-[var(--client-text-muted)] dark:bg-slate-900/42">
                Chưa có lịch sử hội thoại nào để hiển thị.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--client-card-border)] p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-[18px] border border-transparent bg-white/35 px-3 py-3 transition hover:border-orange-100 hover:bg-white/78 dark:bg-slate-900/28 dark:hover:border-slate-700 dark:hover:bg-slate-900/66"
          >
            <div className="client-accent-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-black text-white shadow-sm">
              {profileName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 text-left">
              <p className="truncate text-[14px] font-black text-[var(--client-text-primary)]">
                {profileName}
              </p>

              <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--client-text-muted)]">
                <UserRound className="h-3.5 w-3.5" />
                Thành viên
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
