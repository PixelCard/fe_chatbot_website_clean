"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";

import AdminShell from "../../dashboard/components/Action/AdminShell";
import TechnicalDocumentTable from "./table/TechnicalDocumentTable";
import { useTechnicalDocumentsApi } from "../hooks/useTechnicalDocumentsApi";
import { TechnicalDocumentFormModal } from "./TechnicalDocumentFormModal";
import AdminToastStack, { type AdminToast } from "@/app/components/admin/AdminToastStack";
import type {
  TechnicalDocumentFilterState,
  TechnicalDocumentFormValues,
  TechnicalDocumentItem,
} from "../types/technicalDocument.types";

const defaultFilters: TechnicalDocumentFilterState = {
  keyword: "",
  category: "ALL",
  source: "ALL",
  accessLevel: "ALL",
  embeddingStatus: "ALL",
  onlyOutdated: false,
  onlyAiCoverage: false,
};

type TechnicalDocumentsAdminContentProps = {
  title: string;
  description?: string;
  mode?: "default" | "rag";
};

const PAGE_SIZE = 10;

export function TechnicalDocumentsAdminContent({
  title,
  description,
  mode = "default",
}: TechnicalDocumentsAdminContentProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] =
    useState<Partial<TechnicalDocumentFormValues> | undefined>(undefined);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingDocument, setEditingDocument] =
    useState<TechnicalDocumentItem | null>(null);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const [modalError, setModalError] = useState<string | null>(null);

  const addToast = (type: AdminToast["type"], text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const {
    filteredDocuments,
    isLoading,
    isMutating,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
  } = useTechnicalDocumentsApi(defaultFilters);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / PAGE_SIZE));

  const pagedDocuments = filteredDocuments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const openCreateModal = () => {
    setFormMode("create");
    setEditingDocument(null);
    setFormInitialValues(undefined);
    setModalError(null);
    setFormOpen(true);
  };

  const openAiCoverageCreateModal = () => {
    setFormMode("create");
    setEditingDocument(null);
    setFormInitialValues({
      title: "Bổ sung tài liệu cho nhóm thiết bị AI trả lời kém",
      source: "AI trả lời kém",
      accessLevel: "ADVANCED",
    });
    setModalError(null);
    setFormOpen(true);
  };

  const openEditModal = (document: TechnicalDocumentItem) => {
    setFormMode("edit");
    setEditingDocument(document);
    setFormInitialValues(undefined);
    setModalError(null);
    setFormOpen(true);
  };

  const handleSubmitForm = async (values: TechnicalDocumentFormValues) => {
    setModalError(null);
    try {
      if (formMode === "edit" && editingDocument) {
        await updateDocument(editingDocument.id, values);
        addToast("success", `Đã cập nhật tài liệu "${values.title}" thành công!`);
      } else {
        await createDocument(values);
        addToast("success", `Đã thêm tài liệu "${values.title}" vào kho tri thức RAG!`);
      }

      setFormOpen(false);
      setEditingDocument(null);
    } catch (err: unknown) {
      const errMsg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Không thể lưu tài liệu. Vui lòng kiểm tra lại.";
      setModalError(errMsg);
      addToast("error", `Thao tác thất bại: ${errMsg}`);
    }
  };

  const handleDelete = async (document: TechnicalDocumentItem) => {
    if (!window.confirm(`Xóa tài liệu "${document.title}" khỏi kho tri thức RAG?`)) {
      return;
    }

    try {
      await deleteDocument(document.id);
      addToast("success", `Đã xóa tài liệu "${document.title}" khỏi kho RAG.`);
    } catch (err: unknown) {
      const errMsg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Không thể xóa tài liệu.";
      addToast("error", `Xóa tài liệu thất bại: ${errMsg}`);
    }
  };

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <section className="admin-card rounded-2xl px-5 py-5 sm:px-6 lg:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
                {title}
              </h1>

              {description ? (
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
                  {description}
                </p>
              ) : null}

              {error ? (
                <p className="mt-3 text-sm font-semibold text-[var(--admin-error)]">
                  Không tải được dữ liệu RAG: {error.message}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              {mode === "default" ? (
                <>
                  <button
                    type="button"
                    onClick={openAiCoverageCreateModal}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#06B6D4]/35 bg-[#06B6D4]/10 px-4 text-sm font-bold text-[#0891B2] transition hover:bg-[#06B6D4]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Bổ sung AI
                  </button>

                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm tài liệu
                  </button>
                </>
              ) : mode === "rag" ? (
                <Link
                  href="/admin/rag-knowledge/create"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105"
                >
                  <Plus className="h-4 w-4" />
                  Thêm tài liệu RAG
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="admin-card rounded-2xl p-5">
            <p className="text-sm font-medium text-[var(--admin-muted-text)]">
              Đang tải tài liệu kỹ thuật...
            </p>
          </section>
        ) : (
          <TechnicalDocumentTable
            data={pagedDocuments}
            total={filteredDocuments.length}
            mode={mode}
            onViewDetail={
              mode === "rag"
                ? (document) => router.push(`/admin/rag-knowledge/${document.id}`)
                : undefined
            }
            onEdit={mode === "default" ? openEditModal : undefined}
            onDelete={mode === "default" ? handleDelete : undefined}
            isMutating={isMutating}
          />
        )}

        {!isLoading && filteredDocuments.length > 0 ? (
          <section className="admin-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[var(--admin-muted-text)]">
              Hiển thị {(page - 1) * PAGE_SIZE + 1} -{" "}
              {Math.min(page * PAGE_SIZE, filteredDocuments.length)} trong{" "}
              {filteredDocuments.length} tài liệu
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className={paginationButtonClass}
              >
                Trước
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    className={[
                      "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-bold transition",
                      pageNumber === page
                        ? "border-[#FF7A00] bg-[#FF7A00] text-white"
                        : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]",
                    ].join(" ")}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className={paginationButtonClass}
              >
                Sau
              </button>
            </div>
          </section>
        ) : null}
      </div>

      <TechnicalDocumentFormModal
        open={formOpen}
        mode={formMode}
        document={formMode === "edit" ? editingDocument : null}
        initialValues={formInitialValues}
        onClose={() => {
          setFormOpen(false);
          setEditingDocument(null);
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

const paginationButtonClass =
  "inline-flex h-9 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-bold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] disabled:cursor-not-allowed disabled:opacity-50";
