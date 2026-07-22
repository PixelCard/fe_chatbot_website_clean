"use client";

import { useCallback, useEffect, useState } from "react";
import { quoteAdminService, type QuoteListQuery } from "../services";
import type { QuoteItem } from "../types/quote.types";

export function useQuotesApi(query?: QuoteListQuery) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextItems = await quoteAdminService.getQuotes(query);
      setItems(nextItems);
    } catch (nextError) {
      const normalized =
        nextError instanceof Error
          ? nextError
          : new Error("Không thể tải danh sách báo giá.");
      setError(normalized);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    items,
    isLoading,
    error,
    refetch: load,
  };
}
