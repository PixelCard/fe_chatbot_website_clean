"use client";

import { Home, Info, Menu, Sparkles } from "lucide-react";

type ChatTopbarProps = {
  sessionId: number | null;
  currentDeviceLabel: string;
  onOpenSidebar: () => void;
  onOpenDiagnostic: () => void;
  onGoHome: () => void;
};

export function ChatTopbar({
  sessionId,
  currentDeviceLabel,
  onOpenSidebar,
  onOpenDiagnostic,
  onGoHome,
}: ChatTopbarProps) {
  return (
    <header className="client-header-surface relative flex h-[60px] shrink-0 items-center justify-between gap-2 px-3 transition-colors sm:h-[64px] sm:px-4 md:h-[68px] md:px-5">
      <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-300/65 to-transparent dark:via-blue-400/35 sm:inset-x-6" />

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Mở lịch sử chat"
          className="client-control-button flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] sm:h-10 sm:w-10 sm:rounded-[14px] lg:hidden"
        >
          <Menu className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="client-accent-soft inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] sm:h-9 sm:w-9 sm:rounded-[14px]">
              <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </span>

            <p className="truncate text-[15px] font-black text-[var(--client-text-primary)] sm:text-[17px] md:text-[18px]">
              Phiên tư vấn AI
            </p>

            <span className="hidden rounded-full border border-orange-100 bg-white/76 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-orange-600 shadow-sm dark:border-blue-500/25 dark:bg-slate-900/64 dark:text-blue-300 sm:inline-flex">
              SmartElec
            </span>
          </div>

          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 overflow-hidden text-[10px] font-semibold text-[var(--client-text-secondary)] sm:mt-1 sm:gap-2 sm:text-[12px]">
            <span>{sessionId ? `Session #${sessionId}` : "Chưa tạo phiên"}</span>

            <span className="h-1 w-1 rounded-full bg-[var(--client-text-muted)]" />

            <span className="min-w-0 truncate">
              Thiết bị: {currentDeviceLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenDiagnostic}
          className="client-control-button flex h-9 w-9 items-center justify-center gap-2 rounded-[12px] px-0 text-[13px] font-black sm:h-10 sm:w-auto sm:rounded-[14px] sm:px-3 sm:text-[14px] xl:hidden"
        >
          <Info className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Tóm tắt</span>
        </button>

        <button
          type="button"
          onClick={onGoHome}
          aria-label="Về trang chủ"
          className="client-control-button flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] sm:h-10 sm:w-10 sm:rounded-[14px]"
        >
          <Home className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </button>
      </div>
    </header>
  );
}