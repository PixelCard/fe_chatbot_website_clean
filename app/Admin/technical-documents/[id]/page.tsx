"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import AdminShell from "../../dashboard/components/Action/AdminShell";
import AdminToastStack, { type AdminToast } from "@/app/components/admin/AdminToastStack";

import { TechnicalDocumentFormModal } from "../components/TechnicalDocumentFormModal";
import { useTechnicalDocumentsApi } from "../hooks/useTechnicalDocumentsApi";
import type {
  TechnicalDocumentFilterState,
  TechnicalDocumentFormValues,
} from "../types/technicalDocument.types";
import {
  formatDateTime,
  getAccessLevelLabel,
  getEmbeddingStatusLabel,
} from "../lib/technicalDocumentHelpers";

const defaultFilters: TechnicalDocumentFilterState = {
  keyword: "",
  category: "ALL",
  source: "ALL",
  accessLevel: "ALL",
  embeddingStatus: "ALL",
  onlyOutdated: false,
  onlyAiCoverage: false,
};

type TechnicalDocumentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  basePath?: string;
  listLabel?: string;
  detailTitle?: string;
  detailDescription?: string;
  documentTypeLabel?: string;
};

export default function TechnicalDocumentDetailPage({
  params,
  basePath = "/admin/technical-documents",
  listLabel = "Tài liệu kỹ thuật",
  detailTitle = "Chi tiết tài liệu",
  detailDescription = "Xem nội dung tài liệu, metadata, quyền truy cập và trạng thái embedding trong kho tri thức RAG.",
  documentTypeLabel = "Tài liệu kỹ thuật",
}: TechnicalDocumentDetailPageProps) {
  const { id } = use(params);
  const numericId = Number(id);

  const [formOpen, setFormOpen] = useState(false);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const [modalError, setModalError] = useState<string | null>(null);

  const addToast = (type: AdminToast["type"], text: string) => {
    const toastId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id: toastId, type, text }]);
  };

  const removeToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  const {
    filteredDocuments,
    isLoading,
    isMutating,
    error,
    updateDocument,
    deleteDocument,
  } = useTechnicalDocumentsApi(defaultFilters);

  const document = useMemo(() => {
    return filteredDocuments.find((item) => item.id === numericId) ?? null;
  }, [filteredDocuments, numericId]);

  const handleSubmitForm = async (values: TechnicalDocumentFormValues) => {
    if (!document) return;

    setModalError(null);
    try {
      await updateDocument(document.id, values);
      addToast("success", `Cập nhật tài liệu "${values.title}" thành công!`);
      setFormOpen(false);
    } catch (err: unknown) {
      const errMsg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Không thể cập nhật tài liệu.";
      setModalError(errMsg);
      addToast("error", `Cập nhật thất bại: ${errMsg}`);
    }
  };

  const handleDelete = async () => {
    if (!document) return;

    if (
      !window.confirm(`Xóa tài liệu "${document.title}" khỏi kho tri thức RAG?`)
    ) {
      return;
    }

    try {
      await deleteDocument(document.id);
      addToast("success", `Đã xóa tài liệu "${document.title}".`);
      window.location.href = basePath;
    } catch (err: unknown) {
      const errMsg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Không thể xóa tài liệu.";
      addToast("error", `Xóa thất bại: ${errMsg}`);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <section className="admin-card rounded-2xl px-5 py-5 sm:px-6 lg:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--admin-muted-text)]">
                <Link
                  href={basePath}
                  className="inline-flex items-center gap-1 transition hover:text-[var(--admin-accent)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {listLabel}
                </Link>

                <span>/</span>

                <span className="text-[var(--admin-strong-text)]">
                  #{id}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
                {detailTitle}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
                {detailDescription}
              </p>
            </div>

            {document ? (
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]"
                >
                  <Pencil className="h-4 w-4" />
                  Sửa
                </button>

                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={isMutating}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-4 text-sm font-bold text-[var(--admin-error)] transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
            <p className="text-sm font-semibold text-[var(--admin-error)]">
              Không tải được chi tiết tài liệu.
            </p>

            <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
              {error.message}
            </p>
          </section>
        ) : null}

        {!error && isLoading ? (
          <section className="admin-card rounded-2xl p-5">
            <p className="text-sm font-medium text-[var(--admin-muted-text)]">
              Đang tải chi tiết tài liệu...
            </p>
          </section>
        ) : null}

        {!error && !isLoading && !document ? (
          <section className="admin-card flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-dashed p-8 text-center">
            <h2 className="text-lg font-bold text-[var(--admin-strong-text)]">
              Không tìm thấy tài liệu
            </h2>

            <p className="mt-2 text-sm text-[var(--admin-muted-text)]">
              Không có tài liệu nào khớp với ID hiện tại.
            </p>

            <Link
              href={basePath}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)]"
            >
              Về danh sách tài liệu
            </Link>
          </section>
        ) : null}

        {document ? (
          <section className="admin-card rounded-2xl p-4 sm:p-5">
            <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--admin-accent)]">
                {documentTypeLabel}
              </p>

              <h2 className="mt-2 text-xl font-black text-[var(--admin-strong-text)]">
                {document.title}
              </h2>

              <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
                Cập nhật: {formatDateTime(document.updatedAt)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-4">
              <InfoCard
                label="Loại thiết bị"
                value={document.category || "--"}
              />
              <InfoCard label="Nguồn" value={document.source || "--"} />
              <InfoCard
                label="Quyền truy cập"
                value={getAccessLevelLabel(document.accessLevel)}
              />
              <InfoCard
                label="Embedding"
                value={getEmbeddingStatusLabel(document.embeddingStatus)}
              />
            </div>

            <article className="mt-4 rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
              <h3 className="text-base font-black text-[var(--admin-strong-text)]">
                Nội dung tài liệu
              </h3>

              <p className="mt-3 whitespace-pre-wrap rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4 text-sm leading-7 text-[var(--admin-strong-text)]">
                {document.content}
              </p>
            </article>
          </section>
        ) : null}
      </div>

      <TechnicalDocumentFormModal
        open={formOpen}
        mode="edit"
        document={document}
        onClose={() => {
          setFormOpen(false);
          setModalError(null);
        }}
        onSubmit={handleSubmitForm}
        isSubmitting={isMutating}
        errorMessage={modalError}
      />

      <AdminToastStack toasts={toasts} onRemove={removeToast} />
    </AdminShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold leading-7 text-[var(--admin-strong-text)]">
        {value}
      </p>
    </article>
  );
}
