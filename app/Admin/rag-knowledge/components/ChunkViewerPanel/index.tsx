"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  Database,
  ExternalLink,
  FileSearch,
  FileText,
  Grid,
  Hash,
  Info,
  Layers3,
  Search,
  X,
} from "lucide-react";

import type {
  RagChunkDetail,
  RagDocumentChunksResponse,
  RagDocumentDetail,
  RagDocumentListItem,
} from "../../types/ragKnowledge.types";
import { Pagination } from "@/app/components/Pagination";

type Props = {
  open: boolean;
  document: RagDocumentListItem | null;
  documentDetail: RagDocumentDetail | null;
  data: RagDocumentChunksResponse | null;
  selectedChunk: RagChunkDetail | null;
  isLoading?: boolean;
  isChunkLoading?: boolean;
  searchValue: string;
  onClose: () => void;
  onCloseChunkDetail: () => void;
  onSearch: (value: string) => void;
  onPageChange: (page: number) => void;
  onViewChunk: (chunkId: number) => void;
};

export default function ChunkViewerPanel({
  open,
  document,
  documentDetail,
  data,
  selectedChunk,
  isLoading = false,
  isChunkLoading = false,
  searchValue,
  onClose,
  onCloseChunkDetail,
  onSearch,
  onPageChange,
  onViewChunk,
}: Props) {
  const [draft, setDraft] = useState(searchValue);
  const [copied, setCopied] = useState(false);

  if (!open || !document) return null;

  const pagination = data?.pagination;
  const originalFileName =
    documentDetail?.originalFileName ||
    documentDetail?.storedFileName ||
    document.title;
  const originalFileUrl = documentDetail?.fileUrl || null;

  const handleCopy = () => {
    if (selectedChunk) {
      void navigator.clipboard.writeText(selectedChunk.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewChunk = (chunkId: number) => {
    setCopied(false);
    onViewChunk(chunkId);
  };

  return (
    <section className="admin-card overflow-hidden rounded-3xl">
      <header className="flex flex-col gap-4 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
              <Layers3 className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold text-[var(--admin-strong-text)]">
                Chunks của {document.title}
              </h2>
              <p className="mt-1 text-[15px] font-semibold text-[var(--admin-muted-text)]">
                Tìm theo title, section hoặc content. Không hiển thị raw vector embedding.
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {originalFileUrl ? (
            <a
              href={originalFileUrl}
              target="_blank"
              rel="noreferrer"
              title={originalFileName}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 px-4 text-[15px] font-bold text-[#0891B2] transition-all duration-150 hover:border-[#06B6D4]/40 hover:bg-[#06B6D4]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
            >
              <ExternalLink className="h-4 w-4" />
              Xem tài liệu gốc
            </a>
          ) : null}
          <span className="inline-flex h-11 items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-5 text-[15px] font-bold text-[var(--admin-strong-text)]">
            {pagination?.total ?? data?.document.totalChunks ?? 0} chunks
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition-all duration-150 hover:bg-[var(--admin-control-hover-bg)] active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-col">
        {/* Search bar */}
        <div className="flex flex-col gap-4 border-b border-[var(--admin-card-border)] px-6 py-5 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--admin-muted-text)]" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSearch(draft.trim());
                }
              }}
              placeholder="Tìm theo tiêu đề chunk hoặc nội dung..."
              className="h-12 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] pl-11 pr-4 text-[15px] font-semibold text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
            />
          </label>
          <button
            type="button"
            onClick={() => onSearch(draft.trim())}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-5 text-[15px] font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition-all duration-150 hover:brightness-105 active:scale-95"
          >
            <FileSearch className="h-4.5 w-4.5" />
            Tìm chunk
          </button>
        </div>

        {/* Chunks list (Full Width) */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="space-y-4 p-6">
              <div className="h-28 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
              <div className="h-28 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
              <div className="h-28 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
            </div>
          ) : data && data.chunks.length > 0 ? (
            <div className="divide-y divide-[var(--admin-card-border)]">
              {data.chunks.map((chunk) => (
                <article
                  key={chunk.id}
                  className="px-6 py-6 transition-all duration-200 ease-in-out hover:bg-[var(--admin-control-hover-bg)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="rounded-lg bg-[var(--admin-accent)]/15 px-3 py-1 text-xs font-bold text-[var(--admin-accent)]">
                          Đoạn #{chunk.chunkIndex + 1}
                        </span>
                        <p className="text-[16px] font-bold text-[var(--admin-strong-text)] leading-6">
                          {chunk.title || chunk.section || "Không có tiêu đề đoạn"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <TagPill
                        tone={chunk.hasEmbedding ? "cyan" : "slate"}
                      >
                        {chunk.hasEmbedding ? "Đã có embedding" : "Chưa embedding"}
                      </TagPill>
                      <button
                        type="button"
                        onClick={() => handleViewChunk(chunk.id)}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-[14px] font-bold text-[var(--admin-strong-text)] transition-all duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] active:scale-95"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--admin-strong-text)] whitespace-pre-wrap break-words">
                    {chunk.content.length > 400 ? `${chunk.content.slice(0, 400)}...` : chunk.content}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2.5 text-[13px] font-bold">
                    <TagPill>
                      <Hash className="h-3.5 w-3.5 text-[var(--admin-muted-text)]" />
                      {chunk.charCount ?? 0} ký tự
                    </TagPill>
                    <TagPill>
                      <Database className="h-3.5 w-3.5 text-[var(--admin-muted-text)]" />
                      {chunk.tokenCount ?? 0} tokens
                    </TagPill>
                    {chunk.pageNumber != null ? (
                      <TagPill>
                        <BookOpen className="h-3.5 w-3.5 text-[var(--admin-muted-text)]" />
                        Trang {chunk.pageNumber}
                      </TagPill>
                    ) : null}
                    {chunk.sheetName ? (
                      <TagPill>
                        <Grid className="h-3.5 w-3.5 text-[var(--admin-muted-text)]" />
                        Sheet {chunk.sheetName}
                      </TagPill>
                    ) : null}
                    <TagPill tone={chunk.isActive ? "green" : "red"}>
                      {chunk.isActive ? "Hoạt động" : "Tạm khóa"}
                    </TagPill>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-xl font-bold text-[var(--admin-strong-text)]">
                Không tìm thấy chunk phù hợp
              </p>
              <p className="mt-2 text-[15px] font-medium text-[var(--admin-muted-text)]">
                Thử từ khóa khác hoặc reindex lại tài liệu nếu chunk chưa được tạo đúng.
              </p>
            </div>
          )}

          {pagination && pagination.totalPages > 1 ? (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--admin-card-border)] px-6 py-5 lg:flex-row">
              <p className="text-[15px] font-semibold text-[var(--admin-muted-text)]">
                Trang {pagination.page}/{pagination.totalPages} · {pagination.total} kết quả
              </p>
              <div className="w-full lg:w-auto">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Chunk Detail Modal */}
      {selectedChunk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
          <div className="admin-card flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl shadow-2xl">
            <header className="shrink-0 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="rounded-lg bg-[var(--admin-accent)]/15 px-3 py-1 text-xs font-bold text-[var(--admin-accent)]">
                      Chunk #{selectedChunk.chunkIndex + 1}
                    </span>
                    <h3 className="truncate text-xl font-bold text-[var(--admin-strong-text)] leading-7">
                      {selectedChunk.title || selectedChunk.section || "Chi tiết đoạn nội dung"}
                    </h3>
                  </div>
                  <p className="mt-2 truncate text-[15px] font-semibold text-[var(--admin-muted-text)] flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 shrink-0 text-[var(--admin-muted-text)]" />
                    Tài liệu: {selectedChunk.document.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onCloseChunkDetail}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] transition-all duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-6">
              {isChunkLoading ? (
                <div className="space-y-4">
                  <div className="h-10 animate-pulse rounded-xl bg-[var(--admin-card-soft-bg)]" />
                  <div className="h-44 animate-pulse rounded-xl bg-[var(--admin-card-soft-bg)]" />
                </div>
              ) : (
                <>
                  {/* Metadata Grid */}
                  <section>
                    <h4 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[var(--admin-muted-text)] mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-[var(--admin-muted-text)]" />
                      Thông tin Metadata
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <DetailCard label="Vị trí index" value={`Chunk #${selectedChunk.chunkIndex + 1}`} />
                      <DetailCard label="Số ký tự" value={`${selectedChunk.charCount ?? 0} ký tự`} />
                      <DetailCard label="Số tokens" value={`${selectedChunk.tokenCount ?? 0} tokens`} />
                      <DetailCard label="Quyền truy cập" value={selectedChunk.accessLevel === "BASIC" ? "Cơ bản (BASIC)" : "Nâng cao (ADVANCED)"} />
                      <DetailCard label="Trang tài liệu" value={selectedChunk.pageNumber != null ? `Trang ${selectedChunk.pageNumber}` : "--"} />
                      <DetailCard label="Sheet Excel" value={selectedChunk.sheetName ? `Sheet ${selectedChunk.sheetName}` : "--"} />
                      <DetailCard label="Nhóm thiết bị" value={selectedChunk.category || "--"} />
                      <DetailCard label="Hãng (Brand)" value={selectedChunk.brand || "--"} />
                      <DetailCard label="Mã thiết bị" value={selectedChunk.modelCode || "--"} />
                      <DetailCard label="Từ khóa (Tags)" value={selectedChunk.tags && selectedChunk.tags.length > 0 ? selectedChunk.tags.join(", ") : "--"} />
                      <DetailCard label="Ngày tạo" value={formatDateTime(selectedChunk.createdAt)} />
                      <DetailCard label="Cập nhật cuối" value={formatDateTime(selectedChunk.updatedAt)} />
                    </div>
                  </section>

                  {/* Chunk content */}
                  <section className="flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[var(--admin-muted-text)] flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[var(--admin-muted-text)]" />
                        Nội dung đoạn văn bản
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className={[
                          "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border px-4 text-sm font-bold transition-all duration-150 active:scale-95",
                          copied
                            ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                            : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] hover:bg-[var(--admin-control-hover-bg)]",
                        ].join(" ")}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Đã sao chép!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Sao chép nội dung
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-5 text-[15px] leading-relaxed text-[var(--admin-strong-text)] whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto">
                      {selectedChunk.content}
                    </div>
                  </section>

                  {/* Raw Metadata JSON */}
                  <section>
                    <h4 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[var(--admin-muted-text)] mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4 text-[var(--admin-muted-text)]" />
                      Dữ liệu JSON Raw Metadata
                    </h4>
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-neutral-900 dark:bg-black p-4 text-[13px] font-mono leading-relaxed text-zinc-300 border border-neutral-800 max-h-[200px] overflow-y-auto">
                      {JSON.stringify(selectedChunk.metadata || {}, null, 2)}
                    </pre>
                  </section>
                </>
              )}
            </div>

            <footer className="shrink-0 border-t border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={onCloseChunkDetail}
                className="h-11 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-5 text-[15px] font-bold text-[var(--admin-strong-text)] transition-all duration-150 hover:bg-[var(--admin-control-hover-bg)] active:scale-95"
              >
                Đóng
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}

function TagPill({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "cyan" | "green" | "red";
}) {
  const toneClass = {
    slate: "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-[var(--admin-strong-text)]",
    cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    green: "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
    red: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  }[tone];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-bold transition duration-150",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-3.5 flex flex-col justify-center min-h-[76px]">
      <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--admin-muted-text)]">
        {label}
      </span>
      <span className="mt-1 text-[15px] font-semibold text-[var(--admin-strong-text)] truncate" title={value}>
        {value}
      </span>
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
