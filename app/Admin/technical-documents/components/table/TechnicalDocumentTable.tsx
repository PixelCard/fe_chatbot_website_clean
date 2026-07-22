"use client";

import { Eye, FileText, Pencil, ShieldCheck, Trash2 } from "lucide-react";

import { AdminDetailAction } from "../../../_shared/components/AdminDetailAction";
import { getAccessLevelLabel } from "../../lib/technicalDocumentHelpers";
import type { TechnicalDocumentItem } from "../../types/technicalDocument.types";

interface Props {
  data: TechnicalDocumentItem[];
  total: number;
  mode?: "default" | "rag";
  onViewDetail?: (document: TechnicalDocumentItem) => void;
  onEdit?: (document: TechnicalDocumentItem) => void;
  onDelete?: (document: TechnicalDocumentItem) => void | Promise<void>;
  isMutating?: boolean;
}

const DEFAULT_DETAIL_BASE_PATH = "/admin/technical-documents";

export default function TechnicalDocumentTable({
  data,
  total,
  mode = "default",
  onViewDetail,
  onEdit,
  onDelete,
  isMutating = false,
}: Props) {
  const handleViewDetail = (document: TechnicalDocumentItem) => {
    if (mode === "rag" && onViewDetail) {
      onViewDetail(document);
    }
  };

  if (data.length === 0) {
    return (
      <section className="admin-card flex min-h-[260px] flex-col items-center justify-center rounded-3xl border-dashed p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
          <FileText className="h-7 w-7" />
        </span>

        <h3 className="mt-4 text-xl font-black text-[var(--admin-strong-text)]">
          Không có tài liệu phù hợp
        </h3>

        <p className="mt-2 max-w-md text-[15px] font-medium leading-7 text-[var(--admin-muted-text)]">
          Hiện tại chưa có tài liệu kỹ thuật nào trong kho tri thức RAG.
        </p>
      </section>
    );
  }

  return (
    <section className="admin-card overflow-hidden rounded-3xl">
      <header className="flex flex-col gap-4 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
              <FileText className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-black tracking-tight text-[var(--admin-strong-text)] sm:text-2xl">
                Tài liệu kỹ thuật RAG
              </h2>

              <p className="mt-1 truncate text-[15px] font-semibold text-[var(--admin-muted-text)]">
                Danh sách tài liệu tri thức dùng cho hệ thống AI.
              </p>
            </div>
          </div>
        </div>

        <span className="inline-flex h-10 w-fit shrink-0 items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-4 text-[15px] font-black text-[var(--admin-strong-text)]">
          {total} tài liệu
        </span>
      </header>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[0.55fr_2.3fr_1fr_1.2fr_1.05fr_1.25fr] items-center border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-6 py-4 text-xs font-black uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
          <div>ID</div>
          <div>Tài liệu</div>
          <div>Loại</div>
          <div>Nguồn</div>
          <div className="text-center">Quyền truy cập</div>
          <div className="text-right">Thao tác</div>
        </div>

        <div className="divide-y divide-[var(--admin-card-border)]">
          {data.map((document) => (
            <div
              key={document.id}
              className="grid grid-cols-[0.55fr_2.3fr_1fr_1.2fr_1.05fr_1.25fr] items-center px-6 py-5 transition-colors duration-150 hover:bg-[var(--admin-control-hover-bg)]"
            >
              <IdCell id={document.id} />

              <DocumentTitleCell document={document} />

              <TableText value={document.category} fallback="Chưa phân loại" />

              <TableText value={document.source} fallback="Chưa có nguồn" />

              <div className="flex justify-center">
                <AccessBadge level={document.accessLevel} />
              </div>

              <ActionsCell
                document={document}
                mode={mode}
                onViewDetail={handleViewDetail}
                onEdit={onEdit}
                onDelete={onDelete}
                isMutating={isMutating}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[var(--admin-card-border)] lg:hidden">
        {data.map((document) => (
          <article key={document.id} className="px-4 py-5">
            <div className="flex items-start justify-between gap-3">
              <DocumentTitleCell document={document} />

              <AccessBadge level={document.accessLevel} />
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
              <MobileInfoLine label="ID" value={`#${document.id}`} />
              <MobileInfoLine label="Loại" value={document.category} />
              <MobileInfoLine label="Nguồn" value={document.source} />
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <ActionsCell
                document={document}
                mode={mode}
                onViewDetail={handleViewDetail}
                onEdit={onEdit}
                onDelete={onDelete}
                isMutating={isMutating}
                compact
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function IdCell({ id }: { id: TechnicalDocumentItem["id"] }) {
  return (
    <span className="inline-flex h-9 w-fit items-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 font-mono text-[15px] font-black text-[var(--admin-strong-text)]">
      #{id}
    </span>
  );
}

function DocumentTitleCell({ document }: { document: TechnicalDocumentItem }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[16px] font-black leading-6 text-[var(--admin-strong-text)]">
        {getSafeText(document.title, "Chưa có tên tài liệu")}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
        Tài liệu kỹ thuật phục vụ kho tri thức AI
      </p>
    </div>
  );
}

function TableText({
  value,
  fallback = "--",
}: {
  value?: string | null;
  fallback?: string;
}) {
  return (
    <p className="truncate text-[15px] font-bold leading-6 text-[var(--admin-strong-text)]">
      {getSafeText(value, fallback)}
    </p>
  );
}

function MobileInfoLine({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="shrink-0 text-xs font-black uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
        {label}
      </span>

      <span className="min-w-0 text-right text-[15px] font-bold leading-6 text-[var(--admin-strong-text)]">
        {getSafeText(value, "--")}
      </span>
    </div>
  );
}

function AccessBadge({
  level,
}: {
  level: TechnicalDocumentItem["accessLevel"];
}) {
  return (
    <span
      className={[
        "inline-flex h-9 max-w-full items-center gap-2 rounded-full border px-3 text-sm font-black",
        level === "BASIC"
          ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
          : "border-[#FF7A00]/35 bg-[#FF7A00]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFB366]",
      ].join(" ")}
    >
      <ShieldCheck className="h-4 w-4 shrink-0" />
      <span className="truncate">{getAccessLevelLabel(level)}</span>
    </span>
  );
}

function ActionsCell({
  document,
  mode,
  onViewDetail,
  onEdit,
  onDelete,
  isMutating,
  compact = false,
}: {
  document: TechnicalDocumentItem;
  mode: "default" | "rag";
  onViewDetail: (document: TechnicalDocumentItem) => void;
  onEdit?: (document: TechnicalDocumentItem) => void;
  onDelete?: (document: TechnicalDocumentItem) => void | Promise<void>;
  isMutating: boolean;
  compact?: boolean;
}) {
  const wrapperClass = compact
    ? "flex flex-wrap items-center justify-end gap-2"
    : "flex items-center justify-end gap-2";

  return (
    <div className={wrapperClass}>
      <DetailAction
        document={document}
        mode={mode}
        onViewDetail={onViewDetail}
        compact={compact}
      />

      {mode === "default" && onEdit ? (
        <button
          type="button"
          onClick={() => onEdit(document)}
          disabled={isMutating}
          className={getActionClass("edit", compact)}
        >
          <Pencil className="h-4 w-4" strokeWidth={2.5} />
          Sửa
        </button>
      ) : null}

      {mode === "default" && onDelete ? (
        <button
          type="button"
          onClick={() => onDelete(document)}
          disabled={isMutating}
          className={getActionClass("delete", compact)}
        >
          <Trash2 className="h-4 w-4" strokeWidth={2.5} />
          Xóa
        </button>
      ) : null}
    </div>
  );
}

function DetailAction({
  document,
  mode,
  onViewDetail,
  compact = false,
}: {
  document: TechnicalDocumentItem;
  mode: "default" | "rag";
  onViewDetail: (document: TechnicalDocumentItem) => void;
  compact?: boolean;
}) {
  if (mode === "rag") {
    return (
      <AdminDetailAction
        onClick={() => onViewDetail(document)}
        className={compact ? "px-3" : ""}
        icon={<Eye className="h-4 w-4" strokeWidth={2.5} />}
      />
    );
  }

  return (
    <AdminDetailAction
      href={`${DEFAULT_DETAIL_BASE_PATH}/${document.id}`}
      className={compact ? "px-3" : ""}
      icon={<Eye className="h-4 w-4" strokeWidth={2.5} />}
    />
  );
}

function getActionClass(
  type: "detail" | "edit" | "delete",
  compact: boolean,
) {
  const sizeClass = compact ? "h-9 px-3" : "h-9 px-3.5";

  const baseClass =
    "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50";

  const colorClass =
    type === "edit"
      ? "border-[#A855F7]/35 bg-[#A855F7]/10 text-[#7E22CE] hover:bg-[#A855F7]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#C084FC]"
      : "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#DC2626] hover:bg-[#EF4444]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]";

  return [baseClass, sizeClass, colorClass].join(" ");
}

function getSafeText(value?: string | null, fallback = "--") {
  if (!value) return fallback;
  return value.trim() ? value : fallback;
}
