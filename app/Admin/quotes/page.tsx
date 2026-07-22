"use client";

import { useMemo, useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import QuoteActionDrawer from "./components/QuoteActionDrawer";
import { QuoteFilterBar } from "./components/QuoteFilterBar";
import QuoteMatrixTable from "./components/QuoteMatrixTable";
import { useQuotesApi } from "./hooks";
import type { QuoteListQuery } from "./services/quote.service";
import {
  defaultQuoteFilters,
  type QuoteFilterState,
  type QuoteItem,
} from "./types/quote.types";

export default function AdminQuotesPage() {
  const [filters, setFilters] = useState<QuoteFilterState>(defaultQuoteFilters);
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);

  const query = useMemo<QuoteListQuery>(
    () => ({
      keyword: filters.keyword.trim() || undefined,
      status: filters.status === "all" ? undefined : filters.status,
      address: filters.address.trim() || undefined,
      technicianName: filters.technicianName.trim() || undefined,
      minAmount: filters.minAmount ? Number(filters.minAmount) : undefined,
      maxAmount: filters.maxAmount ? Number(filters.maxAmount) : undefined,
      isOverdue: filters.isOverdue || undefined,
      isMismatch: filters.isMismatch || undefined,
    }),
    [filters],
  );

  const { items: quotes, isLoading, error, refetch } = useQuotesApi(query);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const keyword = filters.keyword.trim().toLowerCase();
      const matchesKeyword =
        !keyword ||
        quote.id.toLowerCase().includes(keyword) ||
        quote.sessionId.toLowerCase().includes(keyword) ||
        quote.customerName.toLowerCase().includes(keyword) ||
        quote.customerPhone.includes(filters.keyword);
      const matchesStatus =
        filters.status === "all" || quote.status === filters.status;
      const matchesAddress =
        !filters.address ||
        quote.address.toLowerCase().includes(filters.address.toLowerCase());
      const matchesTechnician =
        !filters.technicianName ||
        quote.technicianName
          .toLowerCase()
          .includes(filters.technicianName.toLowerCase());
      const minAmount = Number(filters.minAmount) || 0;
      const maxAmount = Number(filters.maxAmount) || Infinity;
      const matchesAmount =
        quote.totalAmount >= minAmount && quote.totalAmount <= maxAmount;
      const matchesOverdue =
        !filters.isOverdue || quote.isOverdueLv1 || quote.isOverdueLv2;
      const matchesMismatch =
        !filters.isMismatch || quote.isStateMismatch;

      return (
        matchesKeyword &&
        matchesStatus &&
        matchesAddress &&
        matchesTechnician &&
        matchesAmount &&
        matchesOverdue &&
        matchesMismatch
      );
    });
  }, [quotes, filters]);

  return (
    <AdminShell>
      <div className="space-y-5">
        <QuoteFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultQuoteFilters)}
        />

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-5">
            <p className="text-sm text-red-100">
              Không tải được danh sách báo giá: {error.message}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 h-10 rounded-lg border border-red-300/40 px-4 text-sm"
            >
              Thử lại
            </button>
          </section>
        ) : null}

        {isLoading ? (
          <section className="admin-card rounded-2xl p-4 text-sm text-[var(--admin-muted-text)]">
            Đang tải dữ liệu báo giá...
          </section>
        ) : null}

        <section className="min-h-0">
          <QuoteMatrixTable
            data={filteredQuotes}
            selectedId={selectedQuote?.id}
            onSelect={setSelectedQuote}
            onOpenAction={setSelectedQuote}
          />
        </section>
      </div>

      <QuoteActionDrawer
        open={Boolean(selectedQuote)}
        quote={selectedQuote}
        onClose={() => setSelectedQuote(null)}
      />
    </AdminShell>
  );
}
