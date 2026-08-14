"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
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

import { Pagination } from "@/app/components/Pagination";

import type {
  RagChunkDetail,
  RagDocumentChunksResponse,
  RagDocumentDetail,
  RagDocumentListItem,
} from "../../types/ragKnowledge.types";

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

type NavigableChunk = {
  id: number;
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

  const visibleChunks = useMemo(() => {
    const raw = data?.chunks ?? [];
    return raw.slice(0, 10);
  }, [data?.chunks]);
  const pagination = data?.pagination;

  const originalFileName =
    documentDetail?.originalFileName ||
    documentDetail?.storedFileName ||
    document?.title ||
    "Tài liệu gốc";

  const originalFileUrl = documentDetail?.fileUrl || null;

  const selectedChunkIndex = selectedChunk
    ? visibleChunks.findIndex((chunk) => chunk.id === selectedChunk.id)
    : -1;

  const previousChunk =
    selectedChunkIndex > 0 ? visibleChunks[selectedChunkIndex - 1] : null;

  const nextChunk =
    selectedChunkIndex >= 0 && selectedChunkIndex < visibleChunks.length - 1
      ? visibleChunks[selectedChunkIndex + 1]
      : null;

  if (!open || !document) return null;

  const totalChunks = pagination?.total ?? data?.document.totalChunks ?? 0;

  const handleSearch = () => {
    onSearch(draft.trim());
  };

  const handleCopy = async () => {
    if (!selectedChunk) return;

    try {
      await navigator.clipboard.writeText(selectedChunk.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleViewChunk = (chunkId: number) => {
    setCopied(false);
    onViewChunk(chunkId);
  };

  return (
    <section className="admin-card w-full overflow-hidden rounded-[28px] border border-[var(--admin-card-border)] shadow-sm">
      <header className="border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <IconBox tone="cyan">
              <Layers3 className="h-6 w-6" />
            </IconBox>

            <div className="min-w-0">
              <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
                Trình xem chunks
              </p>

              <h2 className="mt-1 line-clamp-2 text-[24px] font-black leading-8 text-[var(--admin-strong-text)]">
                {document.title}
              </h2>

              <p className="mt-1 max-w-3xl text-[15px] font-semibold leading-7 text-[var(--admin-muted-text)]">
                Duyệt, tìm kiếm và kiểm tra nội dung chunk đã sinh từ tài liệu.
                Không hiển thị raw vector embedding.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {originalFileUrl ? (
              <a
                href={originalFileUrl}
                target="_blank"
                rel="noreferrer"
                title={originalFileName}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-cyan-500/25 bg-cyan-500/10 px-4 text-[14px] font-black text-cyan-700 transition hover:border-cyan-500/45 hover:bg-cyan-500/15 dark:text-cyan-300"
              >
                <ExternalLink className="h-4 w-4" />
                Xem tài liệu gốc
              </a>
            ) : null}

            <span className="inline-flex h-11 items-center rounded-[14px] border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-4 text-[14px] font-black text-[var(--admin-strong-text)]">
              {totalChunks} chunks
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng trình xem chunk"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)] active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-5 py-4 sm:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--admin-muted-text)]" />

            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              placeholder="Tìm theo tiêu đề, section hoặc nội dung chunk..."
              className="h-12 w-full rounded-[16px] border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] pl-12 pr-4 text-[15px] font-semibold text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
            />
          </label>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[image:var(--admin-cta-bg)] px-5 text-[15px] font-black text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 active:scale-95"
          >
            <FileSearch className="h-5 w-5" />
            Tìm chunk
          </button>
        </div>
      </div>

      <div className="min-w-0 bg-[var(--admin-card-soft-bg)]">
        {isLoading ? (
          <ChunkListSkeleton />
        ) : visibleChunks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-5 sm:p-6 lg:grid-cols-2 2xl:grid-cols-3">
            {visibleChunks.map((chunk) => (
              <article
                key={chunk.id}
                onClick={() => handleViewChunk(chunk.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleViewChunk(chunk.id);
                }}
                className="group flex h-full cursor-pointer flex-col rounded-[20px] border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--admin-accent)] hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[var(--admin-accent)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <TagPill tone="cyan">Đoạn #{chunk.chunkIndex + 1}</TagPill>

                  <TagPill tone={chunk.hasEmbedding ? "green" : "slate"}>
                    {chunk.hasEmbedding ? "Đã có embedding" : "Chưa embedding"}
                  </TagPill>

                  <TagPill tone={chunk.isActive ? "green" : "red"}>
                    {chunk.isActive ? "Hoạt động" : "Tạm khóa"}
                  </TagPill>
                </div>

                <h3 className="mt-3 line-clamp-2 text-[17px] font-black leading-6 text-[var(--admin-strong-text)]">
                  {chunk.title || chunk.section || "Không có tiêu đề đoạn"}
                </h3>

                <p className="mt-2 line-clamp-4 flex-1 whitespace-pre-wrap break-words text-[14px] font-semibold leading-6 text-[var(--admin-muted-text)]">
                  {chunk.content}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--admin-card-border)] pt-3">
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
                </div>

                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-[var(--admin-accent)] opacity-0 transition group-hover:opacity-100">
                  Xem chi tiết
                  <ChevronRight className="h-4 w-4" />
                </span>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {pagination && pagination.totalPages > 1 ? (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-5 py-5 lg:flex-row sm:px-8">
            <p className="text-[15px] font-semibold text-[var(--admin-muted-text)]">
              Trang {pagination.page}/{pagination.totalPages} ·{" "}
              {pagination.total} kết quả
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

      {selectedChunk ? (
        <ChunkDetailModal
          selectedChunk={selectedChunk}
          previousChunk={previousChunk}
          nextChunk={nextChunk}
          isChunkLoading={isChunkLoading}
          copied={copied}
          onCopy={handleCopy}
          onClose={onCloseChunkDetail}
          onNavigate={handleViewChunk}
        />
      ) : null}
    </section>
  );
}

function ChunkDetailModal({
  selectedChunk,
  previousChunk,
  nextChunk,
  isChunkLoading,
  copied,
  onCopy,
  onClose,
  onNavigate,
}: {
  selectedChunk: RagChunkDetail;
  previousChunk: NavigableChunk | null;
  nextChunk: NavigableChunk | null;
  isChunkLoading: boolean;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
  onNavigate: (chunkId: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/55 px-3 py-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => previousChunk && onNavigate(previousChunk.id)}
        disabled={!previousChunk || isChunkLoading}
        aria-label="Xem chunk trước"
        className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] text-[var(--admin-strong-text)] shadow-2xl transition hover:bg-[var(--admin-control-hover-bg)] disabled:pointer-events-none disabled:opacity-30 md:flex"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={() => nextChunk && onNavigate(nextChunk.id)}
        disabled={!nextChunk || isChunkLoading}
        aria-label="Xem chunk kế tiếp"
        className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] text-[var(--admin-strong-text)] shadow-2xl transition hover:bg-[var(--admin-control-hover-bg)] disabled:pointer-events-none disabled:opacity-30 md:flex"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="admin-card flex max-h-[calc(100dvh-32px)] w-[min(1080px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl shadow-2xl">
        <header className="shrink-0 border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-5 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <TagPill tone="cyan">
                  Chunk #{selectedChunk.chunkIndex + 1}
                </TagPill>

                <TagPill tone={selectedChunk.isActive ? "green" : "red"}>
                  {selectedChunk.isActive ? "Hoạt động" : "Tạm khóa"}
                </TagPill>
              </div>

              <h3 className="mt-3 line-clamp-2 text-[22px] font-black leading-8 text-[var(--admin-strong-text)] sm:text-[26px] sm:leading-9">
                {selectedChunk.title ||
                  selectedChunk.section ||
                  "Chi tiết đoạn nội dung"}
              </h3>

              <p className="mt-2 flex min-w-0 items-center gap-2 truncate text-[15px] font-semibold text-[var(--admin-muted-text)]">
                <FileText className="h-5 w-5 shrink-0" />
                Tài liệu: {selectedChunk.document.title}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {/* Nút điều hướng dạng inline cho tablet/mobile, thay cho nút nổi 2 bên */}
              <button
                type="button"
                onClick={() => previousChunk && onNavigate(previousChunk.id)}
                disabled={!previousChunk || isChunkLoading}
                aria-label="Xem chunk trước"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)] disabled:cursor-not-allowed disabled:opacity-30 md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => nextChunk && onNavigate(nextChunk.id)}
                disabled={!nextChunk || isChunkLoading}
                aria-label="Xem chunk kế tiếp"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)] disabled:cursor-not-allowed disabled:opacity-30 md:hidden"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng chi tiết chunk"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--admin-card-bg)]">
          {isChunkLoading ? (
            <div className="space-y-4 p-5 sm:p-8">
              <div className="h-12 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
              <div className="h-[360px] animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
            </div>
          ) : (
            <div>
              {/* Cột trái: nội dung chunk + JSON raw, cuộn độc lập */}
              <div className="p-5 sm:p-8">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
                    <FileText className="h-4 w-4" />
                    Nội dung đoạn văn bản
                  </h4>

                  <button
                    type="button"
                    onClick={onCopy}
                    className={[
                      "inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border px-4 text-[14px] font-black transition active:scale-95",
                      copied
                        ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] hover:bg-[var(--admin-control-hover-bg)]",
                    ].join(" ")}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Sao chép
                      </>
                    )}
                  </button>
                </div>

                <div className="whitespace-pre-wrap break-words rounded-[22px] border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-5 text-[16px] font-medium leading-8 text-[var(--admin-strong-text)] sm:text-[17px]">
                  {selectedChunk.content}
                </div>

                <details className="mt-5 rounded-[22px] border border-dashed border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4">
                  <summary className="flex cursor-pointer items-center gap-2 text-[13px] font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
                    <Database className="h-4 w-4" />
                    Dữ liệu JSON raw metadata
                  </summary>

                  <pre className="mt-4 max-h-[260px] overflow-auto whitespace-pre-wrap break-words rounded-[18px] border border-neutral-800 bg-neutral-950 p-4 font-mono text-[13px] leading-7 text-zinc-300">
                    {JSON.stringify(selectedChunk.metadata || {}, null, 2)}
                  </pre>
                </details>
              </div>

              {/* Cột phải: metadata dạng sidebar, cuộn độc lập, dính khi cần */}
              <aside className="border-t border-[var(--admin-card-border)] bg-[var(--admin-soft-panel)] p-5 sm:p-6">
                <MetadataSection selectedChunk={selectedChunk} layout="stack" />
              </aside>
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => previousChunk && onNavigate(previousChunk.id)}
                disabled={!previousChunk || isChunkLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-[14px] font-black text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft className="h-4 w-4" />
                Chunk trước
              </button>

              <button
                type="button"
                onClick={() => nextChunk && onNavigate(nextChunk.id)}
                disabled={!nextChunk || isChunkLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-[14px] font-black text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Chunk sau
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-[14px] border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-5 text-[15px] font-black text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)] active:scale-95"
            >
              Đóng
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MetadataSection({
  selectedChunk,
  layout = "grid",
}: {
  selectedChunk: RagChunkDetail;
  layout?: "grid" | "stack";
}) {
  const primaryMetadata = [
    {
      label: "Vị trí chunk",
      value: `Chunk #${selectedChunk.chunkIndex + 1}`,
      helper: "Thứ tự đoạn trong tài liệu",
      tone: "cyan" as const,
    },
    {
      label: "Quyền truy cập",
      value: selectedChunk.accessLevel === "BASIC" ? "Cơ bản" : "Nâng cao",
      helper:
        selectedChunk.accessLevel === "BASIC"
          ? "Người dùng thường có thể truy xuất"
          : "Dữ liệu chuyên sâu hoặc kỹ thuật",
      tone: "amber" as const,
    },
    {
      label: "Số ký tự",
      value: `${selectedChunk.charCount ?? 0}`,
      helper: "Độ dài văn bản",
      tone: "slate" as const,
    },
    {
      label: "Số tokens",
      value: `${selectedChunk.tokenCount ?? 0}`,
      helper: "Ước lượng xử lý AI",
      tone: "slate" as const,
    },
  ];

  const contextMetadata = [
    {
      label: "Trang tài liệu",
      value:
        selectedChunk.pageNumber != null
          ? `Trang ${selectedChunk.pageNumber}`
          : "--",
    },
    {
      label: "Sheet Excel",
      value: selectedChunk.sheetName ? `Sheet ${selectedChunk.sheetName}` : "--",
    },
    {
      label: "Nhóm thiết bị",
      value: selectedChunk.category || "--",
    },
    {
      label: "Hãng",
      value: selectedChunk.brand || "--",
    },
    {
      label: "Mã thiết bị",
      value: selectedChunk.modelCode || "--",
    },
  ];

  const tags =
    selectedChunk.tags && selectedChunk.tags.length > 0
      ? selectedChunk.tags
      : [];

  const isStack = layout === "stack";

  return (
    <section
      className={
        isStack
          ? "space-y-6"
          : "rounded-[24px] border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5"
      }
    >
      {!isStack ? (
        <div className="flex flex-col gap-2 border-b border-[var(--admin-card-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="flex items-center gap-2 text-[14px] font-black uppercase tracking-[0.12em] text-[var(--admin-strong-text)]">
              <Info className="h-4 w-4 text-[var(--admin-accent)]" />
              Thông tin metadata
            </h4>

            <p className="mt-1 text-[13px] font-semibold text-[var(--admin-muted-text)]">
              Đã chia nhóm để dễ phân biệt thông tin chính, ngữ cảnh và thông tin
              phụ.
            </p>
          </div>

          <span className="w-fit rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 py-1 text-[12px] font-black uppercase tracking-[0.1em] text-[var(--admin-muted-text)]">
            Không gồm vector embedding
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
            <Info className="h-4 w-4 text-[var(--admin-accent)]" />
            Metadata
          </h4>
        </div>
      )}

      <div className={isStack ? "" : "mt-5"}>
        <p className="mb-3 text-[12px] font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
          Thông tin chính
        </p>

        <div
          className={
            isStack
              ? "grid grid-cols-2 gap-3"
              : "grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          }
        >
          {primaryMetadata.map((item) => (
            <PriorityMetadataCard
              key={item.label}
              label={item.label}
              value={item.value}
              helper={item.helper}
              tone={item.tone}
            />
          ))}
        </div>
      </div>

      <div className={isStack ? "" : "mt-6"}>
        <p className="mb-3 text-[12px] font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
          Ngữ cảnh tài liệu
        </p>

        <div
          className={
            isStack
              ? "grid grid-cols-2 gap-3"
              : "grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
          }
        >
          {contextMetadata.map((item) => (
            <CompactMetadataCard
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>

      <div
        className={
          isStack
            ? "space-y-3"
            : "mt-6 grid gap-3 xl:grid-cols-[1fr_260px_260px]"
        }
      >
        <div className="rounded-[18px] border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
          <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
            Tags
          </p>

          {tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[12px] font-bold text-cyan-700 dark:text-cyan-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[14px] font-semibold text-[var(--admin-muted-text)]">
              Chưa có tags
            </p>
          )}
        </div>

        <div className={isStack ? "grid grid-cols-2 gap-3" : "contents"}>
          <CompactMetadataCard
            label="Ngày tạo"
            value={formatDateTime(selectedChunk.createdAt)}
            large
          />

          <CompactMetadataCard
            label="Cập nhật cuối"
            value={formatDateTime(selectedChunk.updatedAt)}
            large
          />
        </div>
      </div>
    </section>
  );
}

function PriorityMetadataCard({
  label,
  value,
  helper,
  tone = "slate",
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "slate" | "cyan" | "amber";
}) {
  const toneClass = {
    slate: "border-slate-400/20 bg-slate-500/10 shadow-sm",
    cyan: "border-cyan-500 bg-cyan-800 shadow-sm",
    amber: "border-amber-500 bg-amber-800 shadow-sm",
  }[tone];

  const valueClass = {
    slate: "text-[var(--admin-strong-text)]",
    cyan: "text-cyan-100",
    amber: "text-amber-100",
  }[tone];

  const labelClass = {
    slate: "text-[var(--admin-muted-text)]",
    cyan: "text-cyan-200/80",
    amber: "text-amber-200/80",
  }[tone];

  const helperClass = {
    slate: "text-[var(--admin-subtle-text)]",
    cyan: "text-cyan-300/60",
    amber: "text-amber-300/60",
  }[tone];

  return (
    <div
      className={["min-h-[100px] rounded-[20px] border p-4 shadow-sm", toneClass].join(
        " ",
      )}
    >
      <p className={["text-[12px] font-black uppercase tracking-[0.14em]", labelClass].join(" ")}>
        {label}
      </p>

      <p
        className={[
          "mt-3 line-clamp-2 text-[20px] font-black leading-7",
          valueClass,
        ].join(" ")}
        title={value}
      >
        {value}
      </p>

      <p className={["mt-2 line-clamp-2 text-[13px] font-semibold leading-5", helperClass].join(" ")}>
        {helper}
      </p>
    </div>
  );
}

function CompactMetadataCard({
  label,
  value,
  large = false,
}: {
  label: string;
  value: string;
  large?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[18px] border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4",
        large ? "min-h-[92px]" : "min-h-[82px]",
      ].join(" ")}
    >
      <p className="text-[12px] font-black uppercase tracking-[0.13em] text-[var(--admin-muted-text)]">
        {label}
      </p>

      <p
        className="mt-2 truncate text-[15px] font-black text-[var(--admin-strong-text)]"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function ChunkListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 p-5 sm:p-6 lg:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-52 animate-pulse rounded-[20px] bg-[var(--admin-card-bg)]"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-14 text-center sm:px-8">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-[var(--admin-card-bg)] text-[var(--admin-muted-text)]">
        <FileSearch className="h-8 w-8" />
      </div>

      <p className="mt-5 text-[22px] font-black text-[var(--admin-strong-text)]">
        Không tìm thấy chunk phù hợp
      </p>

      <p className="mx-auto mt-2 max-w-xl text-[15px] font-semibold leading-7 text-[var(--admin-muted-text)]">
        Thử từ khóa khác hoặc reindex lại tài liệu nếu chunk chưa được tạo đúng.
      </p>
    </div>
  );
}

function IconBox({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "cyan";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-500/35 bg-cyan-500/15 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
      : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)]";

  return (
    <span
      className={[
        "grid h-12 w-12 shrink-0 place-items-center rounded-[18px] border",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
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
    slate:
      "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]",
    cyan: "border-cyan-500/35 bg-cyan-500/15 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-500/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
    green:
      "border-emerald-500/35 bg-emerald-500/15 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-400/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-500/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    red: "border-red-500/35 bg-red-500/15 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-red-400/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-red-500/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
  }[tone];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-bold",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
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