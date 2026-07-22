"use client";

import { Pagination } from "@/app/components/Pagination";
import { AlertCircle, MessageSquare, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { ChatSession } from "../../types/chat.types";
import { ChatSessionRow } from "./ChatSessionRow";

const ITEMS_PER_PAGE = 8;

type Props = {
  sessions: ChatSession[];
  selectedId: string | null;
  onSelect: (session: ChatSession) => void;
  showFlaggedOnly: boolean;
};

export function SessionListPanel({
  sessions,
  selectedId,
  onSelect,
  showFlaggedOnly,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "DANGEROUS">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const matchesSearch =
          session.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.customerPhone.includes(searchTerm);

        const matchesFlagged = showFlaggedOnly ? session.isFlagged : true;
        const matchesStatus =
          activeFilter === "DANGEROUS" ? session.isDangerous : true;

        return matchesSearch && matchesFlagged && matchesStatus;
      }),
    [activeFilter, searchTerm, sessions, showFlaggedOnly],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / ITEMS_PER_PAGE),
  );
  const effectivePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedSessions = filteredSessions.slice(
    (effectivePage - 1) * ITEMS_PER_PAGE,
    effectivePage * ITEMS_PER_PAGE,
  );

  return (
    <aside className="admin-card flex h-[min(78vh,44rem)] min-h-0 flex-col overflow-hidden rounded-2xl shadow-[0_20px_45px_-35px_rgba(15,23,42,0.22)] xl:h-full">
      <div className="shrink-0 space-y-3 border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
            <MessageSquare size={16} />
            Hội thoại vận hành
          </h2>

          <span className="inline-flex min-w-9 items-center justify-center rounded-lg border border-cyan-300/70 bg-cyan-50 px-2 py-1 text-xs font-bold text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300">
            {filteredSessions.length}
          </span>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted-text)]"
            size={14}
          />
          <input
            type="text"
            placeholder="Tìm mã ca, khách hàng, SĐT..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] pl-9 pr-4 text-sm font-semibold text-[var(--admin-strong-text)] outline-none transition-colors duration-150 placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
          />
        </div>

        <div className="flex gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => {
              setActiveFilter("ALL");
              setCurrentPage(1);
            }}
            className={[
              "flex h-8 flex-1 items-center justify-center rounded-lg border text-xs font-bold transition-colors duration-150",
              activeFilter === "ALL"
                ? "border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]"
                : "border-transparent bg-transparent text-[var(--admin-muted-text)] hover:border-[var(--admin-soft-panel-border)] hover:bg-[var(--admin-soft-panel)] hover:text-[var(--admin-strong-text)]",
            ].join(" ")}
          >
            Tất cả
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilter("DANGEROUS");
              setCurrentPage(1);
            }}
            className={[
              "flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border text-xs font-bold transition-colors duration-150",
              activeFilter === "DANGEROUS"
                ? "border-rose-300/80 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300"
                : "border-transparent bg-transparent text-[var(--admin-muted-text)] hover:text-rose-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-rose-300",
            ].join(" ")}
          >
            <AlertCircle size={12} />
            Nguy hiểm
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]">
        {paginatedSessions.length > 0 ? (
          <div className="divide-y divide-[var(--admin-row-border)] px-2 py-2.5">
            {paginatedSessions.map((session) => (
              <ChatSessionRow
                key={session.id}
                session={session}
                isActive={selectedId === session.id}
                onSelect={() => onSelect(session)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 pt-12 text-center text-sm font-medium italic text-[var(--admin-muted-text)]">
            Không tìm thấy ca hội thoại phù hợp.
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-3 py-3">
        <div className="text-center text-xs font-medium text-[var(--admin-subtle-text)]">
          Trang {effectivePage}/{totalPages} • Hiển thị {paginatedSessions.length}{" "}
          / {filteredSessions.length} phiên
        </div>
        <Pagination
          currentPage={effectivePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          compact
        />
      </div>
    </aside>
  );
}
