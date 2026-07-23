"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  Archive,
  Eye,
  FileText,
  Layers3,
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

  if (isLoading) {
    return (
      <section className="admin-card rounded-3xl p-6">
        <div className="space-y-4">
          <div className="h-12 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
          <div className="h-28 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
          <div className="h-28 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
        </div>
      </section>
    );
  }

  if (documents.length === 0) {
    return (
      <section className="admin-card flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-dashed p-8 text-center">
        <span className="rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 px-5 py-2.5 text-base font-bold text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFB366]">
          0 tài liệu
        </span>
        <h2 className="mt-5 text-2xl font-bold text-[var(--admin-strong-text)]">
          Chưa có tài liệu phù hợp
        </h2>
        <p className="mt-3 max-w-xl text-[15px] font-medium leading-7 text-[var(--admin-muted-text)]">
          Hãy import TXT, MD, CSV, DOCX, XLSX hoặc PDF text để hệ thống tạo
          chunk và embedding cho kho tri thức.
        </p>
      </section>
    );
  }

  return (
    <section className="admin-card overflow-visible rounded-3xl">
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

      <div className="hidden xl:block">
        <div className="grid grid-cols-[0.5fr_minmax(0,2.2fr)_0.8fr_1fr_1.2fr_1fr_1.6fr] items-center gap-4 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
          <div>ID</div>
          <div>Tài liệu</div>
          <div>File</div>
          <div>Trạng thái</div>
          <div>Phân loại</div>
          <div>Truy cập</div>
          <div className="text-right">Thao tác</div>
        </div>

        <div className="divide-y divide-[var(--admin-card-border)]">
          {documents.map((document) => (
            <div
              key={document.id}
              className="grid grid-cols-[0.5fr_minmax(0,2.2fr)_0.8fr_1fr_1.2fr_1fr_1.6fr] items-center gap-4 px-6 py-5 transition-all duration-200 ease-in-out hover:bg-[var(--admin-control-hover-bg)]"
            >
              <span className="font-mono text-[15px] font-bold text-[var(--admin-strong-text)]">
                #{document.id}
              </span>

              <div className="min-w-0">
                <p className="truncate text-[16px] font-bold leading-6 text-[var(--admin-strong-text)]" title={document.title}>
                  {document.title}
                </p>
                <p className="mt-1 truncate text-[14px] font-semibold text-[var(--admin-muted-text)]" title={document.originalFileName || ""}>
                  {document.originalFileName || document.source || "Chưa có nguồn"}
                </p>
              </div>

              <div className="flex items-center">
                <FileTypeBadge type={document.fileType} />
              </div>

              <div className="flex items-center">
                <StatusBadge status={document.status} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-[var(--admin-strong-text)]">
                  {document.category || "Chưa phân loại"}
                </p>
              </div>

              <div className="flex items-center">
                <AccessBadge level={document.accessLevel} />
              </div>

              <div className="relative flex min-w-0 items-center justify-end gap-2">
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

                <div className="relative z-50">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(activeMenuId === document.id ? null : document.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition-all duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] active:scale-95"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {activeMenuId === document.id && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
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
              <StatusBadge status={document.status} />
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
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-1.5 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
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
    </section>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  variant = "default",
}: {
  label: string;
  icon: ReactNode;
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
        "inline-flex h-10 min-w-[92px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-3 text-[14px] font-extrabold leading-none transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95",
        variant === "danger"
          ? "border-red-500/30 bg-red-500/10 text-[var(--admin-error)] hover:bg-red-500/15"
          : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]",
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
}: {
  status: RagDocumentListItem["status"];
}) {
  const toneClass = {
    READY:
      "border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/20",
    FAILED:
      "border-rose-600 bg-rose-600 text-white shadow-rose-600/20",
    ARCHIVED:
      "border-slate-500 bg-slate-600 text-white shadow-slate-600/20",
    UPLOADED:
      "border-sky-600 bg-sky-600 text-white shadow-sky-600/20",
    PARSING:
      "border-sky-600 bg-sky-600 text-white shadow-sky-600/20",
    CHUNKING:
      "border-amber-500 bg-amber-500 text-white shadow-amber-500/20",
    EMBEDDING:
      "border-violet-600 bg-violet-600 text-white shadow-violet-600/20",
  }[status];

  return (
    <span
      className={[
        "inline-flex h-9 items-center rounded-full border px-3 text-xs font-black shadow-sm",
        toneClass,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function AccessBadge({
  level,
}: {
  level: RagDocumentListItem["accessLevel"];
}) {
  return (
    <span
      className={[
        "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] font-bold",
        level === "BASIC"
          ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
          : "border-[#FF7A00]/35 bg-[#FF7A00]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFB366]",
      ].join(" ")}
    >
      <ShieldCheck className="h-4.5 w-4.5" />
      {level === "BASIC" ? "Cơ bản" : "Nâng cao"}
    </span>
  );
}

function FileTypeBadge({ type }: { type: RagDocumentListItem["fileType"] }) {
  const meta = getFileTypeMeta(type);

  return (
    <span
      className={[
        "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-black shadow-sm",
        meta.className,
      ].join(" ")}
    >
      <span className="grid h-5 min-w-5 place-items-center rounded-md bg-white/90 text-[10px] font-black leading-none text-[#111827]">
        {meta.mark}
      </span>
      {type}
    </span>
  );
}

function getFileTypeMeta(type: RagDocumentListItem["fileType"]) {
  if (type === "PDF") {
    return {
      mark: "PDF",
      className:
        "border-rose-600 bg-rose-600 text-white shadow-rose-600/20",
    };
  }

  if (type === "DOCX") {
    return {
      mark: "W",
      className:
        "border-blue-600 bg-blue-600 text-white shadow-blue-600/20",
    };
  }

  return {
    mark: <FileText className="h-3.5 w-3.5" />,
    className:
      "border-slate-500 bg-slate-600 text-white shadow-slate-600/20",
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
