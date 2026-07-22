"use client";

import type { StatusFilter } from "../../types/account.types";
import { STATUS_FILTER_OPTIONS } from "../../constants/account.constants";

type Props = {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
};

export default function AccountStatusFilter({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="account-status-filter"
        className="text-sm font-semibold text-[#D1D5DB]"
      >
        Trạng thái
      </label>

      <select
        id="account-status-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as StatusFilter)}
        className="h-11 w-full rounded-2xl border border-[#1E2A3F] bg-[#07111F] px-3 text-base font-medium text-white outline-none transition hover:border-[#334155] focus:border-[#06B6D4]/70 focus:ring-2 focus:ring-[#06B6D4]/25"
      >
        {STATUS_FILTER_OPTIONS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}