import { useMemo, useState } from "react";
import {
  ChevronDown,
  Clock,
  Laptop,
  MessageSquareText,
  Plus,
  Radio,
  Search,
  Sparkles,
  Tv,
  UserRound,
  Wrench,
  X,
  Zap,
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
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function getHistoryTitle(item: ChatHistoryItem) {
  return item.deviceType?.trim() || "Phiên chẩn đoán";
}

function getDeviceIcon(deviceType?: string) {
  const name = (deviceType || "").toLowerCase();
  if (name.includes("laptop") || name.includes("máy tính")) return Laptop;
  if (name.includes("điều hòa") || name.includes("máy lạnh")) return Radio;
  if (name.includes("lò vi sóng") || name.includes("bếp")) return Zap;
  if (name.includes("tivi") || name.includes("tv")) return Tv;
  if (name.includes("sửa") || name.includes("bảo dưỡng")) return Wrench;
  return MessageSquareText;
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistoryItems = useMemo(() => {
    if (!searchQuery.trim()) return historyItems;

    const query = searchQuery.toLowerCase().trim();

    return historyItems.filter(
      (item) =>
        getHistoryTitle(item).toLowerCase().includes(query) ||
        String(item.id).includes(query) ||
        (item.createdAt && item.createdAt.toLowerCase().includes(query)),
    );
  }, [historyItems, searchQuery]);

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
            className="group flex h-11 flex-1 items-center justify-center gap-2.5 rounded-[16px] border border-orange-200/80 bg-gradient-to-r from-white via-orange-50/50 to-amber-50/40 px-4 text-[14px] font-black text-slate-900 shadow-[0_12px_28px_rgba(255,138,31,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_16px_34px_rgba(255,138,31,0.18)] active:scale-[0.98] dark:border-blue-500/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/80 dark:text-white dark:shadow-[0_14px_34px_rgba(0,0,0,0.25)] dark:hover:border-cyan-400/50"
          >
            <span className="client-accent-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-md">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
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
          <div className="relative flex h-10 items-center rounded-[14px] border border-[var(--client-card-border)] bg-white/84 px-3 text-[13px] font-semibold text-[var(--client-text-primary)] shadow-sm focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 dark:bg-slate-900/70 dark:focus-within:border-cyan-400 dark:focus-within:ring-cyan-400/20">
            <Search className="h-4 w-4 shrink-0 text-[var(--client-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm kiếm lịch sử..."
              className="w-full bg-transparent px-2 text-[13px] font-semibold text-[var(--client-text-primary)] placeholder-[var(--client-text-muted)] outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3.5 py-3.5">
          <div className="mb-3 flex items-center justify-between px-1.5">
            <div className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-[0.14em] text-[var(--client-text-muted)]">
              <span>GẦN ĐÂY</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>

            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-200/60 bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600 shadow-sm dark:border-cyan-500/30 dark:from-cyan-950 dark:to-slate-900 dark:text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className={[
                "group relative w-full overflow-hidden rounded-[20px] border p-3.5 text-left transition-all duration-200",
                sessionId
                  ? "border-orange-400/80 bg-gradient-to-br from-orange-50/90 via-white to-amber-50/40 shadow-[0_12px_28px_rgba(255,138,31,0.14)] dark:border-cyan-400/60 dark:from-slate-900 dark:via-slate-900/95 dark:to-cyan-950/30 dark:shadow-[0_12px_28px_rgba(0,0,0,0.30)]"
                  : "border-transparent bg-transparent hover:border-orange-200 hover:bg-white/80 dark:hover:border-slate-700 dark:hover:bg-slate-900/60",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-orange-200/80 bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-sm dark:border-cyan-400/50 dark:from-cyan-500 dark:to-blue-600">
                  <MessageSquareText className="h-4 w-4" strokeWidth={2.3} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="truncate text-[13.5px] font-black text-[var(--client-text-primary)]">
                      {sessionId ? `Phiên hiện tại #${sessionId}` : "Phiên mới"}
                    </p>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Đang xử lý
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-1 text-[12px] font-bold text-[var(--client-text-muted)]">
                    Thiết bị: <span className="text-[var(--client-text-primary)]">{currentDeviceLabel}</span>
                  </p>
                </div>
              </div>
            </button>

            {isHistoryLoading ? (
              <div className="space-y-2 px-1 py-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`history-skeleton-${index}`}
                    className="h-[64px] animate-pulse rounded-[20px] border border-[var(--client-card-border)] bg-white/65 dark:bg-slate-900/55"
                  />
                ))}
              </div>
            ) : filteredHistoryItems.length ? (
              filteredHistoryItems.map((item) => {
                const isActive = item.id === sessionId;
                const DeviceIcon = getDeviceIcon(item.deviceType);

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isSelectingSession}
                    onClick={() => onSelectSession(item)}
                    className={[
                      "group w-full rounded-[20px] border p-3.5 text-left transition-all duration-200 disabled:cursor-wait disabled:opacity-70",
                      isActive
                        ? "border-orange-400/80 bg-gradient-to-br from-orange-50/90 via-white to-amber-50/40 shadow-[0_12px_28px_rgba(255,138,31,0.14)] dark:border-cyan-400/60 dark:from-slate-900 dark:via-slate-900/95 dark:to-cyan-950/30"
                        : "border-[var(--client-card-border)] bg-white/60 hover:-translate-y-0.5 hover:border-orange-200/90 hover:bg-white hover:shadow-[0_10px_24px_rgba(255,138,31,0.08)] dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/80 dark:hover:shadow-[0_10px_24px_rgba(0,0,0,0.22)]",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-orange-100 bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-cyan-300 dark:group-hover:bg-slate-800">
                        <DeviceIcon className="h-4 w-4" strokeWidth={2.2} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-black text-[var(--client-text-primary)]">
                          {getHistoryTitle(item)}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[var(--client-text-muted)]">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {formatHistoryTime(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : searchQuery ? (
              <div className="rounded-[20px] border border-dashed border-[var(--client-card-border)] bg-white/58 px-4 py-5 text-center text-xs font-semibold text-[var(--client-text-muted)] dark:bg-slate-900/42">
                Không tìm thấy hội thoại phù hợp với &quot;{searchQuery}&quot;
              </div>
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
            className="flex w-full items-center gap-3 rounded-[20px] border border-[var(--client-card-border)] bg-white/60 p-3 transition hover:border-orange-200 hover:bg-white hover:shadow-sm dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/70"
          >
            <div
              suppressHydrationWarning
              className="client-accent-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-black text-white shadow-sm"
            >
              {profileName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 text-left">
              <p
                suppressHydrationWarning
                className="truncate text-[14px] font-black text-[var(--client-text-primary)]"
              >
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
