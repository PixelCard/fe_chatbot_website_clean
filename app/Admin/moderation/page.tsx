"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ExternalLink,
  FolderKanban,
  MessageSquareWarning,
  RefreshCw,
  Search,
  ShieldAlert,
  Wrench,
} from "lucide-react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import AdminToastStack, { type AdminToast } from "@/app/components/admin/AdminToastStack";
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
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const { items, summary, isLoading, error, refetch } = useModerationApi();

  const addToast = (type: AdminToast["type"], text: string) => {
    const toastId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id: toastId, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResolveItem = (id: string, title: string) => {
    setResolvedIds((prev) => [...prev, id]);
    addToast("success", `Đã xử lý xong: ${title}`);
  };

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      if (resolvedIds.includes(item.id)) return false;
      const matchesType = typeFilter === "ALL" || item.type === typeFilter;
      const matchesKeyword = !keyword || buildSearchValue(item).includes(keyword);
      return matchesType && matchesKeyword;
    });
  }, [items, search, typeFilter, resolvedIds]);

  const activeSelectedId =
    selectedId && filteredItems.some((item) => item.id === selectedId)
      ? selectedId
      : filteredItems[0]?.id ?? null;

  const selectedItem =
    filteredItems.find((item) => item.id === activeSelectedId) ?? filteredItems[0] ?? null;

  return (
    <AdminShell>
      <div className="w-full space-y-5 py-4 text-[var(--admin-strong-text)] sm:py-5">
        <header className="admin-card rounded-3xl p-5 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                <ShieldAlert className="h-3.5 w-3.5" />
                Giám sát rủi ro & Moderation
              </span>
              <h1 className="mt-2.5 text-2xl font-black tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
                Kiểm duyệt hệ thống
              </h1>
              <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
                Tổng hợp các ca tư vấn nguy hiểm, phản hồi đánh giá xấu và log AI bị dislike để admin chủ động can thiệp và xử lý kịp thời.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-extrabold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Làm mới
              </button>
              <span className="inline-flex h-11 items-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-4 text-sm font-bold text-[var(--admin-muted-text)]">
                {filteredItems.length}/{items.length} tin cần duyệt
              </span>
            </div>
          </div>
        </header>

        <section
          aria-label="Thống kê kiểm duyệt"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <button
            type="button"
            onClick={() => setTypeFilter("ALL")}
            className={[
              "admin-card group relative min-h-[112px] overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5",
              typeFilter === "ALL" ? "ring-2 ring-cyan-500/60" : "hover:border-[var(--admin-control-hover-border)]",
            ].join(" ")}
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-cyan-500" />
            <div className="flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.1em] text-[var(--admin-muted-text)]">
                  Tổng tín hiệu
                </p>
                <p className="mt-3 text-3xl font-extrabold leading-none tracking-tight text-[var(--admin-strong-text)]">
                  {items.length}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                <FolderKanban className="h-5 w-5" strokeWidth={2.3} />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("dangerous-session")}
            className={[
              "admin-card group relative min-h-[112px] overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5",
              typeFilter === "dangerous-session" ? "ring-2 ring-rose-500/60" : "hover:border-[var(--admin-control-hover-border)]",
            ].join(" ")}
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-rose-500" />
            <div className="flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.1em] text-[var(--admin-muted-text)]">
                  Ca nguy hiểm
                </p>
                <p className="mt-3 text-3xl font-extrabold leading-none tracking-tight text-rose-600 dark:text-rose-400">
                  {summary.dangerousSessions}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300">
                <ShieldAlert className="h-5 w-5" strokeWidth={2.3} />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("negative-review")}
            className={[
              "admin-card group relative min-h-[112px] overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5",
              typeFilter === "negative-review" ? "ring-2 ring-amber-500/60" : "hover:border-[var(--admin-control-hover-border)]",
            ].join(" ")}
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-amber-500" />
            <div className="flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.1em] text-[var(--admin-muted-text)]">
                  Đánh giá tiêu cực
                </p>
                <p className="mt-3 text-3xl font-extrabold leading-none tracking-tight text-amber-600 dark:text-amber-400">
                  {summary.negativeReviews}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300">
                <MessageSquareWarning className="h-5 w-5" strokeWidth={2.3} />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("disliked-ai")}
            className={[
              "admin-card group relative min-h-[112px] overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5",
              typeFilter === "disliked-ai" ? "ring-2 ring-cyan-500/60" : "hover:border-[var(--admin-control-hover-border)]",
            ].join(" ")}
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-teal-500" />
            <div className="flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.1em] text-[var(--admin-muted-text)]">
                  AI bị Dislike
                </p>
                <p className="mt-3 text-3xl font-extrabold leading-none tracking-tight text-teal-600 dark:text-teal-400">
                  {summary.dislikedAiLogs}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-500/25 bg-teal-500/10 text-teal-600 dark:text-teal-300">
                <Bot className="h-5 w-5" strokeWidth={2.3} />
              </div>
            </div>
          </button>
        </section>

        <section className="admin-card rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative block flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted-text)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm kiếm theo mã ca, tên khách hàng, nội dung hoặc metadata..."
                className="h-11 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] pl-11 pr-10 text-sm font-semibold text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--admin-card-border)] text-[var(--admin-muted-text)] transition hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTypeFilter("ALL")}
                className={[
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-black uppercase tracking-wider transition-all duration-200",
                  typeFilter === "ALL"
                    ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-900 shadow-sm dark:text-cyan-200"
                    : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]",
                ].join(" ")}
              >
                <span>Tất cả</span>
                <span className={`inline-flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-extrabold ${typeFilter === "ALL" ? "bg-cyan-500/25 text-cyan-900 dark:text-cyan-100" : "bg-[var(--admin-card-border)] text-[var(--admin-muted-text)]"}`}>
                  {items.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTypeFilter("dangerous-session")}
                className={[
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-black uppercase tracking-wider transition-all duration-200",
                  typeFilter === "dangerous-session"
                    ? "border-rose-500/50 bg-rose-500/15 text-rose-900 shadow-sm dark:text-rose-200"
                    : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]",
                ].join(" ")}
              >
                <span>Ca nguy hiểm</span>
                <span className={`inline-flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-extrabold ${typeFilter === "dangerous-session" ? "bg-rose-500/25 text-rose-900 dark:text-rose-100" : "bg-[var(--admin-card-border)] text-[var(--admin-muted-text)]"}`}>
                  {summary.dangerousSessions}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTypeFilter("negative-review")}
                className={[
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-black uppercase tracking-wider transition-all duration-200",
                  typeFilter === "negative-review"
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-900 shadow-sm dark:text-amber-200"
                    : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]",
                ].join(" ")}
              >
                <span>Đánh giá tiêu cực</span>
                <span className={`inline-flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-extrabold ${typeFilter === "negative-review" ? "bg-amber-500/25 text-amber-900 dark:text-amber-100" : "bg-[var(--admin-card-border)] text-[var(--admin-muted-text)]"}`}>
                  {summary.negativeReviews}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTypeFilter("disliked-ai")}
                className={[
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-black uppercase tracking-wider transition-all duration-200",
                  typeFilter === "disliked-ai"
                    ? "border-teal-500/50 bg-teal-500/15 text-teal-900 shadow-sm dark:text-teal-200"
                    : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]",
                ].join(" ")}
              >
                <span>AI bị Dislike</span>
                <span className={`inline-flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-extrabold ${typeFilter === "disliked-ai" ? "bg-teal-500/25 text-teal-900 dark:text-teal-100" : "bg-[var(--admin-card-border)] text-[var(--admin-muted-text)]"}`}>
                  {summary.dislikedAiLogs}
                </span>
              </button>
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

        <section className="grid min-h-[620px] grid-cols-1 gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
          <div className="admin-card min-h-0 rounded-3xl p-5">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-card-border)] pb-4">
              <h2 className="text-lg font-black text-[var(--admin-strong-text)]">
                Hàng chờ kiểm tra
              </h2>
              {isLoading ? (
                <span className="text-xs font-bold text-[var(--admin-muted-text)]">
                  Đang tải...
                </span>
              ) : null}
            </div>

            <div className="mt-4 max-h-[calc(100vh-320px)] space-y-3 overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                const isSelected = selectedItem?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={[
                      "w-full rounded-2xl border p-4 text-left transition-all duration-200",
                      isSelected
                        ? "border-cyan-500/60 bg-cyan-500/10 ring-2 ring-cyan-500/40 shadow-sm"
                        : "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
                            <TypeIcon className="h-4 w-4" />
                          </span>
                          <p className="text-sm font-black text-[var(--admin-strong-text)]">
                            {item.title}
                          </p>
                        </div>

                        <p className="mt-2 truncate text-xs font-bold text-[var(--admin-strong-text)]">
                          {item.subtitle}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs font-semibold text-[var(--admin-muted-text)]">
                          {item.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-md border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--admin-muted-text)]">
                            {getModerationTypeLabel(item.type)}
                          </span>
                          <span className="text-[11px] font-semibold text-[var(--admin-soft-text)]">
                            {formatDateTime(item.createdAt)}
                          </span>
                        </div>
                      </div>

                      <span
                        className={[
                          "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide",
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
                <div className="rounded-2xl border border-dashed border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-6 text-center text-sm font-semibold text-[var(--admin-muted-text)]">
                  Không có mục moderation phù hợp với bộ lọc hiện tại.
                </div>
              ) : null}
            </div>
          </div>

          <div className="admin-card min-h-0 rounded-3xl p-5 sm:p-6">
            {selectedItem ? (
              <div className="max-h-[calc(100vh-320px)] space-y-4 overflow-y-auto pr-1">
                <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                        Chi tiết tin kiểm duyệt
                      </p>
                      <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--admin-strong-text)]">
                        {selectedItem.title}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-[var(--admin-muted-text)]">
                        {selectedItem.subtitle}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-lg border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 py-1 text-xs font-black uppercase tracking-wider text-[var(--admin-strong-text)]">
                          {getModerationTypeLabel(selectedItem.type)}
                        </span>
                        <span
                          className={[
                            "rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-wider",
                            getSeverityClasses(selectedItem.severity),
                          ].join(" ")}
                        >
                          {selectedItem.severity === "critical"
                            ? "Cần ưu tiên cao"
                            : "Cần rà soát"}
                        </span>
                      </div>
                    </div>

                    <p className="shrink-0 text-xs font-bold text-[var(--admin-soft-text)]">
                      {formatDateTime(selectedItem.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

                <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-5">
                  <h3 className="text-sm font-black text-[var(--admin-strong-text)]">
                    Nội dung mô tả
                  </h3>
                  <p className="mt-2.5 whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-[var(--admin-strong-text)]">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-5">
                  <h3 className="text-sm font-black text-[var(--admin-strong-text)]">
                    Thông tin dữ liệu (Metadata)
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.entries(selectedItem.metadata).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3.5 py-3"
                      >
                        <p className="text-[11px] font-black uppercase tracking-wider text-[var(--admin-muted-text)]">
                          {key}
                        </p>
                        <p className="mt-1 break-all text-xs font-extrabold text-[var(--admin-strong-text)]">
                          {String(value ?? "--")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-5">
                  <h3 className="text-sm font-black text-[var(--admin-strong-text)]">
                    Hành động xử lý của Admin
                  </h3>
                  <div className="mt-3.5 flex flex-wrap gap-3">
                    {selectedItem.type === "dangerous-session" ? (
                      <>
                        <Link
                          href="/admin/chats"
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-sm transition hover:brightness-105"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Mở phiên chat ca sửa
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleResolveItem(selectedItem.id, selectedItem.title)}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-800 transition hover:bg-emerald-500/20 dark:text-emerald-300"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Đã can thiệp & Xử lý xong
                        </button>
                      </>
                    ) : selectedItem.type === "negative-review" ? (
                      <>
                        <Link
                          href="/admin/chats"
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-sm transition hover:brightness-105"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Mở trao đổi khách hàng
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleResolveItem(selectedItem.id, selectedItem.title)}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-800 transition hover:bg-emerald-500/20 dark:text-emerald-300"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Xác nhận đã giải quyết khiếu nại
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/admin/rag-knowledge"
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-sm transition hover:brightness-105"
                        >
                          <FolderKanban className="h-4 w-4" />
                          Bổ sung tri thức RAG cho AI
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleResolveItem(selectedItem.id, selectedItem.title)}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-800 transition hover:bg-emerald-500/20 dark:text-emerald-300"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Đã rà soát log AI
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-6 text-center text-sm font-semibold text-[var(--admin-muted-text)]">
                <ShieldAlert className="h-8 w-8 text-[var(--admin-soft-text)]" />
                <span>Chọn một mục trong hàng chờ để xem chi tiết & xử lý.</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <AdminToastStack toasts={toasts} onRemove={removeToast} autoCloseMs={10000} />
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
    <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
      <p className="text-[11px] font-black uppercase tracking-wider text-[var(--admin-muted-text)]">
        {label}
      </p>
      <p
        className={[
          "mt-1.5 text-sm font-extrabold text-[var(--admin-strong-text)]",
          breakAll ? "break-all" : "break-words",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
