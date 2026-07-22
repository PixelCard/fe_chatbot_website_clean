"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  FileText,
  FolderOpen,
  Info,
  Layers3,
  Loader2,
  ShieldCheck,
  Tags,
  UploadCloud,
  Wrench,
  X,
} from "lucide-react";

type AccessLevelValue = "BASIC" | "ADVANCED";

type RagDocumentKindValue =
  | "TROUBLESHOOTING_GUIDE"
  | "REPAIR_POLICY"
  | "PRICE_TABLE"
  | "DEVICE_MANUAL"
  | "FAQ"
  | "INTERNAL_NOTE";

export type KnowledgeActionDrawerSubmitValues = {
  file: File;
  title?: string;
  description?: string;
  kind?: RagDocumentKindValue;
  category?: string;
  brand?: string;
  modelCode?: string;
  source?: string;
  tags: string[];
  accessLevel: AccessLevelValue;
};

type KnowledgeActionDrawerProps = {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;

  onSubmit?: (
    values: KnowledgeActionDrawerSubmitValues,
  ) => Promise<void> | void;

  onImport?: (
    values: KnowledgeActionDrawerSubmitValues,
  ) => Promise<void> | void;

  isSubmitting?: boolean;
  isImporting?: boolean;
  errorMessage?: string | null;
};

type FormState = {
  title: string;
  description: string;
  kind: "" | RagDocumentKindValue;
  category: string;
  brand: string;
  modelCode: string;
  source: string;
  tags: string;
  accessLevel: AccessLevelValue;
};

const INITIAL_FORM_STATE: FormState = {
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

const KIND_OPTIONS: Array<{
  value: RagDocumentKindValue;
  label: string;
  description: string;
}> = [
    {
      value: "TROUBLESHOOTING_GUIDE",
      label: "Hướng dẫn xử lý lỗi",
      description: "Lỗi thường gặp, cách kiểm tra, hướng dẫn xử lý.",
    },
    {
      value: "DEVICE_MANUAL",
      label: "Manual thiết bị",
      description: "Tài liệu hướng dẫn từ hãng hoặc model cụ thể.",
    },
    {
      value: "FAQ",
      label: "Câu hỏi thường gặp",
      description: "Câu hỏi và trả lời hay dùng cho khách hàng.",
    },
    {
      value: "REPAIR_POLICY",
      label: "Chính sách sửa chữa",
      description: "Điều kiện bảo hành, quy trình, lưu ý dịch vụ.",
    },
    {
      value: "PRICE_TABLE",
      label: "Bảng giá",
      description: "Bảng giá tham khảo, phí dịch vụ, linh kiện.",
    },
    {
      value: "INTERNAL_NOTE",
      label: "Ghi chú nội bộ",
      description: "Ghi chú kỹ thuật hoặc quy định nội bộ.",
    },
  ];

const ACCESS_LEVEL_OPTIONS: Array<{
  value: AccessLevelValue;
  label: string;
  description: string;
}> = [
    {
      value: "BASIC",
      label: "Cơ bản",
      description: "Khách hàng và kỹ thuật viên đều có thể dùng.",
    },
    {
      value: "ADVANCED",
      label: "Chỉ kỹ thuật viên",
      description: "Nội dung chuyên sâu, thao tác kỹ thuật, sửa phần cứng.",
    },
  ];

export function KnowledgeActionDrawer({
  open,
  isOpen,
  onClose,
  onOpenChange,
  onSubmit,
  onImport,
  isSubmitting,
  isImporting,
  errorMessage,
}: KnowledgeActionDrawerProps) {
  const visible = Boolean(open ?? isOpen);
  const busy = Boolean(isSubmitting ?? isImporting);

  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedKind = useMemo(() => {
    if (!form.kind) return null;
    return KIND_OPTIONS.find((item) => item.value === form.kind) ?? null;
  }, [form.kind]);

  const selectedAccessLevel = useMemo(() => {
    return (
      ACCESS_LEVEL_OPTIONS.find((item) => item.value === form.accessLevel) ??
      ACCESS_LEVEL_OPTIONS[1]
    );
  }, [form.accessLevel]);

  const fileMeta = useMemo(() => {
    if (!file) return null;

    return {
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileExtension(file.name) || file.type || "Không rõ",
    };
  }, [file]);

  const canSubmit = Boolean(file) && !busy;

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, busy]);

  const handleClose = () => {
    if (busy) return;

    onClose?.();
    onOpenChange?.(false);
  };

  const updateField = <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setLocalError(null);
  };

  const handleFileChange = (nextFile: File | null) => {
    if (!nextFile) return;

    setFile(nextFile);
    setLocalError(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    const nextFile = event.dataTransfer.files?.[0] ?? null;
    handleFileChange(nextFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setLocalError("Bạn cần chọn file tài liệu trước khi thêm vào kho AI.");
      return;
    }

    const payload: KnowledgeActionDrawerSubmitValues = {
      file,
      title: emptyToUndefined(form.title),
      description: emptyToUndefined(form.description),
      kind: form.kind || undefined,
      category: emptyToUndefined(form.category),
      brand: emptyToUndefined(form.brand),
      modelCode: emptyToUndefined(form.modelCode),
      source: emptyToUndefined(form.source),
      tags: splitTags(form.tags),
      accessLevel: form.accessLevel,
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else if (onImport) {
        await onImport(payload);
      }

      resetForm();
    } catch {
      // Error thật nên được xử lý ở hook/page cha qua errorMessage.
      // Ở đây chỉ tránh crash UI.
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setFile(null);
    setIsDragging(false);
    setLocalError(null);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rag-import-modal-title"
    >
      <button
        type="button"
        aria-label="Đóng popup"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
        disabled={busy}
      />

      <form
        onSubmit={handleSubmit}
        className="relative flex max-h-[94vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-2xl ring-1 ring-white/10 dark:bg-[#07111f] sm:max-h-[90vh]"
      >
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 px-5 py-5 backdrop-blur-xl dark:bg-[#07111f]/95 sm:px-8 sm:py-6">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
                Thêm tài liệu
              </p>

              <h2
                id="rag-import-modal-title"
                className="mt-1 text-2xl font-black tracking-tight text-white sm:text-[28px]"
              >
                Thêm tài liệu vào kho AI
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-300 sm:text-[15px]">
                Chọn file và nhập thông tin chính để AI hiểu tài liệu này thuộc
                nhóm thiết bị, hãng và quyền truy cập nào.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={busy}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
          <div className="space-y-6">
            {(localError || errorMessage) && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                  <p>{localError || errorMessage}</p>
                </div>
              </div>
            )}

            <SectionCard
              icon={<UploadCloud className="h-5 w-5" />}
              title="1. File tài liệu"
              description="Upload tài liệu AI sẽ phân tích và tạo chunks."
            >
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={[
                  "group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed p-6 text-center transition",
                  isDragging
                    ? "border-orange-300 bg-orange-400/10"
                    : "border-slate-600/80 bg-slate-900/70 hover:border-orange-300/70 hover:bg-slate-900",
                ].join(" ")}
              >
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.md,.html,.json"
                  onChange={(event) =>
                    handleFileChange(event.target.files?.[0] ?? null)
                  }
                  disabled={busy}
                />

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-orange-200 transition group-hover:scale-105 group-hover:bg-orange-400/10">
                  <UploadCloud className="h-8 w-8" />
                </div>

                {fileMeta ? (
                  <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-200">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-white">
                          {fileMeta.name}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-300">
                          {fileMeta.size} · {fileMeta.type.toUpperCase()}
                        </p>

                        <p className="mt-2 text-xs font-semibold text-slate-400">
                          Bấm vào khung này để chọn file khác.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-black text-white">
                      Bấm để chọn hoặc kéo thả file
                    </p>

                    <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-300">
                      Nên dùng file dưới 10MB để xử lý nhanh hơn. Hỗ trợ PDF,
                      DOCX, XLSX, CSV, TXT, MD.
                    </p>
                  </>
                )}
              </label>

              <div className="mt-4 rounded-2xl border border-sky-300/20 bg-sky-400/10 p-4">
                <div className="flex gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-200" />
                  <p className="text-sm font-semibold leading-6 text-sky-50">
                    PDF chỉ gồm ảnh quét sẽ không đọc được chữ nếu chưa chạy OCR
                    trước. Nên dùng PDF có thể copy chữ, DOCX hoặc TXT.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={<FileText className="h-5 w-5" />}
              title="2. Thông tin chính"
              description="Tên và mô tả giúp admin nhận diện tài liệu nhanh hơn."
            >
              <div className="grid gap-5">
                <TextField
                  label="Tên tài liệu"
                  value={form.title}
                  onChange={(value) => updateField("title", value)}
                  placeholder="Ví dụ: Hướng dẫn xử lý lỗi máy lạnh Daikin"
                  helper="Có thể để trống để dùng tên file."
                />

                <TextAreaField
                  label="Mô tả ngắn"
                  value={form.description}
                  onChange={(value) => updateField("description", value)}
                  placeholder="Ví dụ: Tài liệu tổng hợp lỗi thường gặp, cách kiểm tra ban đầu và lưu ý an toàn"
                  helper="Mô tả ngắn gọn nội dung tài liệu."
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="3. Phân loại & quyền truy cập"
              description="Giúp AI chọn đúng tài liệu và kiểm soát mức độ an toàn."
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <SelectField
                  label="Loại tài liệu"
                  value={form.kind}
                  onChange={(value) =>
                    updateField("kind", value as FormState["kind"])
                  }
                  options={[
                    { value: "", label: "Chưa chọn" },
                    ...KIND_OPTIONS.map((item) => ({
                      value: item.value,
                      label: item.label,
                    })),
                  ]}
                  helper={
                    selectedKind?.description ||
                    "Chọn nhóm gần nhất với nội dung tài liệu."
                  }
                />

                <SelectField
                  label="Đối tượng được xem"
                  value={form.accessLevel}
                  onChange={(value) =>
                    updateField("accessLevel", value as AccessLevelValue)
                  }
                  options={ACCESS_LEVEL_OPTIONS.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  helper={selectedAccessLevel.description}
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={<Wrench className="h-5 w-5" />}
              title="4. Thông tin kỹ thuật"
              description="Nhập nếu tài liệu áp dụng cho thiết bị, hãng hoặc model cụ thể."
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <TextField
                  label="Nhóm thiết bị"
                  value={form.category}
                  onChange={(value) => updateField("category", value)}
                  placeholder="Ví dụ: Máy lạnh"
                  helper="Ví dụ: Máy lạnh, máy giặt, tủ lạnh."
                  icon={<Layers3 className="h-4 w-4" />}
                />

                <TextField
                  label="Nguồn tài liệu"
                  value={form.source}
                  onChange={(value) => updateField("source", value)}
                  placeholder="Ví dụ: Manual Daikin 2024 hoặc nội bộ"
                  helper="Nguồn giúp kiểm tra lại tài liệu sau này."
                  icon={<FolderOpen className="h-4 w-4" />}
                />

                <TextField
                  label="Hãng"
                  value={form.brand}
                  onChange={(value) => updateField("brand", value)}
                  placeholder="Daikin"
                  helper="Nhập nếu tài liệu áp dụng cho một hãng cụ thể."
                />

                <TextField
                  label="Mã model"
                  value={form.modelCode}
                  onChange={(value) => updateField("modelCode", value)}
                  placeholder="FTKB35"
                  helper="Nhập nếu tài liệu chỉ áp dụng cho model cụ thể."
                />

                <div className="lg:col-span-2">
                  <TextField
                    label="Từ khóa gợi nhớ"
                    value={form.tags}
                    onChange={(value) => updateField("tags", value)}
                    placeholder="máy lạnh, inverter, bảo trì"
                    helper="Cách nhau bằng dấu phẩy để dễ tìm lại."
                    icon={<Tags className="h-4 w-4" />}
                  />
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <footer className="sticky bottom-0 z-20 border-t border-white/10 bg-slate-950/95 px-5 py-4 backdrop-blur-xl dark:bg-[#07111f]/95 sm:px-8 sm:py-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={busy}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Đóng
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 px-7 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Thêm tài liệu
                </>
              )}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

type SectionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

function SectionCard({ icon, title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5 shadow-sm shadow-black/10 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-300/20 bg-orange-400/10 text-orange-200">
          {icon}
        </div>

        <div>
          <h3 className="text-lg font-black text-white">{title}</h3>
          <p className="mt-1 text-sm font-medium leading-6 text-slate-300">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  icon?: React.ReactNode;
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  helper,
  icon,
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-black text-white">{label}</span>

      <div className="relative mt-2">
        {icon ? (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        ) : null}

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={[
            "h-12 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-[15px] font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-orange-300/70 focus:ring-4 focus:ring-orange-400/15",
            icon ? "pl-11" : "",
          ].join(" ")}
        />
      </div>

      {helper ? (
        <span className="mt-2 block text-xs font-semibold leading-5 text-slate-400">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
};

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  helper,
}: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-black text-white">{label}</span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-[120px] w-full resize-y rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-[15px] font-bold leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-300/70 focus:ring-4 focus:ring-orange-400/15"
      />

      {helper ? (
        <span className="mt-2 block text-xs font-semibold leading-5 text-slate-400">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  helper?: string;
};

function SelectField({
  label,
  value,
  onChange,
  options,
  helper,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-black text-white">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-[15px] font-black text-white outline-none transition focus:border-orange-300/70 focus:ring-4 focus:ring-orange-400/15"
      >
        {options.map((option) => (
          <option
            key={option.value || "empty"}
            value={option.value}
            className="bg-slate-950 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>

      {helper ? (
        <span className="mt-2 block text-xs font-semibold leading-5 text-slate-400">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function splitTags(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  if (parts.length <= 1) return "";
  return parts[parts.length - 1] ?? "";
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default KnowledgeActionDrawer;