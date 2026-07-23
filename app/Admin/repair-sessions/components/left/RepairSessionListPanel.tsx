"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Pagination } from "@/app/components/Pagination";

import type { RepairSession } from "../../types/repairSession.types";
import { RepairSessionListItem } from "./RepairSessionListItem";

const ITEMS_PER_PAGE = 8;

export function RepairSessionListPanel({
  sessions,
  selectedSessionId,
  onSelectSession,
}: {
  sessions: RepairSession[];
  selectedSessionId: string | null;
  onSelectSession: (session: RepairSession) => void;
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const visibleSessions = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi-VN");
    if (!keyword) return sessions;

    return sessions.filter((session) =>
      [
        session.id,
        session.deviceType,
        session.customer.fullName,
        session.symptom,
      ].some((value) =>
        (value ?? "").toLocaleLowerCase("vi-VN").includes(keyword),
      ),
    );
  }, [search, sessions]);

  const totalPages = Math.max(
    1,
    Math.ceil(visibleSessions.length / ITEMS_PER_PAGE),
  );
  const effectivePage = Math.min(currentPage, totalPages);
  const paginatedSessions = visibleSessions.slice(
    (effectivePage - 1) * ITEMS_PER_PAGE,
    effectivePage * ITEMS_PER_PAGE,
  );

  return (
    <aside className="flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] xl:min-h-0">
      <header className="shrink-0 border-b border-[var(--admin-soft-panel-border)] px-4 py-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              Hàng đợi ca
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
              {visibleSessions.length} ca phù hợp
            </p>
          </div>

          <span className="inline-flex min-h-8 shrink-0 items-center rounded-full border border-[#FF8A1F]/30 bg-[#FF8A1F]/10 px-3 text-xs font-semibold text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
            {visibleSessions.length} ca
          </span>
        </div>

        <label className="relative mt-3 block">
          <span className="sr-only">Tìm trong danh sách ca</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-subtle-text)]" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm mã ca, khách, thiết bị"
            className="h-10 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] pl-9 pr-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]"
          />
        </label>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {paginatedSessions.length > 0 ? (
          <div className="space-y-2">
            {paginatedSessions.map((session) => (
              <RepairSessionListItem
                key={session.id}
                session={session}
                active={selectedSessionId === session.id}
                onClick={() => onSelectSession(session)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 text-center [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
            <div>
              <p className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                Không có ca phù hợp
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                Thử đổi từ khóa hoặc bộ lọc.
              </p>
            </div>
          </div>
        )}
      </div>

      {visibleSessions.length > 0 ? (
        <footer className="shrink-0 border-t border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-3 py-2.5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
          <p className="text-center text-xs font-medium text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
            Trang {effectivePage}/{totalPages} · Hiển thị {paginatedSessions.length}/{visibleSessions.length}
          </p>
          <Pagination
            currentPage={effectivePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            compact
          />
        </footer>
      ) : null}
    </aside>
  );
}
