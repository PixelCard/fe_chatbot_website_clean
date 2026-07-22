"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import type { RepairSessionFilterState } from "../../hooks/useRepairSessionFilters";
import {
  RepairSessionAdvancedFilters,
  RepairSessionSearchField,
  RepairSessionStatusSelect,
} from "./RepairSessionFilterFields";

export function RepairSessionMobileFilterSheet({
  open,
  filters,
  deviceTypes,
  searchDraft,
  onSearchDraftChange,
  onPatch,
  onReset,
  onApply,
  onClose,
}: {
  open: boolean;
  filters: RepairSessionFilterState;
  deviceTypes: string[];
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  onPatch: (patch: Partial<RepairSessionFilterState>) => void;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[9999] sm:hidden">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            aria-label="Đóng bộ lọc"
            onClick={onClose}
            className="absolute inset-0 bg-[#020817]/70 backdrop-blur-sm"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Bộ lọc ca sửa chữa"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="admin-card absolute inset-x-0 bottom-0 z-10 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-3xl"
          >
            <header className="flex items-center justify-between border-b border-[var(--admin-soft-panel-border)] px-4 py-4">
              <h2 className="text-base font-semibold text-[var(--admin-strong-text)]">
                Tìm kiếm và lọc
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--admin-strong-text)] hover:bg-[var(--admin-control-hover-bg)]"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              <RepairSessionSearchField
                value={searchDraft}
                onChange={onSearchDraftChange}
                onSubmit={onApply}
                placeholder="Tìm mã ca, khách, SĐT..."
              />
              <RepairSessionStatusSelect
                value={filters.status}
                onChange={(status) => onPatch({ status })}
              />
              <RepairSessionAdvancedFilters
                filters={filters}
                deviceTypes={deviceTypes}
                onPatch={onPatch}
              />
            </div>

            <footer className="grid grid-cols-2 gap-3 border-t border-[var(--admin-soft-panel-border)] p-4">
              <button
                type="button"
                onClick={onReset}
                className="h-11 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-sm font-semibold text-[var(--admin-strong-text)]"
              >
                Xóa lọc
              </button>
              <button
                type="button"
                onClick={onApply}
                className="h-11 rounded-xl bg-[image:var(--admin-cta-bg)] text-sm font-semibold text-[var(--admin-cta-text)]"
              >
                Áp dụng
              </button>
            </footer>
          </motion.section>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
