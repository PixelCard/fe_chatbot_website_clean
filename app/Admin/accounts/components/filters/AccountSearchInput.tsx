"use client";

import { Search, X } from "lucide-react";

import { ACCOUNT_SEARCH_TYPE_OPTIONS } from "../../constants/account.constants";
import type { AccountSearchType } from "../../types/account.types";

type Props = {
  value: string;
  searchType: AccountSearchType;
  onChange: (value: string) => void;
  onSearchTypeChange: (value: AccountSearchType) => void;
  placeholder?: string;
};

export default function AccountSearchInput({
  value,
  searchType,
  onChange,
  onSearchTypeChange,
  placeholder = "Nhập từ khóa tìm kiếm...",
}: Props) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="space-y-2">
      <label
        htmlFor="account-search"
        className="text-sm font-semibold text-[#D1D5DB]"
      >
        Tìm kiếm
      </label>

      <div className="overflow-hidden rounded-2xl border border-[#1E2A3F] bg-[#07111F] transition hover:border-[#334155] focus-within:border-[#06B6D4]/70 focus-within:ring-2 focus-within:ring-[#06B6D4]/25">
        <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)]">
          <select
            id="account-search-type"
            value={searchType}
            onChange={(event) =>
              onSearchTypeChange(event.target.value as AccountSearchType)
            }
            aria-label="Chọn kiểu tìm kiếm"
            className="h-11 w-full border-b border-[#1E2A3F] bg-[#0B1424] px-3 text-sm font-semibold text-white outline-none sm:border-b-0 sm:border-r"
          >
            {ACCOUNT_SEARCH_TYPE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />

            <input
              id="account-search"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              className="h-11 w-full bg-transparent pl-10 pr-10 text-base font-medium text-white outline-none placeholder:text-[#64748B]"
            />

            {hasValue ? (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Xóa từ khóa tìm kiếm"
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[#64748B] transition hover:bg-[#101B2E] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}