"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import type { ApiError } from "@/app/services/apiClient";
import AdminShell from "../../dashboard/components/Action/AdminShell";
import { technicalDocumentAdminService } from "../../technical-documents/services/technicalDocumentAdmin.service";
import type {
  AccessLevel,
  TechnicalDocumentFormValues,
} from "../../technical-documents/types/technicalDocument.types";

const emptyValues: TechnicalDocumentFormValues = {
  title: "",
  content: "",
  category: "",
  source: "",
  accessLevel: "ADVANCED",
};

export default function RagKnowledgeCreatePage() {
  const router = useRouter();
  const [values, setValues] = useState<TechnicalDocumentFormValues>(emptyValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const disabled =
    isSubmitting || !values.title.trim() || !values.content.trim();

  const handleSubmit = async () => {
    if (disabled) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await technicalDocumentAdminService.createDocument(values);
      router.push("/admin/rag-knowledge");
    } catch (nextError) {
      setError(nextError as ApiError);
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <section className="admin-card rounded-2xl px-5 py-5 sm:px-6 lg:px-7">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--admin-muted-text)]">
              <Link
                href="/admin/rag-knowledge"
                className="inline-flex items-center gap-1 transition hover:text-[var(--admin-accent)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Kho tri thức RAG
              </Link>

              <span>/</span>

              <span className="text-[var(--admin-strong-text)]">
                Thêm tài liệu
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
              Thêm tài liệu RAG
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
              Tạo tài liệu mới cho kho tri thức RAG. Sau khi lưu, tài liệu sẽ xuất
              hiện trong danh sách và có thể vào trang chi tiết để chỉnh sửa.
            </p>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
            <p className="text-sm font-semibold text-[var(--admin-error)]">
              Không thể tạo tài liệu RAG.
            </p>

            <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
              {error.message}
            </p>
          </section>
        ) : null}

        <section className="admin-card rounded-2xl p-5">
          <div className="space-y-4">
            <label className={labelClass}>
              Tên tài liệu
              <input
                value={values.title}
                onChange={(event) =>
                  setValues({ ...values, title: event.target.value })
                }
                className={inputClass}
                placeholder="Ví dụ: Máy lạnh không mát - Kiểm tra gas"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className={labelClass}>
                Loại thiết bị
                <input
                  value={values.category}
                  onChange={(event) =>
                    setValues({ ...values, category: event.target.value })
                  }
                  className={inputClass}
                  placeholder="Máy lạnh"
                />
              </label>

              <label className={labelClass}>
                Nguồn
                <input
                  value={values.source}
                  onChange={(event) =>
                    setValues({ ...values, source: event.target.value })
                  }
                  className={inputClass}
                  placeholder="Manual Daikin 2024"
                />
              </label>

              <label className={labelClass}>
                Quyền truy cập
                <select
                  value={values.accessLevel}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      accessLevel: event.target.value as AccessLevel,
                    })
                  }
                  className={inputClass}
                >
                  <option
                    value="BASIC"
                    className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]"
                  >
                    BASIC - Khách và thợ
                  </option>
                  <option
                    value="ADVANCED"
                    className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]"
                  >
                    ADVANCED - Chỉ thợ
                  </option>
                </select>
              </label>
            </div>

            <label className={labelClass}>
              Nội dung tài liệu
              <textarea
                value={values.content}
                onChange={(event) =>
                  setValues({ ...values, content: event.target.value })
                }
                className="min-h-[320px] w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 py-3 text-sm font-medium leading-7 text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
                placeholder="Nhập nội dung chunk tài liệu kỹ thuật..."
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-[var(--admin-card-border)] pt-5 sm:flex-row sm:justify-end">
            <Link
              href="/admin/rag-knowledge"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]"
            >
              Hủy
            </Link>

            <button
              type="button"
              disabled={disabled}
              onClick={() => void handleSubmit()}
              className="h-11 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu tài liệu"}
            </button>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

const labelClass =
  "block space-y-2 text-sm font-semibold text-[var(--admin-strong-text)]";

const inputClass =
  "h-11 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";
