"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, History, LayoutList } from "lucide-react";

import type { RepairSession } from "../../types/repairSession.types";
import { getStuckDuration } from "../../utils/repairSessionRules";
import {
  RepairSessionDangerBadge,
  RepairSessionStatusBadge,
  RepairSessionStuckBadge,
} from "../common/RepairSessionBadges";
import { RepairSessionEmptyState } from "../common/RepairSessionUi";
import { RepairSessionHistory } from "./RepairSessionHistory";
import { RepairSessionOverview } from "./RepairSessionOverview";
import {
  createRepairSessionDetailView,
  type DetailTab,
} from "./repairSessionDetail.utils";

const DETAIL_TABS: Array<{
  key: DetailTab;
  label: string;
  icon: typeof LayoutList;
}> = [
  { key: "overview", label: "Tổng quan", icon: LayoutList },
  { key: "ai", label: "AI tư vấn", icon: Bot },
  { key: "history", label: "Lịch sử", icon: History },
];

export function RepairSessionDetailPanel({
  session,
  onOpenDispatch,
}: {
  session: RepairSession | null;
  onOpenDispatch: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  useEffect(() => {
    setActiveTab("overview");
  }, [session?.id]);

  const view = useMemo(
    () => (session ? createRepairSessionDetailView(session) : null),
    [session],
  );

  if (!session || !view) {
    return (
      <section className="flex min-h-[360px] min-w-0 items-center justify-center rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] p-6 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] xl:min-h-0">
        <RepairSessionEmptyState
          title="Chưa chọn ca sửa chữa"
          description="Chọn một ca từ danh sách bên trái để xem thông tin và thao tác điều phối."
        />
      </section>
    );
  }

  return (
    <section className="flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] xl:min-h-0">
      <header className="shrink-0 border-b border-[var(--admin-soft-panel-border)] px-4 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EA580C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
                Hồ sơ ca đang chọn
              </p>
              <RepairSessionStatusBadge status={session.status} />
              <RepairSessionDangerBadge isDangerous={session.isDangerous} />
              <RepairSessionStuckBadge duration={getStuckDuration(session)} />
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              #{session.id} · {session.deviceType || "Thiết bị chưa xác định"}
            </h2>

            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
              <span>{session.customer.fullName || "Khách chưa xác định"}</span>
              <span aria-hidden="true">·</span>
              <span>
                {view.hasTechnician
                  ? session.technician?.fullName || "Đã gán thợ"
                  : "Chưa có thợ"}
              </span>
              <span aria-hidden="true">·</span>
              <span>Cập nhật {view.updatedTime}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenDispatch}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-[#FF8A1F]/35 bg-[#FF8A1F]/10 px-4 text-sm font-semibold text-[#C2410C] transition hover:border-[#FF8A1F]/55 hover:bg-[#FF8A1F]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
          >
            Mở điều phối
          </button>
        </div>
      </header>

      <nav
        aria-label="Nội dung chi tiết ca"
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--admin-soft-panel-border)] px-3 py-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] sm:px-4"
      >
        {DETAIL_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              aria-current={active ? "page" : undefined}
              className={[
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]",
                active
                  ? "bg-[#FF8A1F]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                  : "text-[var(--admin-theme-text)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        {activeTab === "overview" ? (
          <RepairSessionOverview
            session={session}
            view={view}
            onOpenAi={() => setActiveTab("ai")}
          />
        ) : null}

        {activeTab === "ai" ? (
          <section className="rounded-2xl border border-[#06B6D4]/20 bg-[#06B6D4]/10 p-4 sm:p-5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#0E7490] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#67E8F9]" />
              <h3 className="text-base font-semibold text-[#0E7490] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#67E8F9]">
                Nội dung AI tư vấn
              </h3>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm font-medium leading-7 text-[#155E75] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CFFAFE]">
              {session.aiSummary || "Chưa có khuyến nghị AI cho ca này."}
            </p>
          </section>
        ) : null}

        {activeTab === "history" ? (
          <RepairSessionHistory session={session} />
        ) : null}
      </div>
    </section>
  );
}
