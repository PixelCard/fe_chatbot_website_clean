"use client";

import { Plus, RotateCcw, Search, Sparkles } from "lucide-react";
import type {
  EmbeddingStatus,
  TechnicalDocumentFilterState,
} from "../../types/technicalDocument.types";

interface Props {
  filters: TechnicalDocumentFilterState;
  categories: string[];
  sources: string[];
  onChange: (next: TechnicalDocumentFilterState) => void;
  onReset: () => void;
  onCreate: () => void;
  onCreateAiCoverage: () => void;
}

export function TechnicalDocumentFilterBar({
  filters,
  categories,
  sources,
  onChange,
  onReset,
  onCreate,
  onCreateAiCoverage,
}: Props) {
  return (
    <section className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-4">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_auto_auto_auto]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />

          <input
            value={filters.keyword}
            onChange={(event) =>
              onChange({ ...filters, keyword: event.target.value })
            }
            placeholder="Tìm tên tài liệu, nội dung, loại thiết bị, nguồn..."
            className={searchInputClass}
          />
        </div>

        <select
          value={filters.category}
          onChange={(event) =>
            onChange({ ...filters, category: event.target.value })
          }
          className={selectClass}
        >
          <DarkOption value="ALL">Tất cả thiết bị</DarkOption>
          {categories.map((item) => (
            <DarkOption key={item} value={item}>
              {item}
            </DarkOption>
          ))}
        </select>

        <select
          value={filters.accessLevel}
          onChange={(event) =>
            onChange({
              ...filters,
              accessLevel: event.target
                .value as TechnicalDocumentFilterState["accessLevel"],
            })
          }
          className={selectClass}
        >
          <DarkOption value="ALL">Tất cả quyền</DarkOption>
          <DarkOption value="BASIC">BASIC</DarkOption>
          <DarkOption value="ADVANCED">ADVANCED</DarkOption>
        </select>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#06B6D4] px-4 text-base font-medium text-[#04101F] transition hover:bg-[#22D3EE]"
        >
          <Plus className="h-4 w-4" />
          Thêm
        </button>

        <button
          type="button"
          onClick={onCreateAiCoverage}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#A855F7]/35 bg-[#A855F7]/10 px-4 text-base font-medium text-[#C084FC] transition hover:border-[#A855F7]/60"
        >
          <Sparkles className="h-4 w-4" />
          Bổ sung AI
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#1E2A3F] bg-[#07111F] px-4 text-base font-medium text-[#E5E7EB] transition hover:border-[#334155]"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <select
          value={filters.source}
          onChange={(event) =>
            onChange({ ...filters, source: event.target.value })
          }
          className={selectClass}
        >
          <DarkOption value="ALL">Tất cả nguồn</DarkOption>
          {sources.map((item) => (
            <DarkOption key={item} value={item}>
              {item}
            </DarkOption>
          ))}
        </select>

        <select
          value={filters.embeddingStatus}
          onChange={(event) =>
            onChange({
              ...filters,
              embeddingStatus: event.target.value as "ALL" | EmbeddingStatus,
            })
          }
          className={selectClass}
        >
          <DarkOption value="ALL">Tất cả embedding</DarkOption>
          <DarkOption value="SYNCED">Đã đồng bộ</DarkOption>
          <DarkOption value="STALE">Cần cập nhật</DarkOption>
          <DarkOption value="MISSING">Chưa tạo</DarkOption>
          <DarkOption value="UPDATING">Đang cập nhật</DarkOption>
        </select>

        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, onlyOutdated: !filters.onlyOutdated })
          }
          className={[
            chipClass,
            filters.onlyOutdated
              ? "border-[#EF4444]/40 bg-[#EF4444]/10 text-[#FCA5A5]"
              : "border-[#1E2A3F] bg-[#07111F] text-[#94A3B8]",
          ].join(" ")}
        >
          Tài liệu lỗi thời
        </button>

        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              onlyAiCoverage: !filters.onlyAiCoverage,
            })
          }
          className={[
            chipClass,
            filters.onlyAiCoverage
              ? "border-[#A855F7]/40 bg-[#A855F7]/10 text-[#C084FC]"
              : "border-[#1E2A3F] bg-[#07111F] text-[#94A3B8]",
          ].join(" ")}
        >
          Nhóm AI trả lời kém
        </button>
      </div>
    </section>
  );
}

function DarkOption({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <option value={value} className="bg-[#07111F] text-[#E5E7EB]">
      {children}
    </option>
  );
}

const selectClass =
  "h-11 w-full rounded-xl border border-[#1E2A3F] bg-[#07111F] px-3 text-sm font-medium text-[#E5E7EB] outline-none transition [color-scheme:dark] hover:border-[#334155] focus:border-[#06B6D4]/70 focus:ring-2 focus:ring-[#06B6D4]/20";

const searchInputClass =
  "h-11 w-full rounded-xl border border-[#1E2A3F] bg-[#07111F] pl-10 pr-3 text-sm font-medium text-[#E5E7EB] outline-none transition placeholder:text-[#64748B] hover:border-[#334155] focus:border-[#06B6D4]/70 focus:ring-2 focus:ring-[#06B6D4]/20";

const chipClass =
  "h-11 rounded-xl border px-4 text-base font-medium transition";