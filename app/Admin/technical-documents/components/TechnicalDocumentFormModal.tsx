"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
  AccessLevel,
  TechnicalDocumentFormValues,
  TechnicalDocumentItem,
} from "../types/technicalDocument.types";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  document?: TechnicalDocumentItem | null;
  initialValues?: Partial<TechnicalDocumentFormValues>;
  onClose: () => void;
  onSubmit: (values: TechnicalDocumentFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

const emptyValues: TechnicalDocumentFormValues = {
  title: "",
  content: "",
  category: "",
  source: "",
  accessLevel: "ADVANCED",
};

export function TechnicalDocumentFormModal({
  open,
  mode,
  document,
  initialValues,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const [values, setValues] =
    useState<TechnicalDocumentFormValues>(emptyValues);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && document) {
      setValues({
        title: document.title,
        content: document.content,
        category: document.category ?? "",
        source: document.source ?? "",
        accessLevel: document.accessLevel,
      });
      return;
    }

    setValues({
      ...emptyValues,
      ...initialValues,
    });
  }, [open, mode, document, initialValues]);

  if (!open) return null;

  const disabled =
    isSubmitting || !values.title.trim() || !values.content.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4 backdrop-blur-[2px]">
      <div className="admin-card flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl">
        <header className="shrink-0 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[var(--admin-strong-text)]">
                {mode === "create" ? "Thêm tài liệu mới" : "Sửa tài liệu"}
              </h2>

              <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
                Tài liệu mới sẽ được nạp trực tiếp vào kho tri thức RAG.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
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
                className="min-h-[260px] w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 py-3 text-sm font-medium leading-7 text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
                placeholder="Nhập nội dung chunk tài liệu kỹ thuật..."
              />
            </label>
          </div>
        </div>

        <footer className="shrink-0 border-t border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]"
            >
              Hủy
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => void onSubmit(values)}
              className="h-11 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Đang nạp tài liệu..."
                : mode === "create"
                  ? "Thêm tài liệu"
                  : "Lưu thay đổi"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

const labelClass =
  "block space-y-2 text-sm font-semibold text-[var(--admin-strong-text)]";

const inputClass =
  "h-11 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";