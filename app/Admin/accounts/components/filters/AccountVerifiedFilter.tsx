"use client";

import type { VerifiedFilter } from "../../types/account.types";
import { VERIFIED_FILTER_OPTIONS } from "../../constants/account.constants";

type Props = {
  value: VerifiedFilter;
  onChange: (value: VerifiedFilter) => void;
};

export default function AccountVerifiedFilter({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="account-verified-filter"
        className="text-sm font-semibold text-[#D1D5DB]"
      >
        Xác minh
      </label>

      <select
        id="account-verified-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as VerifiedFilter)}
        className="h-11 w-full rounded-2xl border border-[#1E2A3F] bg-[#07111F] px-3 text-base font-medium text-white outline-none transition hover:border-[#334155] focus:border-[#06B6D4]/70 focus:ring-2 focus:ring-[#06B6D4]/25"
      >
        {VERIFIED_FILTER_OPTIONS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}