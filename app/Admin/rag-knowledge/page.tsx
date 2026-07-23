"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  DatabaseZap,
  FileText,
  RefreshCcw,
  Upload,
  type LucideIcon,
} from "lucide-react";

import { useRagKnowledgeApi } from "@/app/hooks/useRagKnowledgeApi";
import { Pagination } from "@/app/components/Pagination";

import AdminShell from "../dashboard/components/Action/AdminShell";
import ChunkViewerPanel from "./components/ChunkViewerPanel";
import DocumentLifecycleGrid from "./components/DocumentLifecycleGrid";
import KnowledgeActionDrawer from "./components/KnowledgeActionDrawer";
import { RagKnowledgeFormModal } from "./components/RagKnowledgeFormModal";
import type {
  RagChunkDetail,
  RagDocumentChunksResponse,
  RagDocumentDetail,
  RagDocumentListItem,
  UpdateRagDocumentFormValues,
} from "./types/ragKnowledge.types";

const PAGE_SIZE = 5;

export default function RagKnowledgePage() {
  const {
    documents,
    stats,
    isLoading,
    isMutating,
    error,
    refetch,
    clearError,
    getDocumentDetail,
    getDocumentChunks,
    getChunkDetail,
    importDocument,
    suggestImportMetadata,
    updateDocument,
    archiveDocument,
    reindexDocument,
    deleteDocument,
  } = useRagKnowledgeApi();

  const [drawerMode, setDrawerMode] = useState<"import" | "detail">("import");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedDocumentDetail, setSelectedDocumentDetail] =
    useState<RagDocumentDetail | null>(null);
  const [documentActivityMap, setDocumentActivityMap] = useState<
    Record<number, boolean>
  >({});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [accessFilter, setAccessFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const [activeChunkDocument, setActiveChunkDocument] =
    useState<RagDocumentListItem | null>(null);
  const [activeChunkDocumentDetail, setActiveChunkDocumentDetail] =
    useState<RagDocumentDetail | null>(null);
  const [chunkData, setChunkData] = useState<RagDocumentChunksResponse | null>(
    null,
  );
  const [chunkSearch, setChunkSearch] = useState("");
  const [chunkLoading, setChunkLoading] = useState(false);
  const [chunkDetailLoading, setChunkDetailLoading] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<RagChunkDetail | null>(
    null,
  );
  const [busyDocumentId, setBusyDocumentId] = useState<number | null>(null);
  const chunkPanelRef = useRef<HTMLDivElement | null>(null);

  // States cho modal chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDocumentDetail, setEditDocumentDetail] = useState<RagDocumentDetail | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const mergedDocuments = useMemo(
    () =>
      documents.map((document) => ({
        ...document,
        isActive: documentActivityMap[document.id] ?? document.isActive ?? true,
      })),
    [documentActivityMap, documents],
  );

  const filteredDocuments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return mergedDocuments.filter((document) => {
      const matchesKeyword =
        !keyword ||
        document.title.toLowerCase().includes(keyword) ||
        (document.contentPreview || "").toLowerCase().includes(keyword) ||
        (document.category || "").toLowerCase().includes(keyword) ||
        (document.brand || "").toLowerCase().includes(keyword) ||
        (document.modelCode || "").toLowerCase().includes(keyword) ||
        (document.originalFileName || "").toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || document.status === statusFilter;
      const matchesAccess =
        accessFilter === "ALL" || document.accessLevel === accessFilter;

      return matchesKeyword && matchesStatus && matchesAccess;
    });
  }, [accessFilter, mergedDocuments, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedDocuments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDocuments.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredDocuments]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleOpenImport = () => {
    clearError();
    setDetailError(null);
    setSelectedDocumentDetail(null);
    setDrawerMode("import");
    setIsDrawerOpen(true);
  };

  const handleOpenDetail = async (document: RagDocumentListItem) => {
    setDrawerMode("detail");
    setIsDrawerOpen(true);
    setDetailLoading(true);
    setDetailError(null);

    try {
      const detail = await getDocumentDetail(document.id);
      setSelectedDocumentDetail(detail);
      setDocumentActivityMap((prev) => ({ ...prev, [detail.id]: detail.isActive }));
    } catch (nextError) {
      setSelectedDocumentDetail(null);
      setDetailError(
        (nextError as { message?: string }).message ||
          "Không thể tải chi tiết tài liệu.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // Mở modal chỉnh sửa thông tin tài liệu RAG
  const handleOpenEdit = async (document: RagDocumentListItem) => {
    setEditDocumentDetail(null);
    setIsEditModalOpen(true);
    setEditSubmitting(true);
    try {
      const detail = await getDocumentDetail(document.id);
      setEditDocumentDetail(detail);
    } catch {
      alert("Không thể tải thông tin chi tiết tài liệu để chỉnh sửa.");
      setIsEditModalOpen(false);
    } finally {
      setEditSubmitting(false);
    }
  };

  // Submit thông tin chỉnh sửa tài liệu RAG
  const handleSubmitEdit = async (values: UpdateRagDocumentFormValues) => {
    if (!editDocumentDetail) return;
    setEditSubmitting(true);
    try {
      await updateDocument(editDocumentDetail.id, values);
      setIsEditModalOpen(false);
      setEditDocumentDetail(null);
      void refetch();
    } catch (err) {
      alert((err as { message?: string }).message || "Không thể cập nhật tài liệu.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const loadChunks = async (
    document: RagDocumentListItem,
    next: { page?: number; search?: string } = {},
  ) => {
    setActiveChunkDocument(document);
    setChunkLoading(true);

    const nextSearch = next.search ?? chunkSearch;
    const currentDetail =
      selectedDocumentDetail?.id === document.id
        ? selectedDocumentDetail
        : activeChunkDocumentDetail?.id === document.id
          ? activeChunkDocumentDetail
          : null;

    try {
      const [response, detail] = await Promise.all([
        getDocumentChunks(document.id, {
          page: next.page ?? chunkData?.pagination.page ?? 1,
          limit: 10,
          search: nextSearch || undefined,
        }),
        currentDetail
          ? Promise.resolve(currentDetail)
          : getDocumentDetail(document.id),
      ]);

      setChunkData(response);
      setChunkSearch(nextSearch);
      setSelectedChunk(null);
      setActiveChunkDocumentDetail(detail);
    } catch {
      setChunkData(null);
      setActiveChunkDocumentDetail(null);
    } finally {
      setChunkLoading(false);
    }
  };

  const handleOpenChunks = async (document: RagDocumentListItem) => {
    await loadChunks(document, { page: 1, search: "" });
    window.requestAnimationFrame(() => {
      chunkPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleViewChunkDetail = async (chunkId: number) => {
    setChunkDetailLoading(true);

    try {
      const detail = await getChunkDetail(chunkId);
      setSelectedChunk(detail);
    } finally {
      setChunkDetailLoading(false);
    }
  };

  const handleImport = async (formData: FormData) => {
    try {
      await importDocument(formData);
      setIsDrawerOpen(false);
    } catch {
      // Hook đã cập nhật state error cho UI, không cần ném lỗi lên runtime overlay.
    }
  };

  const refreshDetailIfNeeded = async (documentId: number) => {
    if (selectedDocumentDetail?.id === documentId) {
      const detail = await getDocumentDetail(documentId);
      setSelectedDocumentDetail(detail);
      setDocumentActivityMap((prev) => ({ ...prev, [detail.id]: detail.isActive }));
    }
  };

  const refreshChunksIfNeeded = async (documentId: number) => {
    if (activeChunkDocument?.id === documentId) {
      await loadChunks(activeChunkDocument, {
        page: chunkData?.pagination.page ?? 1,
        search: chunkSearch,
      });
    }
  };

  const runDocumentAction = async (
    documentId: number,
    action: () => Promise<void>,
  ) => {
    setBusyDocumentId(documentId);
    try {
      await action();
      await Promise.all([
        refreshDetailIfNeeded(documentId),
        refreshChunksIfNeeded(documentId),
      ]);
    } finally {
      setBusyDocumentId(null);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <section className="admin-card rounded-3xl px-5 py-5 sm:px-6 lg:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--admin-accent)]">
                Quản lý tài liệu cho AI
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
                Kho tri thức AI
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[var(--admin-muted-text)]">
                Tải tài liệu lên để AI tra cứu khi trả lời khách hàng. Bạn có thể theo dõi quá trình xử lý tài liệu, xem các đoạn nội dung đã tách và kiểm tra tài liệu nào đang dùng được.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
              >
                <RefreshCcw className="h-4 w-4" />
                Làm mới
              </button>
              <button
                type="button"
                onClick={handleOpenImport}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105"
              >
                <Upload className="h-4 w-4" />
                Thêm tài liệu
              </button>
            </div>
          </div>
        </section>

        {stats ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <KpiCard
              label="Tổng tài liệu"
              value={stats.totalDocuments}
              tone="orange"
            />
            <KpiCard label="Sẵn sàng dùng" value={stats.readyDocuments} tone="green" />
            <KpiCard label="Lỗi xử lý" value={stats.failedDocuments} tone="red" />
            <KpiCard label="Đoạn nội dung" value={stats.totalChunks} tone="cyan" />
            <KpiCard
              label="Đã lưu trữ"
              value={stats.archivedDocuments}
              tone="slate"
            />
          </section>
        ) : null}

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-semibold text-[var(--admin-error)]">
              {error.message}
            </p>
          </section>
        ) : null}

        <section className="admin-card rounded-3xl p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--admin-strong-text)]">
                Tìm tài liệu
              </span>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Tìm theo tên tài liệu, tên file, nhóm thiết bị hoặc hãng"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--admin-strong-text)]">
                Trạng thái xử lý
              </span>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="ALL">Tất cả</option>
                <option value="UPLOADED">Đã tải lên</option>
                <option value="PARSING">Đang đọc nội dung</option>
                <option value="CHUNKING">Đang chia đoạn</option>
                <option value="EMBEDDING">Đang tạo dữ liệu cho AI</option>
                <option value="READY">Sẵn sàng sử dụng</option>
                <option value="FAILED">Xử lý lỗi</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--admin-strong-text)]">
                Đối tượng được xem
              </span>
              <select
                value={accessFilter}
                onChange={(event) => {
                  setAccessFilter(event.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="ALL">Tất cả</option>
                <option value="BASIC">Ai cũng xem được</option>
                <option value="ADVANCED">Chỉ kỹ thuật viên</option>
              </select>
            </label>
          </div>
        </section>

        <DocumentLifecycleGrid
          documents={pagedDocuments}
          total={filteredDocuments.length}
          isLoading={isLoading}
          busyDocumentId={busyDocumentId}
          onViewDetail={(document) => void handleOpenDetail(document)}
          onViewChunks={(document) => void handleOpenChunks(document)}
          onEdit={(document) => void handleOpenEdit(document)}
          onToggleArchive={(document, isActive) =>
            runDocumentAction(document.id, async () => {
              await archiveDocument(document.id, isActive);
              setDocumentActivityMap((prev) => ({
                ...prev,
                [document.id]: isActive,
              }));
            })
          }
          onReindex={(document) =>
            runDocumentAction(document.id, async () => {
              await reindexDocument(document.id);
            })
          }
          onDelete={(document) =>
            runDocumentAction(document.id, async () => {
              await deleteDocument(document.id);
              if (selectedDocumentDetail?.id === document.id) {
                setIsDrawerOpen(false);
                setSelectedDocumentDetail(null);
              }
              if (activeChunkDocument?.id === document.id) {
                setActiveChunkDocument(null);
                setActiveChunkDocumentDetail(null);
                setChunkData(null);
                setSelectedChunk(null);
                setChunkSearch("");
              }
            })
          }
        />

        {!error && !isLoading && filteredDocuments.length > 0 ? (
          <section className="admin-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--admin-muted-text)]">
              Hiển thị{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              -{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {Math.min(currentPage * PAGE_SIZE, filteredDocuments.length)}
              </span>{" "}
              trong{" "}
              <span className="font-black text-[var(--admin-strong-text)]">
                {filteredDocuments.length}
              </span>{" "}
              tài liệu
            </p>

            <div className="min-w-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                compact
              />
            </div>
          </section>
        ) : null}

        <div ref={chunkPanelRef} className="scroll-mt-5">
          <ChunkViewerPanel
            key={activeChunkDocument?.id ?? "chunk-panel"}
            open={Boolean(activeChunkDocument)}
            document={activeChunkDocument}
            documentDetail={activeChunkDocumentDetail}
            data={chunkData}
            selectedChunk={selectedChunk}
            isLoading={chunkLoading}
            isChunkLoading={chunkDetailLoading}
            searchValue={chunkSearch}
            onClose={() => {
              setActiveChunkDocument(null);
              setActiveChunkDocumentDetail(null);
              setChunkData(null);
              setSelectedChunk(null);
              setChunkSearch("");
            }}
            onCloseChunkDetail={() => {
              setSelectedChunk(null);
            }}
            onSearch={(value) => {
              if (activeChunkDocument) {
                void loadChunks(activeChunkDocument, { page: 1, search: value });
              }
            }}
            onPageChange={(page) => {
              if (activeChunkDocument) {
                void loadChunks(activeChunkDocument, { page });
              }
            }}
            onViewChunk={(chunkId) => void handleViewChunkDetail(chunkId)}
          />
        </div>

        <KnowledgeActionDrawer
          key={`${drawerMode}-${isDrawerOpen ? selectedDocumentDetail?.id ?? "new" : "closed"}`}
          open={isDrawerOpen}
          mode={drawerMode}
          detail={selectedDocumentDetail}
          isLoading={detailLoading}
          isSubmitting={isMutating && drawerMode === "import"}
          errorMessage={detailError || error?.message || null}
          onClose={() => {
            setIsDrawerOpen(false);
            setDetailError(null);
          }}
          onSubmitImport={(formData) => void handleImport(formData)}
          onSuggestMetadata={(file) => suggestImportMetadata(file)}
          onOpenChunks={(documentId) => {
            const target = mergedDocuments.find((item) => item.id === documentId);
            if (target) {
              void loadChunks(target, { page: 1, search: "" });
            }
          }}
        />

        {/* Modal chỉnh sửa RAG document */}
        <RagKnowledgeFormModal
          open={isEditModalOpen}
          document={editDocumentDetail}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditDocumentDetail(null);
          }}
          onSubmit={handleSubmitEdit}
          isSubmitting={editSubmitting}
        />
      </div>
    </AdminShell>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "orange" | "green" | "red" | "cyan" | "slate";
}) {
  const toneClasses = {
    orange: {
      icon: FileText,
      iconClassName:
        "border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
      accentClassName: "bg-[#FF7A00]",
    },
    green: {
      icon: CheckCircle2,
      iconClassName:
        "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
      accentClassName: "bg-[#22C55E]",
    },
    red: {
      icon: AlertTriangle,
      iconClassName:
        "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
      accentClassName: "bg-[#EF4444]",
    },
    cyan: {
      icon: DatabaseZap,
      iconClassName:
        "border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
      accentClassName: "bg-[#06B6D4]",
    },
    slate: {
      icon: Archive,
      iconClassName:
        "border-[#64748B]/25 bg-[#64748B]/10 text-[#475569] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]",
      accentClassName: "bg-[#64748B]",
    },
  } satisfies Record<
    typeof tone,
    {
      icon: LucideIcon;
      iconClassName: string;
      accentClassName: string;
    }
  >;
  const toneConfig = toneClasses[tone];
  const Icon = toneConfig.icon;

  return (
    <section className="admin-card group relative min-h-[112px] overflow-hidden rounded-2xl p-5 transition-colors duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]">
      <span
        aria-hidden="true"
        className={["absolute inset-x-0 top-0 h-1", toneConfig.accentClassName].join(" ")}
      />

      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-5 text-[var(--admin-strong-text)]">
            {label}
          </p>

          <p className="mt-3 text-4xl font-extrabold leading-none tracking-tight text-[var(--admin-strong-text)]">
            {new Intl.NumberFormat("vi-VN").format(value)}
          </p>
        </div>

        <div
          className={["flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border", toneConfig.iconClassName].join(" ")}
        >
          <Icon className="h-5 w-5" strokeWidth={2.3} />
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";
