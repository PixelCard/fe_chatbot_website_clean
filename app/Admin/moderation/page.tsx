"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  MessageSquareWarning,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import { useModerationApi } from "./hooks";
import type { ModerationQueueItem } from "./types/moderation.types";

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

type ModerationFilter = "ALL" | ModerationQueueItem["type"];

const moderationTypeOptions: Array<{
  value: ModerationFilter;
  label: string;
}> = [
  { value: "ALL", label: "Tất cả" },
  { value: "dangerous-session", label: "Ca nguy hiểm" },
  { value: "negative-review", label: "Review xấu" },
  { value: "disliked-ai", label: "AI bị dislike" },
];

const panelClass =
  "rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] p-4";
const innerPanelClass =
  "rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4";
const controlClass =
  "border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-theme-text)] transition-colors duration-150 hover:border-[var(--admin-control-hover-border)]";
const accentTextClass =
  "text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300";
const strongTextClass = "text-[var(--admin-strong-text)]";
const mutedTextClass = "text-[var(--admin-muted-text)]";
const subtleTextClass = "text-[var(--admin-subtle-text)]";
const activeFilterClass =
  "border-cyan-300/80 bg-cyan-50 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300";

function getModerationTypeLabel(type: ModerationQueueItem["type"]) {
  if (type === "dangerous-session") return "Ca nguy hiểm";
  if (type === "negative-review") return "Đánh giá tiêu cực";
  return "AI bị dislike";
}

function getSeverityClasses(severity: ModerationQueueItem["severity"]) {
  return severity === "critical"
    ? "border-rose-300/80 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200"
    : "border-amber-300/80 bg-amber-50 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/12 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-200";
}

function getTypeIcon(type: ModerationQueueItem["type"]) {
  if (type === "dangerous-session") return ShieldAlert;
  if (type === "negative-review") return MessageSquareWarning;
  return Bot;
}

function buildSearchValue(item: ModerationQueueItem) {
  return [item.title, item.subtitle, item.description, ...Object.values(item.metadata)]
    .join(" ")
    .toLowerCase();
}

export default function ModerationPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ModerationFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { items, summary, isLoading, error, refetch } = useModerationApi();

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesType = typeFilter === "ALL" || item.type === typeFilter;
      const matchesKeyword = !keyword || buildSearchValue(item).includes(keyword);
      return matchesType && matchesKeyword;
    });
  }, [items, search, typeFilter]);

  const activeSelectedId =
    selectedId && filteredItems.some((item) => item.id === selectedId)
      ? selectedId
      : filteredItems[0]?.id ?? null;

  const selectedItem =
    filteredItems.find((item) => item.id === activeSelectedId) ?? filteredItems[0] ?? null;

  return (
    <AdminShell>
      <div className="w-full max-w-none space-y-4 text-[var(--admin-theme-text)]">
        <section className={panelClass}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className={`text-sm font-semibold uppercase tracking-[0.12em] ${accentTextClass}`}>
                Risk Ops
              </p>
              <h1 className={`mt-2 text-2xl font-semibold tracking-tight ${strongTextClass}`}>
                Moderation
              </h1>
              <p className={`mt-1 max-w-3xl text-sm ${mutedTextClass}`}>
                Tổng hợp ca nguy hiểm, đánh giá tiêu cực và phản hồi AI bị dislike để
                admin rà soát nhanh các tín hiệu cần can thiệp.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void refetch()}
                className={`inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium ${controlClass}`}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tải lại
              </button>
              <span
                className={`inline-flex h-10 items-center rounded-xl px-4 text-sm ${controlClass} ${mutedTextClass}`}
              >
                {filteredItems.length}/{items.length} mục hiển thị
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setTypeFilter("dangerous-session")}
            className={[
              `${panelClass} text-left transition-colors duration-150`,
              typeFilter === "dangerous-session"
                ? "border-rose-300/80 bg-rose-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10"
                : "hover:border-[var(--admin-control-hover-border)]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={`text-sm ${mutedTextClass}`}>Ca nguy hiểm</p>
              <ShieldAlert className="h-5 w-5 text-rose-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-300" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{summary.dangerousSessions}</p>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("negative-review")}
            className={[
              `${panelClass} text-left transition-colors duration-150`,
              typeFilter === "negative-review"
                ? "border-amber-300/80 bg-amber-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500/10"
                : "hover:border-[var(--admin-control-hover-border)]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={`text-sm ${mutedTextClass}`}>Đánh giá tiêu cực</p>
              <MessageSquareWarning className="h-5 w-5 text-amber-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{summary.negativeReviews}</p>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("disliked-ai")}
            className={[
              `${panelClass} text-left transition-colors duration-150`,
              typeFilter === "disliked-ai"
                ? "border-cyan-300/80 bg-cyan-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/10"
                : "hover:border-[var(--admin-control-hover-border)]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={`text-sm ${mutedTextClass}`}>Log AI bị dislike</p>
              <Bot className={`h-5 w-5 ${accentTextClass}`} />
            </div>
            <p className="mt-2 text-3xl font-semibold">{summary.dislikedAiLogs}</p>
          </button>
        </section>

        <section className={panelClass}>
          <div className="flex flex-col gap-3 xl:flex-row">
            <label className="relative block min-w-0 flex-1">
              <Search className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${subtleTextClass}`} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo mã ca, tên khách, nội dung, metadata..."
                className="h-10 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] pl-10 pr-4 text-sm font-medium text-[var(--admin-theme-text)] outline-none transition-colors duration-150 placeholder:text-[var(--admin-subtle-text)] hover:border-[var(--admin-control-hover-border)] focus:border-cyan-400/70 focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTypeFilter("ALL")}
                className={[
                  "inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition-colors duration-150",
                  typeFilter === "ALL"
                    ? activeFilterClass
                    : `${controlClass} text-[var(--admin-theme-text)]`,
                ].join(" ")}
              >
                Tất cả
              </button>

              {moderationTypeOptions
                .filter((option) => option.value !== "ALL")
                .map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTypeFilter(option.value)}
                    className={[
                      "inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition-colors duration-150",
                      typeFilter === option.value
                        ? activeFilterClass
                        : `${controlClass} text-[var(--admin-theme-text)]`,
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-rose-300/80 bg-rose-50 p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/12">
            <p className="text-sm font-bold text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200">
              Không tải được hàng chờ moderation.
            </p>
            <p className="mt-1 text-sm text-rose-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-100">
              {error.message}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 inline-flex h-10 items-center rounded-xl border border-rose-300/80 px-4 text-sm font-bold text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-100"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tải lại
            </button>
          </section>
        ) : null}

        <section className="grid min-h-[620px] grid-cols-1 gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className={`min-h-0 ${panelClass}`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className={`text-lg font-semibold ${strongTextClass}`}>Hàng chờ kiểm tra</h2>
              {isLoading ? <span className={`text-sm ${mutedTextClass}`}>Đang tải...</span> : null}
            </div>

            <div className="mt-4 max-h-[calc(100vh-320px)] space-y-3 overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={[
                      "w-full rounded-2xl border p-4 text-left transition-colors duration-150",
                      selectedItem?.id === item.id
                        ? "border-cyan-300/80 bg-cyan-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/10"
                        : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] hover:border-[var(--admin-control-hover-border)]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${controlClass} ${accentTextClass}`}
                          >
                            <TypeIcon className="h-4 w-4" />
                          </span>
                          <p className={`text-sm font-semibold ${strongTextClass}`}>{item.title}</p>
                        </div>

                        <p className={`mt-2 truncate text-sm ${strongTextClass}`}>
                          {item.subtitle}
                        </p>
                        <p className={`mt-1 line-clamp-2 text-sm ${mutedTextClass}`}>
                          {item.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${controlClass} ${mutedTextClass}`}
                          >
                            {getModerationTypeLabel(item.type)}
                          </span>
                          <span className={`text-xs ${subtleTextClass}`}>
                            {formatDateTime(item.createdAt)}
                          </span>
                        </div>
                      </div>

                      <span
                        className={[
                          "shrink-0 rounded-full border px-2 py-1 text-xs font-bold",
                          getSeverityClasses(item.severity),
                        ].join(" ")}
                      >
                        {item.severity === "critical" ? "Khẩn" : "Cảnh báo"}
                      </span>
                    </div>
                  </button>
                );
              })}

              {!isLoading && filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] p-6 text-center text-sm text-[var(--admin-muted-text)]">
                  Không có item moderation phù hợp với bộ lọc hiện tại.
                </div>
              ) : null}
            </div>
          </div>

          <div className={`min-h-0 ${panelClass}`}>
            {selectedItem ? (
              <div className="max-h-[calc(100vh-320px)] space-y-4 overflow-y-auto pr-1">
                <div className={innerPanelClass}>
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className={`text-xs font-black uppercase tracking-[0.12em] ${accentTextClass}`}>
                        Chi tiết moderation
                      </p>
                      <h2 className={`mt-2 text-xl font-semibold ${strongTextClass}`}>
                        {selectedItem.title}
                      </h2>
                      <p className={`mt-1 text-sm ${mutedTextClass}`}>{selectedItem.subtitle}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${controlClass}`}
                        >
                          {getModerationTypeLabel(selectedItem.type)}
                        </span>
                        <span
                          className={[
                            "rounded-lg border px-3 py-1.5 text-xs font-medium",
                            getSeverityClasses(selectedItem.severity),
                          ].join(" ")}
                        >
                          {selectedItem.severity === "critical"
                            ? "Cần ưu tiên cao"
                            : "Cần rà soát"}
                        </span>
                      </div>
                    </div>

                    <p className={`shrink-0 text-sm ${mutedTextClass}`}>
                      {formatDateTime(selectedItem.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <QuickFact
                    label="Loại tín hiệu"
                    value={getModerationTypeLabel(selectedItem.type)}
                  />
                  <QuickFact
                    label="Mức ưu tiên"
                    value={selectedItem.severity === "critical" ? "Khẩn" : "Cảnh báo"}
                  />
                  <QuickFact label="Mã item" value={selectedItem.id} breakAll />
                </div>

                <div className={innerPanelClass}>
                  <h3 className={`text-base font-semibold ${strongTextClass}`}>Mô tả</h3>
                  <p
                    className={`mt-3 whitespace-pre-wrap break-words text-sm leading-7 ${strongTextClass}`}
                  >
                    {selectedItem.description}
                  </p>
                </div>

                <div className={innerPanelClass}>
                  <h3 className={`text-base font-semibold ${strongTextClass}`}>Metadata</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {Object.entries(selectedItem.metadata).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 py-2.5"
                      >
                        <p className={`text-xs uppercase tracking-[0.1em] ${subtleTextClass}`}>
                          {key}
                        </p>
                        <p className={`mt-1 break-all text-sm font-semibold ${strongTextClass}`}>
                          {String(value ?? "--")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] p-6 text-center text-sm text-[var(--admin-muted-text)]">
                Chọn một item moderation để xem chi tiết.
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function QuickFact({
  label,
  value,
  breakAll = false,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4">
      <p className="text-xs uppercase tracking-[0.1em] text-[var(--admin-subtle-text)]">
        {label}
      </p>
      <p
        className={[
          "mt-2 text-sm font-semibold text-[var(--admin-strong-text)]",
          breakAll ? "break-all" : "break-words",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
