"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  DatabaseZap,
  Eye,
  FileText,
  Layers3,
  MessageSquareText,
  MoreVertical,
  Pencil,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Undo2,
} from "lucide-react";

import type { RagDocumentListItem } from "../../types/ragKnowledge.types";

type Props = {
  documents: RagDocumentListItem[];
  total: number;
  isLoading?: boolean;
  busyDocumentId?: number | null;
  onViewDetail: (document: RagDocumentListItem) => void;
  onViewChunks: (document: RagDocumentListItem) => void;
  onEdit: (document: RagDocumentListItem) => void;
  onToggleArchive: (
    document: RagDocumentListItem,
    isActive: boolean,
  ) => Promise<void> | void;
  onReindex: (document: RagDocumentListItem) => Promise<void> | void;
  onDelete: (document: RagDocumentListItem) => Promise<void> | void;
};

export default function DocumentLifecycleGrid({
  documents,
  total,
  isLoading = false,
  busyDocumentId,
  onViewDetail,
  onViewChunks,
  onEdit,
  onToggleArchive,
  onReindex,
  onDelete,
}: Props) {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  return (
    <section className="admin-card overflow-visible rounded-3xl min-h-[380px] transition-all duration-200">
      {/* Click outside overlay */}
      {activeMenuId !== null && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setActiveMenuId(null)}
        />
      )}

      <header className="flex flex-col gap-3 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--admin-strong-text)]">
            Vòng đời tài liệu RAG
          </h2>
          <p className="mt-1.5 text-[15px] font-semibold text-[var(--admin-muted-text)]">
            Theo dõi trạng thái parse, chunk, embedding và thao tác quản trị.
          </p>
        </div>

        <span className="inline-flex h-11 items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-5 text-[15px] font-bold text-[var(--admin-strong-text)]">
          {total} tài liệu
        </span>
      </header>

      {isLoading ? (
        <div className="p-6 space-y-4">
          <div className="h-16 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
          <div className="h-16 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
          <div className="h-16 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
        </div>
      ) : documents.length === 0 ? (
        <div>
          <div className="hidden xl:grid grid-cols-[0.5fr_minmax(0,2.2fr)_0.8fr_1fr_1.2fr_1fr_1.6fr] items-center gap-4 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
            <div>ID</div>
            <div>Tài liệu</div>
            <div>File</div>
            <div>Trạng thái</div>
            <div>Phân loại</div>
            <div>Truy cập</div>
            <div className="text-right">Thao tác</div>
          </div>
          <div className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center">
            <span className="rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 px-4 py-2 text-sm font-bold text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFB366]">
              0 tài liệu phù hợp
            </span>
            <h3 className="mt-4 text-xl font-bold text-[var(--admin-strong-text)]">
              Không tìm thấy tài liệu phù hợp
            </h3>
            <p className="mt-2 max-w-md text-sm font-medium leading-6 text-[var(--admin-muted-text)]">
              Hãy kiểm tra lại từ khóa tìm kiếm hoặc chọn lại bộ lọc trạng thái / đối tượng xem.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden xl:block">
            <div className="grid grid-cols-[0.5fr_minmax(0,2.2fr)_0.8fr_1fr_1.2fr_1fr_1.6fr] items-center gap-4 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
              <div>ID</div>
              <div>Tài liệu</div>
              <div className="text-center">File</div>
              <div className="text-center">Trạng thái</div>
              <div className="text-center">Phân loại</div>
              <div className="text-center">Truy cập</div>
              <div className="text-right">Thao tác</div>
            </div>

            <div className="divide-y divide-[var(--admin-card-border)]">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className={[
                    "grid grid-cols-[0.5fr_minmax(0,2.2fr)_0.8fr_1fr_1.2fr_1fr_1.6fr] items-center gap-4 px-6 py-5 transition-all duration-200 ease-in-out hover:bg-[var(--admin-control-hover-bg)]",
                    activeMenuId === document.id ? "relative z-50" : "relative z-10",
                  ].join(" ")}
                >
                  <span className="font-mono text-[15px] font-bold text-[var(--admin-strong-text)]">
                    #{document.id}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-extrabold leading-6 text-[var(--admin-strong-text)]" title={document.title}>
                      {document.title}
                    </p>
                    <p className="mt-1 truncate text-[14px] font-bold text-[var(--admin-muted-text)]" title={document.originalFileName || ""}>
                      {document.originalFileName || document.source || "Chưa có nguồn"}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <FileTypeBadge type={document.fileType} source={document.source} />
                  </div>

                  <div className="flex items-center justify-center">
                    <StatusBadge status={document.status} isActive={document.isActive} />
                  </div>

                  <div className="min-w-0 text-center">
                    <p className="truncate text-[16px] font-extrabold text-[var(--admin-strong-text)]">
                      {document.category || "Chưa phân loại"}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <AccessBadge level={document.accessLevel} />
                  </div>

                  <div className="relative flex min-w-0 items-center justify-end gap-2">
                    <ActionButton
                      label="Chi tiết"
                      icon={<Eye className="h-4.5 w-4.5" />}
                      tone="sky"
                      onClick={() => onViewDetail(document)}
                    />
                    <ActionButton
                      label="Chunks"
                      icon={<Layers3 className="h-4.5 w-4.5" />}
                      tone="amber"
                      onClick={() => onViewChunks(document)}
                    />

                    <div className="relative z-50">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === document.id ? null : document.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition-all duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] active:scale-95"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {activeMenuId === document.id && (
                        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[var(--admin-card-border)] bg-slate-900 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <DropdownItem
                            label="Sửa thông tin"
                            icon={<Pencil className="h-4.5 w-4.5 text-[var(--admin-muted-text)]" />}
                            onClick={() => {
                              setActiveMenuId(null);
                              onEdit(document);
                            }}
                          />
                          <DropdownItem
                            label="Reindex embedding"
                            icon={<RefreshCcw className="h-4.5 w-4.5 text-cyan-500" />}
                            disabled={busyDocumentId === document.id}
                            onClick={() => {
                              setActiveMenuId(null);
                              if (
                                window.confirm(
                                  `Reindex lại toàn bộ chunk cho "${document.title}"?`,
                                )
                              ) {
                                void onReindex(document);
                              }
                            }}
                          />
                          <DropdownItem
                            label={document.isActive === false ? "Mở lại tài liệu" : "Lưu trữ tài liệu"}
                            icon={
                              document.isActive === false ? (
                                <Undo2 className="h-4.5 w-4.5 text-amber-500" />
                              ) : (
                                <Archive className="h-4.5 w-4.5 text-amber-500" />
                              )
                            }
                            disabled={busyDocumentId === document.id}
                            onClick={() => {
                              setActiveMenuId(null);
                              const confirmed = window.confirm(
                                document.isActive === false
                                  ? `Mở lại tài liệu "${document.title}"?`
                                  : `Archive tài liệu "${document.title}"?`,
                              );
                              if (confirmed) {
                                void onToggleArchive(document, document.isActive === false);
                              }
                            }}
                          />
                          <div className="my-1.5 border-t border-[var(--admin-card-border)]" />
                          <DropdownItem
                            label="Xóa tài liệu"
                            icon={<Trash2 className="h-4.5 w-4.5 text-red-500" />}
                            variant="danger"
                            disabled={busyDocumentId === document.id}
                            onClick={() => {
                              setActiveMenuId(null);
                              if (
                                window.confirm(
                                  `Xóa vĩnh viễn tài liệu "${document.title}" khỏi kho tri thức?`,
                                )
                              ) {
                                void onDelete(document);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[var(--admin-card-border)] xl:hidden">
            {documents.map((document) => (
              <article key={document.id} className="px-5 py-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-bold leading-7 text-[var(--admin-strong-text)]">
                      {document.title}
                    </p>
                    <p className="mt-1 truncate text-[14px] font-semibold text-[var(--admin-muted-text)]">
                      {document.originalFileName || document.source || "Chưa có nguồn"}
                    </p>
                  </div>
                  <StatusBadge status={document.status} isActive={document.isActive} />
                </div>

                <div className="mt-4 grid gap-2.5 rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
                  <MobileInfo label="File" value={<FileTypeBadge type={document.fileType} />} />
                  <MobileInfo
                    label="Phân loại"
                    value={document.category || "Chưa phân loại"}
                  />
                  <MobileInfo
                    label="Brand/Model"
                    value={`${document.brand || "--"} / ${document.modelCode || "--"}`}
                  />
                  <MobileInfo label="Quyền" value={document.accessLevel} />
                  <MobileInfo label="Chunks" value={String(document.totalChunks)} />
                  <MobileInfo
                    label="Indexed"
                    value={formatDateTime(document.indexedAt)}
                  />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <ActionButton
                    label="Chi tiết"
                    icon={<Eye className="h-4.5 w-4.5" />}
                    onClick={() => onViewDetail(document)}
                  />
                  <ActionButton
                    label="Chunks"
                    icon={<Layers3 className="h-4.5 w-4.5" />}
                    onClick={() => onViewChunks(document)}
                  />

                  <div className="relative z-50 ml-auto">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(activeMenuId === document.id ? null : document.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition-all duration-150 hover:bg-[var(--admin-control-hover-bg)] active:scale-95"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {activeMenuId === document.id && (
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[var(--admin-card-border)] bg-slate-900 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <DropdownItem
                          label="Sửa thông tin"
                          icon={<Pencil className="h-4.5 w-4.5 text-[var(--admin-muted-text)]" />}
                          onClick={() => {
                            setActiveMenuId(null);
                            onEdit(document);
                          }}
                        />
                        <DropdownItem
                          label="Reindex embedding"
                          icon={<RefreshCcw className="h-4.5 w-4.5 text-cyan-500" />}
                          disabled={busyDocumentId === document.id}
                          onClick={() => {
                            setActiveMenuId(null);
                            if (
                              window.confirm(
                                `Reindex lại toàn bộ chunk cho "${document.title}"?`,
                              )
                            ) {
                              void onReindex(document);
                            }
                          }}
                        />
                        <DropdownItem
                          label={document.isActive === false ? "Mở lại tài liệu" : "Lưu trữ tài liệu"}
                          icon={
                            document.isActive === false ? (
                              <Undo2 className="h-4.5 w-4.5 text-amber-500" />
                            ) : (
                              <Archive className="h-4.5 w-4.5 text-amber-500" />
                            )
                          }
                          disabled={busyDocumentId === document.id}
                          onClick={() => {
                            setActiveMenuId(null);
                            const confirmed = window.confirm(
                              document.isActive === false
                                ? `Mở lại tài liệu "${document.title}"?`
                                : `Archive tài liệu "${document.title}"?`,
                            );
                            if (confirmed) {
                              void onToggleArchive(document, document.isActive === false);
                            }
                          }}
                        />
                        <div className="my-1 border-t border-[var(--admin-card-border)]" />
                        <DropdownItem
                          label="Xóa tài liệu"
                          icon={<Trash2 className="h-4.5 w-4.5 text-red-500" />}
                          variant="danger"
                          disabled={busyDocumentId === document.id}
                          onClick={() => {
                            setActiveMenuId(null);
                            if (
                              window.confirm(
                                `Xóa vĩnh viễn tài liệu "${document.title}" khỏi kho tri thức?`,
                              )
                            ) {
                              void onDelete(document);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  tone = "default",
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "sky" | "amber" | "emerald" | "danger" | "default";
}) {
  const toneClass =
    tone === "sky"
      ? "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20"
      : tone === "amber"
        ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
        : tone === "emerald"
          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
          : tone === "danger"
            ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
            : "border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex h-10 min-w-[96px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-[14px] font-black leading-none shadow-sm transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95",
        toneClass,
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function DropdownItem({
  label,
  icon,
  onClick,
  disabled,
  variant = "default",
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-bold transition duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "danger"
          ? "text-[var(--admin-error)] hover:bg-red-500/10"
          : "text-[var(--admin-strong-text)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatusBadge({
  status,
  isActive,
}: {
  status: RagDocumentListItem["status"];
  isActive?: boolean;
}) {
  if (isActive === false || status === "ARCHIVED") {
    return (
      <span className="inline-flex h-8.5 w-[140px] items-center justify-center gap-1.5 rounded-full border border-slate-500 bg-slate-600 px-3 text-xs font-black text-white shadow-sm whitespace-nowrap shrink-0">
        <Archive className="h-3.5 w-3.5" />
        Đã lưu trữ
      </span>
    );
  }

  const statusConfig: Record<
    string,
    { label: string; toneClass: string; icon: React.ElementType }
  > = {
    READY: {
      label: "Hoạt động",
      toneClass: "border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/20",
      icon: CheckCircle2,
    },
    FAILED: {
      label: "Thất bại",
      toneClass: "border-rose-600 bg-rose-600 text-white shadow-rose-600/20",
      icon: AlertTriangle,
    },
    CANCELLED: {
      label: "Đã hủy",
      toneClass: "border-rose-600 bg-rose-600 text-white shadow-rose-600/20",
      icon: AlertTriangle,
    },
    ARCHIVED: {
      label: "Đã lưu trữ",
      toneClass: "border-slate-500 bg-slate-600 text-white shadow-slate-600/20",
      icon: Archive,
    },
    UPLOADED: {
      label: "Đã tải lên",
      toneClass: "border-sky-600 bg-sky-600 text-white shadow-sky-600/20",
      icon: DatabaseZap,
    },
    PARSING: {
      label: "Đang xử lý",
      toneClass: "border-sky-600 bg-sky-600 text-white shadow-sky-600/20",
      icon: RefreshCcw,
    },
    CHUNKING: {
      label: "Đang chia chunk",
      toneClass: "border-amber-500 bg-amber-500 text-white shadow-amber-500/20",
      icon: Layers3,
    },
    EMBEDDING: {
      label: "Đang tạo vector",
      toneClass: "border-violet-600 bg-violet-600 text-white shadow-violet-600/20",
      icon: RefreshCcw,
    },
  };

  const config = statusConfig[status] ?? {
    label: getVietnameseStatusLabel(status),
    toneClass: "border-slate-600 bg-slate-600 text-white",
    icon: CheckCircle2,
  };

  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex h-8.5 w-[140px] items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-black shadow-sm whitespace-nowrap shrink-0",
        config.toneClass,
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function AccessBadge({
  level,
}: {
  level: RagDocumentListItem["accessLevel"];
}) {
  const toneClass =
    level === "BASIC"
      ? "border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/20"
      : "border-amber-500 bg-amber-500 text-white shadow-amber-500/20";

  return (
    <span
      className={[
        "inline-flex h-8.5 w-[120px] items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-black shadow-sm whitespace-nowrap shrink-0",
        toneClass,
      ].join(" ")}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      {level === "BASIC" ? "Cơ bản" : "Nâng cao"}
    </span>
  );
}

function FileTypeBadge({ type, source }: { type: RagDocumentListItem["fileType"]; source?: string | null }) {
  const meta = getFileTypeMeta(type, source);

  return (
    <span
      className={[
        "inline-flex h-8.5 w-[140px] items-center justify-center gap-2 rounded-full border px-3 text-xs font-black shadow-sm whitespace-nowrap shrink-0",
        meta.className,
      ].join(" ")}
    >
      <span className="grid h-4.5 min-w-4.5 place-items-center rounded-md bg-white/90 text-[10px] font-black leading-none text-[#111827]">
        {meta.mark}
      </span>
      {meta.label}
    </span>
  );
}

function getFileTypeMeta(type: RagDocumentListItem["fileType"], source?: string | null) {
  const sourceUpper = (source || "").toUpperCase();
  const typeUpper = (type || "").toUpperCase();

  // 1. Phiên chat (Chat session)
  const isChatSession =
    sourceUpper.startsWith("CHAT_SESSION") ||
    (typeUpper === "UNKNOWN" && (sourceUpper.includes("CHAT") || !sourceUpper.includes(".")));

  if (isChatSession) {
    return {
      mark: <MessageSquareText className="h-3.5 w-3.5 text-cyan-600" />,
      label: "Phiên chat",
      className: "border-cyan-600 bg-cyan-600 text-white shadow-cyan-600/20",
    };
  }

  // 2. Word (DOCX / DOC)
  if (
    typeUpper === "DOCX" ||
    typeUpper === "DOC" ||
    sourceUpper.endsWith(".DOCX") ||
    sourceUpper.endsWith(".DOC")
  ) {
    return {
      mark: "W",
      label: "Word (DOCX)",
      className: "border-blue-600 bg-blue-600 text-white shadow-blue-600/20",
    };
  }

  // 3. PDF
  if (typeUpper === "PDF" || sourceUpper.endsWith(".PDF")) {
    return {
      mark: "PDF",
      label: "Tài liệu PDF",
      className: "border-rose-600 bg-rose-600 text-white shadow-rose-600/20",
    };
  }

  // 4. Excel / CSV (XLSX / XLS / CSV)
  if (
    typeUpper === "XLSX" ||
    typeUpper === "XLS" ||
    typeUpper === "CSV" ||
    sourceUpper.endsWith(".XLSX") ||
    sourceUpper.endsWith(".XLS") ||
    sourceUpper.endsWith(".CSV")
  ) {
    const isCsv = typeUpper === "CSV" || sourceUpper.endsWith(".CSV");
    return {
      mark: "X",
      label: isCsv ? "Bảng dữ liệu CSV" : "Excel (XLSX)",
      className: "border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/20",
    };
  }

  // 5. Plain Text & Markdown (TXT / MD)
  if (
    typeUpper === "TXT" ||
    typeUpper === "MD" ||
    sourceUpper.endsWith(".TXT") ||
    sourceUpper.endsWith(".MD")
  ) {
    const isMd = typeUpper === "MD" || sourceUpper.endsWith(".MD");
    return {
      mark: "T",
      label: isMd ? "Markdown (.md)" : "Văn bản (TXT)",
      className: "border-amber-500 bg-amber-500 text-slate-950 shadow-amber-500/20",
    };
  }

  // 6. JSON / Web / Code / HTML
  if (
    typeUpper === "JSON" ||
    typeUpper === "HTML" ||
    sourceUpper.endsWith(".JSON") ||
    sourceUpper.endsWith(".HTML")
  ) {
    const isHtml = typeUpper === "HTML" || sourceUpper.endsWith(".HTML");
    return {
      mark: "{ }",
      label: isHtml ? "Trang Web (HTML)" : "Dữ liệu JSON",
      className: "border-purple-600 bg-purple-600 text-white shadow-purple-600/20",
    };
  }

  // Fallback
  return {
    mark: <FileText className="h-3.5 w-3.5 text-slate-700" />,
    label: typeUpper !== "UNKNOWN" ? typeUpper : "Tài liệu",
    className: "border-slate-500 bg-slate-600 text-white shadow-slate-600/20",
  };
}

function MobileInfo({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
        {label}
      </span>
      <span className="flex justify-end text-right text-[14px] font-bold text-[var(--admin-strong-text)]">
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
  }).format(date);
}

function getVietnameseStatusLabel(status: string | null | undefined): string {
  if (!status) return "Chưa xác định";
  const s = status.toUpperCase();
  if (s === "CANCELLED" || s === "CANCELED") return "Đã hủy";
  if (s === "READY" || s === "COMPLETED" || s === "DONE" || s === "ACTIVE") return "Hoạt động";
  if (s === "FAILED" || s === "ERROR" || s === "REJECTED") return "Thất bại";
  if (s === "ARCHIVED") return "Đã lưu trữ";
  if (s === "PENDING" || s === "WAITING") return "Chờ xử lý";
  if (s === "PROCESSING" || s === "PARSING" || s === "IN_PROGRESS") return "Đang xử lý";
  if (s === "CHUNKING") return "Đang chia chunk";
  if (s === "EMBEDDING") return "Đang tạo vector";
  if (s === "UPLOADED") return "Đã tải lên";
  if (s === "CRITICAL") return "Khẩn cấp";
  if (s === "HIGH") return "Rủi ro cao";
  if (s === "MEDIUM") return "Theo dõi";
  if (s === "LOW") return "An toàn";
  return status;
}
