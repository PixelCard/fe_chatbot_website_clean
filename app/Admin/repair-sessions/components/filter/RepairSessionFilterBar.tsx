"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";

import type { RepairSessionFilterState } from "../../hooks/useRepairSessionFilters";
import type { RepairSession } from "../../types/repairSession.types";
import {
  RepairSessionAdvancedFilters,
  RepairSessionSearchField,
  RepairSessionStatusSelect,
} from "./RepairSessionFilterFields";
import { RepairSessionMobileFilterSheet } from "./RepairSessionMobileFilterSheet";

type RepairSessionFilterBarProps = {
  filters: RepairSessionFilterState;
  onChange: (next: RepairSessionFilterState) => void;
  onReset: () => void;
  sessions: RepairSession[];
};

export function RepairSessionFilterBar({
  filters,
  onChange,
  onReset,
  sessions,
}: RepairSessionFilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState(filters.search);

  useEffect(() => setSearchDraft(filters.search), [filters.search]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const deviceTypes = useMemo(
    () =>
      Array.from(
        new Set(sessions.map((session) => session.deviceType).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "vi")),
    [sessions],
  );

  const patchFilters = (patch: Partial<RepairSessionFilterState>) => {
    onChange({ ...filters, ...patch });
  };

  const applySearch = () => patchFilters({ search: searchDraft.trim() });

  const resetFilters = () => {
    setSearchDraft("");
    onReset();
  };

  const setDatePreset = (
    datePreset: RepairSessionFilterState["datePreset"],
  ) => {
    patchFilters({
      datePreset,
      createdDate: "",
      updatedDate: "",
      search: searchDraft.trim(),
    });
  };

  return (
    <>
      <section className="admin-card hidden rounded-2xl p-4 sm:block">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 xl:max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EA580C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
              Ca sửa chữa / Điều phối
            </p>
            <h1 className="mt-2 text-lg font-semibold text-[var(--admin-strong-text)]">
              Quản lý hàng đợi và trạng thái xử lý
            </h1>
            <p className="mt-1 text-sm font-medium leading-6 text-[var(--admin-theme-text)]">
              Tìm nhanh ca cần gán thợ, thiếu liên hệ hoặc cần can thiệp.
            </p>
          </div>

          <div className="grid min-w-0 gap-3 xl:min-w-[560px] xl:max-w-[720px] xl:flex-1">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px_auto]">
              <RepairSessionSearchField
                value={searchDraft}
                onChange={setSearchDraft}
                onSubmit={applySearch}
              />
              <RepairSessionStatusSelect
                value={filters.status}
                onChange={(status) => patchFilters({ status })}
              />
              <button
                type="button"
                onClick={applySearch}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-5 text-sm font-semibold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]"
              >
                <Search className="h-4 w-4" />
                Tìm
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <QuickFilterButton
                active={filters.datePreset === "TODAY"}
                onClick={() => setDatePreset("TODAY")}
              >
                Hôm nay
              </QuickFilterButton>
              <QuickFilterButton
                active={filters.datePreset === "LAST_7_DAYS"}
                onClick={() => setDatePreset("LAST_7_DAYS")}
              >
                7 ngày
              </QuickFilterButton>

              <button
                type="button"
                onClick={() => setAdvancedOpen((current) => !current)}
                aria-expanded={advancedOpen}
                className={[
                  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]",
                  advancedOpen
                    ? "border-[#06B6D4]/45 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                    : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
                ].join(" ")}
              >
                <Filter className="h-4 w-4" />
                Lọc nâng cao
                {advancedOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 text-sm font-semibold text-[var(--admin-strong-text)] transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-rose-300"
              >
                <RotateCcw className="h-4 w-4" />
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {advancedOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-[var(--admin-soft-panel-border)] pt-4">
                <RepairSessionAdvancedFilters
                  filters={filters}
                  deviceTypes={deviceTypes}
                  onPatch={patchFilters}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 text-sm font-semibold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] sm:hidden"
      >
        <Filter className="h-4 w-4" />
        Tìm kiếm và lọc ca
      </button>

      <RepairSessionMobileFilterSheet
        open={mobileOpen}
        filters={filters}
        deviceTypes={deviceTypes}
        searchDraft={searchDraft}
        onSearchDraftChange={setSearchDraft}
        onPatch={patchFilters}
        onReset={resetFilters}
        onApply={() => {
          applySearch();
          setMobileOpen(false);
        }}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}

function QuickFilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition",
        active
          ? "border-[#FF8A1F]/40 bg-[#FF8A1F]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
          : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] text-[var(--admin-theme-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
