"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
  AccessLevel,
  RagDocumentDetail,
  RagDocumentKind,
  UpdateRagDocumentFormValues,
} from "../types/ragKnowledge.types";

interface Props {
  open: boolean;
  document: RagDocumentDetail | null;
  onClose: () => void;
  onSubmit: (values: UpdateRagDocumentFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

const emptyValues: UpdateRagDocumentFormValues = {
  title: "",
  description: "",
  kind: "",
  category: "",
  brand: "",
  modelCode: "",
  source: "",
  tags: "",
  accessLevel: "ADVANCED",
};

export function RagKnowledgeFormModal({
  open,
  document,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  if (!open) return null;

  return (
    <RagKnowledgeFormModalContent
      key={document ? `edit-${document.id}` : "new"}
      document={document}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
}

function RagKnowledgeFormModalContent({
  document,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  document: RagDocumentDetail | null;
  onClose: () => void;
  onSubmit: (values: UpdateRagDocumentFormValues) => void | Promise<void>;
  isSubmitting: boolean;
}) {
  const [values, setValues] = useState<UpdateRagDocumentFormValues>(emptyValues);

  useEffect(() => {
    if (document) {
      setValues({
        title: document.title || "",
        description: document.description || "",
        kind: document.kind || "",
        category: document.category || "",
        brand: document.brand || "",
        modelCode: document.modelCode || "",
        source: document.source || "",
        tags: document.tags ? document.tags.join(", ") : "",
        accessLevel: document.accessLevel || "ADVANCED",
      });
    }
  }, [document]);

  const disabled = isSubmitting || !values.title?.trim();

  const handleSubmit = () => {
    void onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4 backdrop-blur-[2px]">
      <div className="admin-card flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl">
        <header className="shrink-0 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[var(--admin-strong-text)]">
                Chỉnh sửa tài liệu RAG
              </h2>
              <p className="mt-1.5 text-[15px] font-semibold text-[var(--admin-muted-text)]">
                Cập nhật thông tin phân loại, từ khóa và quyền truy cập của tài liệu.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] transition-all duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
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

            <label className={labelClass}>
              Mô tả tài liệu
              <textarea
                value={values.description}
                onChange={(event) =>
                  setValues({ ...values, description: event.target.value })
                }
                rows={3}
                className="w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 py-3 text-[15px] font-medium leading-relaxed text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
                placeholder="Tóm tắt ngắn gọn nội dung tài liệu..."
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className={labelClass}>
                Thể loại tài liệu
                <select
                  value={values.kind}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      kind: event.target.value as RagDocumentKind | "",
                    })
                  }
                  className={inputClass}
                >
                  <option value="" className="bg-[var(--admin-control-bg)]">Chọn thể loại</option>
                  <option value="TROUBLESHOOTING_GUIDE" className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]">
                    Hướng dẫn xử lý lỗi
                  </option>
                  <option value="REPAIR_POLICY" className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]">
                    Chính sách sửa chữa
                  </option>
                  <option value="PRICE_TABLE" className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]">
                    Bảng giá dịch vụ
                  </option>
                  <option value="DEVICE_MANUAL" className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]">
                    Hướng dẫn thiết bị
                  </option>
                  <option value="FAQ" className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]">
                    Câu hỏi thường gặp
                  </option>
                  <option value="INTERNAL_NOTE" className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]">
                    Ghi chú nội bộ
                  </option>
                </select>
              </label>

              <label className={labelClass}>
                Nhóm thiết bị
                <input
                  value={values.category}
                  onChange={(event) =>
                    setValues({ ...values, category: event.target.value })
                  }
                  className={inputClass}
                  placeholder="Ví dụ: Máy lạnh, Tủ lạnh"
                />
              </label>

              <label className={labelClass}>
                Nguồn tài liệu
                <input
                  value={values.source}
                  onChange={(event) =>
                    setValues({ ...values, source: event.target.value })
                  }
                  className={inputClass}
                  placeholder="Manual Daikin 2024"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className={labelClass}>
                Hãng (Brand)
                <input
                  value={values.brand}
                  onChange={(event) =>
                    setValues({ ...values, brand: event.target.value })
                  }
                  className={inputClass}
                  placeholder="Daikin, Panasonic..."
                />
              </label>

              <label className={labelClass}>
                Mã thiết bị (Model)
                <input
                  value={values.modelCode}
                  onChange={(event) =>
                    setValues({ ...values, modelCode: event.target.value })
                  }
                  className={inputClass}
                  placeholder="FTKC25UAVMV..."
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
              Từ khóa (Tags)
              <input
                value={values.tags}
                onChange={(event) =>
                  setValues({ ...values, tags: event.target.value })
                }
                className={inputClass}
                placeholder="Phân tách bằng dấu phẩy, ví dụ: thiếu gas, xì gas, lỗi F3"
              />
            </label>
          </div>
        </div>

        <footer className="shrink-0 border-t border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-5 text-[15px] font-black text-[var(--admin-muted-text)] transition-all duration-150 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] active:scale-95"
            >
              Hủy
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={handleSubmit}
              className="h-11 rounded-xl bg-[image:var(--admin-cta-bg)] px-5 text-[15px] font-black text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition-all duration-150 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

const labelClass =
  "block space-y-2 text-[15px] font-bold text-[var(--admin-strong-text)]";

const inputClass =
  "h-12 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-[15px] font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]";
