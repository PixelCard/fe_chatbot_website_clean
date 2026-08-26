"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  FileText,
  FileWarning,
  Info,
  Loader2,
  MessageSquareText,
  Sparkles,
  UploadCloud,
  Wrench,
  ShieldCheck,
  X,
} from "lucide-react";
import type {
  ImportRagDocumentFormValues,
  RagDocumentDetail,
  RagDocumentKind,
  RagDocumentStatus,
  RagFileType,
  RagImportMetadataSuggestionResponse,
} from "../../types/ragKnowledge.types";

type DrawerMode = "import" | "detail";

type Props = {
  open: boolean;
  mode: DrawerMode;
  detail: RagDocumentDetail | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmitImport: (formData: FormData) => Promise<void> | void;
  onSuggestMetadata: (
    file: File,
  ) => Promise<RagImportMetadataSuggestionResponse> | RagImportMetadataSuggestionResponse;
  onOpenChunks?: (documentId: number) => void;
};

const emptyForm: ImportRagDocumentFormValues = {
  file: null,
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

const kindOptions: Array<{ value: RagDocumentKind; label: string }> = [
  { value: "TROUBLESHOOTING_GUIDE", label: "Hướng dẫn xử lý lỗi" },
  { value: "DEVICE_MANUAL", label: "Manual thiết bị" },
  { value: "FAQ", label: "FAQ" },
  { value: "REPAIR_POLICY", label: "Chính sách sửa chữa" },
  { value: "PRICE_TABLE", label: "Bảng giá" },
  { value: "INTERNAL_NOTE", label: "Ghi chú nội bộ" },
];

const inputClass =
  "h-11 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3.5 text-sm font-bold text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20";

const textareaClass =
  "min-h-[96px] w-full resize-y rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3.5 py-3 text-sm font-bold leading-6 text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20";

export default function KnowledgeActionDrawer({
  open,
  mode,
  detail,
  isLoading = false,
  isSubmitting = false,
  errorMessage,
  onClose,
  onSubmitImport,
  onSuggestMetadata,
  onOpenChunks,
}: Props) {
  const [form, setForm] = useState<ImportRagDocumentFormValues>(emptyForm);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuggestingMetadata, setIsSuggestingMetadata] = useState(false);
  const [metadataHintMessage, setMetadataHintMessage] = useState<string | null>(
    null,
  );
  const [metadataHintError, setMetadataHintError] = useState<string | null>(
    null,
  );

  const detailRecord = detail as Record<string, unknown> | null;

  const tagsPreview = useMemo(
    () =>
      form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [form.tags],
  );

  const fileExtension = useMemo(() => {
    if (!form.file?.name) return null;
    const parts = form.file.name.split(".");
    return parts.length > 1 ? parts[parts.length - 1]?.toUpperCase() : null;
  }, [form.file]);

  if (!open) return null;

  const handleSelectFile = async (file: File | null) => {
    setMetadataHintError(null);
    setMetadataHintMessage(null);

    if (!file) {
      setForm(emptyForm);
      return;
    }

    const fallbackTitle = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setForm({
      ...emptyForm,
      file,
      title: fallbackTitle,
    });

    setIsSuggestingMetadata(true);

    try {
      const suggestion = await onSuggestMetadata(file);
      const metadata = suggestion.metadata;

      setForm((prev) => ({
        ...prev,
        file,
        title: metadata.title || prev.title,
        description: metadata.description || prev.description,
        kind: metadata.kind ?? prev.kind,
        category: metadata.category || prev.category,
        brand: metadata.brand || prev.brand,
        modelCode: metadata.modelCode || prev.modelCode,
        source: metadata.source || prev.source,
        tags:
          metadata.tags.length > 0 ? metadata.tags.join(", ") : prev.tags,
      }));
      setMetadataHintMessage(suggestion.message);
    } catch (error) {
      setMetadataHintError(
        (error as { message?: string }).message ||
        "Không thể gợi ý thông tin từ file này.",
      );
    } finally {
      setIsSuggestingMetadata(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.file || isSubmitting) return;

    const formData = new FormData();
    formData.append("file", form.file);

    appendIfPresent(formData, "title", form.title);
    appendIfPresent(formData, "description", form.description);
    appendIfPresent(formData, "kind", form.kind);
    appendIfPresent(formData, "category", form.category);
    appendIfPresent(formData, "brand", form.brand);
    appendIfPresent(formData, "modelCode", form.modelCode);
    appendIfPresent(formData, "source", form.source);
    appendIfPresent(formData, "tags", form.tags);
    appendIfPresent(formData, "accessLevel", form.accessLevel);

    await onSubmitImport(formData);
  };

  const selectedDocumentId = getNumber(detailRecord, "id");

  return (
    <div className="fixed inset-0 z-[95] bg-slate-950/90">
      <button
        type="button"
        aria-label="Đóng drawer"
        className="absolute inset-0 cursor-default"
        onClick={isSubmitting ? undefined : onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[1180px] flex-col overflow-hidden border-l border-[var(--admin-card-border)] bg-slate-900 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-white shadow-2xl">
        <DrawerHeader
          mode={mode}
          title={
            mode === "import"
              ? "Thêm tài liệu RAG"
              : getString(detailRecord, "title") || "Chi tiết tài liệu RAG"
          }
          description={
            mode === "import"
              ? "Upload tài liệu kỹ thuật và bổ sung metadata để AI truy xuất đúng ngữ cảnh."
              : "Theo dõi trạng thái xử lý, dữ liệu chunks và thông tin phân loại của tài liệu."
          }
          isSubmitting={isSubmitting}
          onClose={onClose}
          status={mode === "detail" ? getString(detailRecord, "status") : null}
        />

        {errorMessage ? <ErrorBanner message={errorMessage} /> : null}

        <div className="min-h-0 flex-1 overflow-y-auto p-5 xl:p-6">
          {mode === "import" ? (
            <ImportLayout
              form={form}
              tagsPreview={tagsPreview}
              fileExtension={fileExtension}
              isDragging={isDragging}
              isSuggestingMetadata={isSuggestingMetadata}
              metadataHintMessage={metadataHintMessage}
              metadataHintError={metadataHintError}
              setForm={setForm}
              onDraggingChange={setIsDragging}
              onSelectFile={handleSelectFile}
            />
          ) : (
            <DetailLayout
              detail={detailRecord}
              isLoading={isLoading}
              onOpenChunks={onOpenChunks}
            />
          )}
        </div>

        <DrawerFooter
          mode={mode}
          formHasFile={Boolean(form.file)}
          isSubmitting={isSubmitting}
          detailId={selectedDocumentId}
          onClose={onClose}
          onSubmit={handleSubmit}
          onOpenChunks={onOpenChunks}
        />
      </aside>
    </div>
  );
}

function DetailStatusBadge({ status }: { status: string }) {
  const toneClass = {
    READY:
      "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    FAILED:
      "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
    ARCHIVED:
      "border-[#64748B]/35 bg-[#64748B]/10 text-[#475569] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]",
    UPLOADED:
      "border-[#0EA5E9]/35 bg-[#0EA5E9]/10 text-[#0369A1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#38BDF8]",
    PARSING:
      "border-[#0EA5E9]/35 bg-[#0EA5E9]/10 text-[#0369A1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#38BDF8]",
    CHUNKING:
      "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
    EMBEDDING:
      "border-[#8B5CF6]/35 bg-[#8B5CF6]/10 text-[#7C3AED] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#C4B5FD]",
  }[status] || "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]";

  return (
    <span
      className={[
        "inline-flex h-6.5 items-center rounded-full border px-2.5 text-[11px] font-black",
        toneClass,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function DrawerHeader({
  mode,
  title,
  description,
  isSubmitting,
  onClose,
  status,
}: {
  mode: DrawerMode;
  title: string;
  description: string;
  isSubmitting: boolean;
  onClose: () => void;
  status?: string | null;
}) {
  return (
    <header className="shrink-0 border-b border-[var(--admin-card-border)] bg-slate-900 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-white px-5 py-4 xl:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-orange-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-orange-600 dark:text-orange-300">
              <Sparkles className="h-3.5 w-3.5" />
              {mode === "import" ? "Import RAG" : "Tài liệu RAG"}
            </div>
            {status && <DetailStatusBadge status={status} />}
          </div>

          <h2 className="mt-2 truncate text-2xl font-bold tracking-tight text-[var(--admin-strong-text)]">
            {title}
          </h2>

          <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-[var(--admin-muted-text)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="shrink-0 border-b border-red-500/20 bg-red-500/10 px-5 py-3 xl:px-6">
      <div className="flex items-start gap-3 text-sm font-bold text-[var(--admin-error)]">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <p>{message}</p>
      </div>
    </div>
  );
}

function ImportLayout({
  form,
  tagsPreview,
  fileExtension,
  isDragging,
  isSuggestingMetadata,
  metadataHintMessage,
  metadataHintError,
  setForm,
  onDraggingChange,
  onSelectFile,
}: {
  form: ImportRagDocumentFormValues;
  tagsPreview: string[];
  fileExtension: string | null;
  isDragging: boolean;
  isSuggestingMetadata: boolean;
  metadataHintMessage: string | null;
  metadataHintError: string | null;
  setForm: React.Dispatch<React.SetStateAction<ImportRagDocumentFormValues>>;
  onDraggingChange: (value: boolean) => void;
  onSelectFile: (file: File | null) => Promise<void> | void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="min-w-0 space-y-5 xl:sticky xl:top-0 xl:self-start">
        <UploadArea
          file={form.file}
          fileExtension={fileExtension}
          isDragging={isDragging}
          onDraggingChange={onDraggingChange}
          onSelectFile={onSelectFile}
        />

        <section className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />

            <div>
              <h3 className="text-sm font-bold text-[var(--admin-strong-text)]">
                Lưu ý:
              </h3>

              <ul className="mt-2 space-y-2 text-sm font-semibold leading-6 text-[var(--admin-muted-text)]">
                <li>PDF scan cần OCR trước để AI đọc được nội dung.</li>
                <li>Nên nhập nhóm thiết bị, hãng và model nếu có.</li>
                <li>Tags nên cách nhau bằng dấu phẩy.</li>
              </ul>
            </div>
          </div>
        </section>

        {form.file ? (
          <section className="rounded-2xl border border-orange-300/25 bg-orange-400/10 p-4">
            <div className="flex items-start gap-3">
              {isSuggestingMetadata ? (
                <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-orange-500" />
              ) : metadataHintError ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              ) : (
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
              )}

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[var(--admin-strong-text)]">
                  Chế độ Import RAG tri thức
                </h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-[var(--admin-muted-text)]">
                  {isSuggestingMetadata
                    ? "Hệ thống đang đọc file và tự điền thử tên tài liệu, nhóm thiết bị, hãng, model và từ khóa."
                    : metadataHintError ||
                    metadataHintMessage ||
                    "Sau khi chọn file, hệ thống sẽ cố gắng tự điền các thông tin cơ bản để bạn đỡ phải nhập tay."}
                </p>
              </div>
            </div>
          </section>
        ) : null}
      </aside>

      <main className="min-w-0 space-y-5">
        <FormSection
          title="Thông tin tài liệu"
          description="Các trường chính giúp quản trị viên nhận diện tài liệu."
          icon={<FileText />}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Field label="Tên tài liệu">
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="VD: Hướng dẫn lỗi máy lạnh Daikin"
                />
              </Field>
            </div>

            <Field label="Loại tài liệu">
              <select
                value={form.kind}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    kind: event.target.value as RagDocumentKind | "",
                  }))
                }
                className={inputClass}
              >
                <option value="">Chưa chọn</option>
                {kindOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quyền xem">
              <select
                value={form.accessLevel}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    accessLevel: event.target.value as "BASIC" | "ADVANCED",
                  }))
                }
                className={inputClass}
              >
                <option value="BASIC">Cơ bản</option>
                <option value="ADVANCED">Chỉ kỹ thuật viên</option>
              </select>
            </Field>

            <div className="lg:col-span-2">
              <Field label="Mô tả ngắn">
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className={textareaClass}
                  placeholder="VD: Lỗi thường gặp, cách kiểm tra ban đầu, lưu ý an toàn"
                />
              </Field>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Phân loại AI"
          description="Giúp RAG lấy đúng tài liệu theo thiết bị, hãng và model."
          icon={<Wrench />}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Nhóm thiết bị">
              <input
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Máy lạnh"
              />
            </Field>

            <Field label="Hãng">
              <input
                value={form.brand}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    brand: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Daikin"
              />
            </Field>

            <Field label="Mã model">
              <input
                value={form.modelCode}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    modelCode: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="FTKB35"
              />
            </Field>

            <Field label="Nguồn">
              <input
                value={form.source}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    source: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Manual 2024"
              />
            </Field>

            <div className="lg:col-span-2">
              <Field label="Từ khóa">
                <input
                  value={form.tags}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      tags: event.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="máy lạnh, inverter, bảo trì"
                />
              </Field>

              {tagsPreview.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tagsPreview.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 py-1 text-xs font-bold text-[var(--admin-muted-text)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </FormSection>
      </main>
    </div>
  );
}

function UploadArea({
  file,
  fileExtension,
  isDragging,
  onDraggingChange,
  onSelectFile,
}: {
  file: File | null;
  fileExtension: string | null;
  isDragging: boolean;
  onDraggingChange: (value: boolean) => void;
  onSelectFile: (file: File | null) => void;
}) {
  return (
    <section className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          onDraggingChange(true);
        }}
        onDragLeave={() => onDraggingChange(false)}
        onDrop={(event) => {
          event.preventDefault();
          onDraggingChange(false);
          void onSelectFile(event.dataTransfer.files?.[0] || null);
        }}
        className={[
          "flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-7 text-center transition",
          isDragging
            ? "border-orange-400 bg-orange-400/10"
            : "border-[var(--admin-card-border)] bg-[var(--admin-card-bg)]/70 hover:border-orange-400 hover:bg-orange-400/5",
        ].join(" ")}
      >
        <input
          type="file"
          accept=".txt,.md,.csv,.docx,.xlsx,.xls,.pdf"
          className="hidden"
          onChange={(event) =>
            void onSelectFile(event.target.files?.[0] || null)
          }
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-300/30 bg-orange-400/15 text-orange-500 shadow-lg shadow-orange-500/10 dark:text-orange-300">
          <UploadCloud className="h-8 w-8" />
        </div>

        <p className="mt-4 max-w-full break-words text-lg font-bold leading-7 text-[var(--admin-strong-text)]">
          {file ? file.name : "Chọn file tài liệu"}
        </p>

        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--admin-muted-text)]">
          Kéo thả file vào đây hoặc bấm để chọn từ máy.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["PDF", "DOCX", "XLSX", "CSV", "TXT", "MD"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 py-1 text-xs font-bold text-[var(--admin-muted-text)]"
            >
              {item}
            </span>
          ))}
        </div>

        {file ? (
          <div className="mt-5 grid w-full grid-cols-2 gap-3">
            <FileMeta label="Dung lượng" value={formatFileSize(file.size)} />
            <FileMeta label="Định dạng" value={fileExtension || "--"} />
          </div>
        ) : null}
      </label>
    </section>
  );
}

function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-300/20 bg-orange-400/10 text-orange-500 dark:text-orange-300 [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>

        <div>
          <h3 className="text-lg font-bold text-[var(--admin-strong-text)]">
            {title}
          </h3>

          <p className="mt-1 text-sm font-semibold leading-6 text-[var(--admin-muted-text)]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

const kindLabelMap: Record<string, string> = {
  TROUBLESHOOTING_GUIDE: "Hướng dẫn xử lý lỗi",
  DEVICE_MANUAL: "Manual thiết bị",
  FAQ: "FAQ",
  REPAIR_POLICY: "Chính sách sửa chữa",
  PRICE_TABLE: "Bảng giá",
  INTERNAL_NOTE: "Ghi chú nội bộ",
};

function DetailLayout({
  detail,
  isLoading,
  onOpenChunks,
}: {
  detail: Record<string, unknown> | null;
  isLoading: boolean;
  onOpenChunks?: (documentId: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)]">
        <div className="flex items-center gap-3 text-sm font-bold text-[var(--admin-muted-text)]">
          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
          Đang tải thông tin chi tiết tài liệu...
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-8 text-center">
        <p className="text-base font-bold text-[var(--admin-muted-text)]">
          Không tìm thấy thông tin tài liệu.
        </p>
      </div>
    );
  }

  const id = getNumber(detail, "id");
  const title = getString(detail, "title") || "Tài liệu không tên";
  const kind = getString(detail, "kind");
  const kindLabel = kind ? (kindLabelMap[kind] || kind) : "Chưa phân loại";
  const accessLevel = getString(detail, "accessLevel");
  const accessLevelText = accessLevel === "BASIC" ? "Cơ bản" : "Chỉ kỹ thuật viên";
  const status = (getString(detail, "status") as any) || "READY";
  const isActive = Boolean(detail.isActive ?? true);
  const fileType = (getString(detail, "fileType") || "UNKNOWN") as any;

  const originalFileName =
    getString(detail, "originalFileName") ||
    getString(detail, "storedFileName") ||
    getString(detail, "source") ||
    "--";
  const originalFileUrl = getString(detail, "fileUrl");

  const tags = detail.tags;
  let tagsArray: string[] = [];
  if (Array.isArray(tags)) {
    tagsArray = tags as string[];
  } else if (typeof tags === "string") {
    tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <main className="min-w-0 space-y-6">
        <section className="rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-3.5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={[
                    "inline-flex h-9 items-center gap-2 rounded-full px-4.5 text-xs font-black shadow-md",
                    !isActive || status === "ARCHIVED"
                      ? "bg-slate-600 text-white shadow-slate-600/20"
                      : status === "READY"
                        ? "bg-emerald-600 text-white shadow-emerald-600/20"
                        : status === "FAILED" || status === "CANCELLED"
                          ? "bg-rose-600 text-white shadow-rose-600/20"
                          : "bg-sky-600 text-white shadow-sky-600/20",
                  ].join(" ")}
                >
                  {!isActive || status === "ARCHIVED" ? (
                    <>
                      <Archive className="h-4 w-4" />
                      Đã lưu trữ
                    </>
                  ) : status === "READY" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Hoạt động
                    </>
                  ) : status === "FAILED" ? (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      Thất bại
                    </>
                  ) : status === "CANCELLED" ? (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      Đã hủy
                    </>
                  ) : status === "UPLOADED" ? (
                    <>
                      <Database className="h-4 w-4" />
                      Đã tải lên
                    </>
                  ) : status === "PARSING" ? (
                    <>
                      <Clock className="h-4 w-4" />
                      Đang xử lý
                    </>
                  ) : status === "CHUNKING" ? (
                    <>
                      <Clock className="h-4 w-4" />
                      Đang chia chunk
                    </>
                  ) : status === "EMBEDDING" ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Đang tạo vector
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      {status === "PENDING" ? "Chờ xử lý" : status === "PROCESSING" ? "Đang xử lý" : status}
                    </>
                  )}
                </span>

                {(() => {
                  const source = getString(detail, "source");
                  const sourceUpper = (source || "").toUpperCase();
                  const upper = fileType ? fileType.toUpperCase() : "UNKNOWN";
                  const isChatSession =
                    sourceUpper.startsWith("CHAT_SESSION") ||
                    (upper === "UNKNOWN" && (sourceUpper.includes("CHAT") || !sourceUpper.includes(".")));

                  const meta = isChatSession
                    ? { label: "Phiên chat", bg: "bg-cyan-600 shadow-cyan-600/20", icon: MessageSquareText }
                    : upper === "PDF" || sourceUpper.endsWith(".PDF")
                      ? { label: "Tài liệu PDF", bg: "bg-rose-600 shadow-rose-600/20", icon: FileText }
                      : upper === "DOCX" || upper === "DOC" || sourceUpper.endsWith(".DOCX") || sourceUpper.endsWith(".DOC")
                        ? { label: "Word (DOCX)", bg: "bg-blue-600 shadow-blue-600/20", icon: FileText }
                        : upper === "XLSX" || upper === "XLS" || upper === "CSV" || sourceUpper.endsWith(".XLSX") || sourceUpper.endsWith(".XLS") || sourceUpper.endsWith(".CSV")
                          ? { label: upper === "CSV" || sourceUpper.endsWith(".CSV") ? "Bảng CSV" : "Excel (XLSX)", bg: "bg-emerald-600 shadow-emerald-600/20", icon: FileText }
                          : upper === "TXT" || upper === "MD" || sourceUpper.endsWith(".TXT") || sourceUpper.endsWith(".MD")
                            ? { label: upper === "MD" || sourceUpper.endsWith(".MD") ? "Markdown (.md)" : "Văn bản (TXT)", bg: "bg-amber-500 shadow-amber-500/20 text-slate-950", icon: FileText }
                            : upper === "JSON" || upper === "HTML" || sourceUpper.endsWith(".JSON") || sourceUpper.endsWith(".HTML")
                              ? { label: upper === "HTML" || sourceUpper.endsWith(".HTML") ? "Trang Web (HTML)" : "Dữ liệu JSON", bg: "bg-purple-600 shadow-purple-600/20", icon: FileText }
                              : { label: upper !== "UNKNOWN" ? upper : "Tài liệu", bg: "bg-slate-600 shadow-slate-600/20", icon: FileText };

                  const IconComp = meta.icon;

                  return (
                    <span className={["inline-flex h-9 items-center gap-2 rounded-full px-4.5 text-xs font-black shadow-md text-white", meta.bg].join(" ")}>
                      <IconComp className="h-4 w-4" />
                      {meta.label}
                    </span>
                  );
                })()}

                <span
                  className={[
                    "inline-flex h-9 items-center gap-2 rounded-full px-4.5 text-xs font-black text-white shadow-md",
                    accessLevel === "BASIC" ? "bg-emerald-600 shadow-emerald-600/20" : "bg-amber-500 shadow-amber-500/20",
                  ].join(" ")}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {accessLevelText}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold leading-snug text-[var(--admin-strong-text)]">
                {title}
              </h2>

              <div className="flex items-center gap-2.5 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 py-2.5 text-base">
                <span className="font-extrabold text-[var(--admin-muted-text)]">File gốc:</span>
                <span className="font-extrabold text-[var(--admin-strong-text)] truncate" title={originalFileName}>
                  {originalFileName}
                </span>
              </div>
            </div>

            {originalFileUrl ? (
              <a
                href={originalFileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/15 px-5 text-sm font-black text-orange-500 transition hover:bg-orange-500/25 active:scale-95 shadow-sm"
              >
                <ExternalLink className="h-4.5 w-4.5" />
                Mở file gốc
              </a>
            ) : null}
          </div>
        </section>

        <div className="grid grid-cols-3 gap-3.5">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5 shadow-sm flex flex-col justify-between space-y-2.5">
            <span className="absolute inset-x-0 top-0 h-1 bg-orange-500" />
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--admin-muted-text)]">
              <Database className="h-4.5 w-4.5 text-orange-500" />
              <span>Tổng Chunks</span>
            </div>
            <p className="text-2xl font-black text-[var(--admin-strong-text)]">
              {getDisplayValue(detail, "totalChunks")}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5 shadow-sm flex flex-col justify-between space-y-2.5">
            <span className="absolute inset-x-0 top-0 h-1 bg-cyan-500" />
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--admin-muted-text)]">
              <FileText className="h-4.5 w-4.5 text-cyan-500" />
              <span>Số ký tự</span>
            </div>
            <p className="text-2xl font-black text-[var(--admin-strong-text)]">
              {getDisplayValue(detail, "totalCharacters")}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5 shadow-sm flex flex-col justify-between space-y-2.5">
            <span className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--admin-muted-text)]">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
              <span>Ngày nạp tri thức</span>
            </div>
            <p className="text-base font-black text-[var(--admin-strong-text)] truncate" title={getString(detail, "indexedAt") || "--"}>
              {getString(detail, "indexedAt") ? new Date(getString(detail, "indexedAt")!).toLocaleDateString("vi-VN") : "--"}
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-orange-500">
              <Wrench className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-extrabold text-[var(--admin-strong-text)]">
              Phân loại & Thuộc tính RAG
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4 space-y-1.5">
              <p className="text-[13px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Nhóm thiết bị</p>
              <p className="text-[16px] font-extrabold text-[var(--admin-strong-text)]">{getString(detail, "category") || "--"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4 space-y-1.5">
              <p className="text-[13px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Hãng sản xuất</p>
              <p className="text-[16px] font-extrabold text-[var(--admin-strong-text)]">{getString(detail, "brand") || "--"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4 space-y-1.5">
              <p className="text-[13px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Mã Model</p>
              <p className="text-[16px] font-extrabold text-[var(--admin-strong-text)]">{getString(detail, "modelCode") || "--"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4 space-y-1.5">
              <p className="text-[13px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Loại tài liệu</p>
              <p className="text-[16px] font-extrabold text-[var(--admin-strong-text)]">{kindLabel}</p>
            </div>
            <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4 space-y-1.5">
              <p className="text-[13px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Nguồn tri thức</p>
              <p className="text-[16px] font-extrabold text-[var(--admin-strong-text)]">{getString(detail, "source") || "--"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4 space-y-1.5">
              <p className="text-[13px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Quyền truy cập</p>
              <p className="text-[16px] font-extrabold text-[var(--admin-strong-text)]">{accessLevelText}</p>
            </div>
          </div>

          {tagsArray.length > 0 && (
            <div className="pt-4 border-t border-[var(--admin-card-border)] space-y-3">
              <p className="text-[13px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Từ khóa (Tags RAG)
              </p>
              <div className="flex flex-wrap gap-2.5">
                {tagsArray.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-4 py-1.5 text-sm font-black text-slate-950 shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {getString(detail, "description") ? (
          <section className="rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-orange-500">
                <Info className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-extrabold text-[var(--admin-strong-text)]">
                Mô tả chi tiết
              </h3>
            </div>
            <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4.5">
              <p className="text-base font-medium leading-relaxed text-[var(--admin-strong-text)] whitespace-pre-wrap">
                {getString(detail, "description")}
              </p>
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-orange-500">
                <Database className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-extrabold text-[var(--admin-strong-text)]">
                Xem trước Chunks
              </h3>
            </div>

            {id && onOpenChunks ? (
              <button
                type="button"
                onClick={() => onOpenChunks(id)}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 text-xs font-black text-white shadow-md transition active:scale-95"
              >
                <Database className="h-4 w-4" />
                Xem tất cả Chunks
              </button>
            ) : null}
          </div>

          <div className="space-y-3.5">
            {Array.isArray(detail.chunksPreview) && detail.chunksPreview.length > 0 ? (
              (detail.chunksPreview as any[]).slice(0, 5).map((chunk: any) => (
                <article
                  key={chunk.id}
                  className="rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5 space-y-3 shadow-md transition hover:border-orange-500/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1 text-xs font-black text-white shadow-sm">
                      <Database className="h-3.5 w-3.5" />
                      Chunk #{chunk.chunkIndex + 1}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 py-1 text-xs font-extrabold text-[var(--admin-strong-text)]">
                      <span>{chunk.charCount ?? 0} ký tự</span>
                      <span className="text-slate-500">·</span>
                      <span>{chunk.tokenCount ?? 0} tokens</span>
                    </span>
                  </div>

                  <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4.5">
                    <p className="text-[17px] font-extrabold leading-relaxed text-[var(--admin-strong-text)] line-clamp-3 select-text">
                      {chunk.contentPreview}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-8 text-center text-base font-extrabold text-[var(--admin-muted-text)]">
                Tài liệu này chưa có chunk preview.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Right Sidebar Timeline */}
      <aside className="min-w-0 space-y-5 xl:sticky xl:top-0 xl:self-start">
        <section className="rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-5.5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-orange-500">
              <Clock className="h-4.5 w-4.5" />
            </span>
            <h3 className="text-base font-extrabold text-[var(--admin-strong-text)]">
              Lịch sử xử lý tri thức
            </h3>
          </div>

          <div className="flex flex-col rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4.5">
            <TimelineItem label="Tải lên hệ thống" value={getString(detail, "createdAt") || "--"} isCompleted={true} />
            <TimelineItem label="Đã phân tích nội dung" value={getString(detail, "parsedAt") || "--"} isCompleted={Boolean(getString(detail, "parsedAt"))} />
            <TimelineItem label="Đã sẵn sàng tra cứu AI" value={getString(detail, "indexedAt") || "--"} isCompleted={Boolean(getString(detail, "indexedAt"))} isLast={true} />
          </div>
        </section>
      </aside>
    </div>
  );
}

function DrawerFooter({
  mode,
  formHasFile,
  isSubmitting,
  detailId,
  onClose,
  onSubmit,
  onOpenChunks,
}: {
  mode: DrawerMode;
  formHasFile: boolean;
  isSubmitting: boolean;
  detailId: number | null;
  onClose: () => void;
  onSubmit: () => void;
  onOpenChunks?: (documentId: number) => void;
}) {
  return (
    <footer className="shrink-0 border-t border-[var(--admin-card-border)] bg-slate-900 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-white px-5 py-4 xl:px-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-[var(--admin-muted-text)]">
          {mode === "import"
            ? "Có thể bổ sung metadata sau nếu chưa chắc."
            : "Mở chunks để kiểm tra nội dung AI đã tách từ tài liệu."}
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-6 text-sm font-bold text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Đóng
          </button>

          {mode === "import" ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!formHasFile || isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 px-7 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
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
          ) : detailId ? (
            <button
              type="button"
              onClick={() => onOpenChunks?.(detailId)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 px-7 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 transition hover:scale-[1.01]"
            >
              <Database className="h-4 w-4" />
              Xem chunks
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[var(--admin-strong-text)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function FileMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-3 text-left">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-[var(--admin-strong-text)]">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-300/20 bg-orange-400/10 text-orange-500 dark:text-orange-300 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>

      <h3 className="text-lg font-black text-[var(--admin-strong-text)]">
        {title}
      </h3>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-4">
      <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
        {label}
      </p>
      <p className="mt-2 break-words text-[15px] font-bold text-[var(--admin-strong-text)]">
        {value || "--"}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 py-3.5">
      <span className="text-[14px] font-bold text-[var(--admin-muted-text)]">
        {label}
      </span>
      <span className="text-[16px] font-bold text-[var(--admin-strong-text)]">
        {value}
      </span>
    </div>
  );
}

function TimelineItem({
  label,
  value,
  isLast = false,
  isCompleted = false,
}: {
  label: string;
  value: string | null;
  isLast?: boolean;
  isCompleted?: boolean;
}) {
  const formattedTime = formatMaybeDate(value);
  const hasValue = Boolean(value && formattedTime !== "--");

  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center">
        <div
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 shadow-sm",
            isCompleted
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-slate-400 dark:text-slate-500",
          ].join(" ")}
        >
          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : "○"}
        </div>
        {!isLast && (
          <div
            className={[
              "w-0.5 flex-1 my-1.5 min-h-[26px] rounded-full transition-colors duration-200",
              isCompleted ? "bg-emerald-500/70" : "bg-[var(--admin-card-border)]",
            ].join(" ")}
          />
        )}
      </div>
      <div className="pb-4 pt-0.5">
        <p className="text-sm font-extrabold text-[var(--admin-strong-text)]">
          {label}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[var(--admin-muted-text)]">
          <Clock className="h-3.5 w-3.5 text-orange-500 shrink-0" />
          <span>{hasValue ? formattedTime : "Chưa thực hiện"}</span>
        </div>
      </div>
    </div>
  );
}

function appendIfPresent(formData: FormData, key: string, value?: string | null) {
  const trimmed = value?.trim();
  if (trimmed) {
    formData.append(key, trimmed);
  }
}

function getString(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return null;
}

function getNumber(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  return typeof value === "number" ? value : null;
}

function getDisplayValue(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  if (typeof value === "number") return value.toLocaleString("vi-VN");
  if (typeof value === "bigint") return value.toLocaleString("vi-VN");
  if (typeof value === "string" && value.trim()) return value;
  return "0";
}

function formatFileSize(size: number | string | null) {
  if (size === null || size === undefined) return "--";
  const numeric = Number(size);
  if (Number.isNaN(numeric) || numeric <= 0) return "--";
  if (numeric < 1024) return `${numeric} B`;
  if (numeric < 1024 * 1024) return `${(numeric / 1024).toFixed(1)} KB`;
  return `${(numeric / 1024 / 1024).toFixed(1)} MB`;
}

function formatMaybeDate(value: string | null) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
