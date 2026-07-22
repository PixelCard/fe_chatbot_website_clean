"use client";

import { Filter, RotateCcw, Search } from "lucide-react";
import type {
  AiReasoningFilterState,
  AiReasoningLogItem,
} from "../types/aiReasoning.types";

export function AiReasoningFilterBar({
  filters,
  onChange,
  onReset,
  logs,
}: {
  filters: AiReasoningFilterState;
  onChange: (next: AiReasoningFilterState) => void;
  onReset: () => void;
  logs: AiReasoningLogItem[];
}) {
  const deviceCategories = Array.from(
    new Set(logs.map((item) => item.deviceCategory).filter(Boolean)),
  ) as string[];

  return (
    <section className="admin-card rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
          <Filter className="h-5 w-5" />
        </span>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--admin-strong-text)]">
            Bộ lọc log AI
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--admin-muted-text)]">
            Lọc theo phản hồi, rủi ro, thiết bị, điểm đánh giá hoặc mẫu tốt đã xác nhận.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-soft-text)]" />

          <input
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="Tìm câu hỏi, câu trả lời, mã ca, người dùng..."
            className={[controlClass, "pl-10"].join(" ")}
          />
        </div>

        <select
          value={filters.feedback}
          onChange={(event) =>
            onChange({
              ...filters,
              feedback:
                event.target.value as AiReasoningFilterState["feedback"],
            })
          }
          className={controlClass}
        >
          <ThemeOption value="ALL">Tất cả phản hồi</ThemeOption>
          <ThemeOption value="LIKE">LIKE</ThemeOption>
          <ThemeOption value="DISLIKE">DISLIKE</ThemeOption>
          <ThemeOption value="NONE">Chưa phản hồi</ThemeOption>
        </select>

        <select
          value={filters.riskLevel}
          onChange={(event) =>
            onChange({
              ...filters,
              riskLevel:
                event.target.value as AiReasoningFilterState["riskLevel"],
            })
          }
          className={controlClass}
        >
          <ThemeOption value="ALL">Tất cả rủi ro</ThemeOption>
          <ThemeOption value="LOW">Thấp</ThemeOption>
          <ThemeOption value="MEDIUM">Trung bình</ThemeOption>
          <ThemeOption value="HIGH">Cao</ThemeOption>
          <ThemeOption value="CRITICAL">Nghiêm trọng</ThemeOption>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-error)]/45 hover:bg-red-500/10 hover:text-[var(--admin-error)]"
        >
          <RotateCcw className="h-4 w-4" />
          Đặt lại
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select
          value={filters.deviceCategory}
          onChange={(event) =>
            onChange({ ...filters, deviceCategory: event.target.value })
          }
          className={controlClass}
        >
          <ThemeOption value="ALL">Tất cả thiết bị</ThemeOption>
          {deviceCategories.map((item) => (
            <ThemeOption key={item} value={item}>
              {item}
            </ThemeOption>
          ))}
        </select>

        <select
          value={filters.scoreLevel}
          onChange={(event) =>
            onChange({
              ...filters,
              scoreLevel:
                event.target.value as AiReasoningFilterState["scoreLevel"],
            })
          }
          className={controlClass}
        >
          <ThemeOption value="ALL">Tất cả điểm</ThemeOption>
          <ThemeOption value="LOW_SCORE">Điểm thấp</ThemeOption>
          <ThemeOption value="HIGH_SCORE">Điểm cao</ThemeOption>
        </select>

        <select
          value={filters.golden}
          onChange={(event) =>
            onChange({
              ...filters,
              golden:
                event.target.value as AiReasoningFilterState["golden"],
            })
          }
          className={controlClass}
        >
          <ThemeOption value="ALL">Tất cả mẫu tốt</ThemeOption>
          <ThemeOption value="YES">Mẫu tốt</ThemeOption>
          <ThemeOption value="NO">Không phải mẫu tốt</ThemeOption>
        </select>
      </div>
    </section>
  );
}

function ThemeOption({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <option
      value={value}
      className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]"
    >
      {children}
    </option>
  );
}

const controlClass =
  "h-11 w-full rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition [color-scheme:light] placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)] dark:[color-scheme:dark]";
