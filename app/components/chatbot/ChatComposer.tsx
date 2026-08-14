"use client";

import {
  Camera,
  CheckCircle2,
  Loader2,
  Paperclip,
  Send,
  Upload,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

type ChatComposerProps = {
  chatClosed: boolean;
  selectedFile: File | null;
  selectedFilePreview: string | null;
  mediaDeviceType: string;
  draft: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isSubmitting: boolean;
  isUploadingMedia: boolean;
  hasError: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSelectedFile: () => void;
  onMediaDeviceTypeChange: (value: string) => void;
  onDraftChange: (value: string) => void;
  onClearError: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ChatComposer({
  chatClosed,
  selectedFile,
  selectedFilePreview,
  mediaDeviceType,
  draft,
  fileInputRef,
  isSubmitting,
  isUploadingMedia,
  hasError,
  onFileSelect,
  onClearSelectedFile,
  onMediaDeviceTypeChange,
  onDraftChange,
  onClearError,
  onSubmit,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isInputDisabled = chatClosed || isUploadingMedia;
  const isActionDisabled =
    chatClosed || isSubmitting || isUploadingMedia;

  const canSubmit =
    Boolean(draft.trim() || selectedFile) && !isActionDisabled;

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      132,
    )}px`;
  }, [draft]);

  useEffect(() => {
    if (chatClosed || isSubmitting || isUploadingMedia) {
      return;
    }

    textareaRef.current?.focus();
  }, [chatClosed, isSubmitting, isUploadingMedia]);

  if (chatClosed) {
    return (
      <div className="sticky bottom-0 z-20 shrink-0 border-t border-[var(--client-card-border)] bg-white/94 px-3 py-3 shadow-sm backdrop-blur-2xl dark:bg-[#07111f]/94 sm:px-4">
        <div className="mx-auto flex max-w-[960px] items-center justify-center gap-2.5 rounded-[18px] border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-xs font-black text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Phiên tư vấn đã kết thúc sau khi hoàn tất đặt thợ.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-20 shrink-0 border-t border-[var(--client-card-border)] bg-white/94 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_28px_rgba(255,138,31,0.05)] backdrop-blur-2xl dark:bg-[#07111f]/94 dark:shadow-[0_-10px_28px_rgba(0,0,0,0.20)] sm:px-4 md:pb-2">
      <div className="mx-auto w-full max-w-[960px]">
        {selectedFile ? (
          <div className="mb-2 overflow-hidden rounded-[16px] border border-orange-100/90 bg-white/90 p-3 shadow-[0_10px_26px_rgba(255,138,31,0.07)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/86 dark:shadow-[0_12px_28px_rgba(0,0,0,0.16)] sm:mb-3 sm:rounded-[22px] sm:p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-black text-slate-900 dark:text-slate-100">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={onClearSelectedFile}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-300 sm:h-8 sm:w-8"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedFilePreview ? (
              <div className="mt-2.5 overflow-hidden rounded-[14px] border border-orange-100 bg-white dark:border-slate-700 dark:bg-slate-950 sm:mt-3 sm:rounded-[18px]">
                {selectedFile.type.startsWith("video/") ? (
                  <video
                    src={selectedFilePreview}
                    controls
                    className="max-h-[190px] w-full bg-black sm:max-h-[260px]"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedFilePreview}
                    alt={selectedFile.name}
                    className="max-h-[190px] w-full object-cover sm:max-h-[260px]"
                  />
                )}
              </div>
            ) : null}

            <div className="mt-2.5 sm:mt-3">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.1em] text-orange-600 dark:text-blue-300">
                Thiết bị trong ảnh
              </label>

              <input
                type="text"
                value={mediaDeviceType}
                onChange={(event) =>
                  onMediaDeviceTypeChange(event.target.value)
                }
                placeholder="Ví dụ: Máy lạnh, tủ lạnh..."
                className="h-10 w-full rounded-[13px] border border-orange-100 bg-white px-3.5 text-[13px] font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 sm:h-11 sm:rounded-[16px] sm:px-4 sm:text-[14px]"
                disabled={isUploadingMedia}
              />
            </div>
          </div>
        ) : null}

        <form
          className={[
            "flex w-full items-end rounded-[18px] border p-1.5 transition-all duration-300 sm:rounded-[24px] sm:p-2",
            "bg-white/95 shadow-[0_14px_34px_rgba(255,138,31,0.08)] backdrop-blur-xl",
            "dark:bg-slate-900/92 dark:shadow-[0_18px_60px_rgba(0,0,0,0.34)]",
            hasError
              ? "border-red-300 ring-4 ring-red-500/10 dark:border-red-500/40"
              : "border-slate-200 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-500/10 dark:border-slate-700 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500/20",
          ].join(" ")}
          onSubmit={onSubmit}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={onFileSelect}
          />

          <div className="flex shrink-0 items-center gap-0.5 pl-0.5 sm:gap-1 sm:pl-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300 sm:h-9 sm:w-9"
              disabled={isActionDisabled}
              title="Đính kèm tệp"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300 sm:h-9 sm:w-9"
              disabled={isActionDisabled}
              title="Gửi ảnh/video"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={draft}
            rows={1}
            onChange={(event) => {
              if (hasError) {
                onClearError();
              }

              onDraftChange(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder={
              selectedFile
                ? "Thêm ghi chú cho ảnh/video nếu cần..."
                : "Mô tả sự cố thiết bị của bạn..."
            }
            className="max-h-[104px] min-h-[38px] w-full resize-none overflow-y-auto bg-transparent px-2.5 py-2 text-[14px] font-semibold leading-5 text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 sm:max-h-[120px] sm:min-h-[40px] sm:px-3 sm:py-2.5 sm:text-[15px] sm:leading-6"
            disabled={isInputDisabled}
          />

          <button
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-white transition sm:h-10 sm:w-10",
              canSubmit
                ? "border-orange-300/60 bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_12px_26px_rgba(255,122,0,0.22)] hover:scale-105 hover:shadow-[0_16px_30px_rgba(255,122,0,0.24)] active:scale-95 dark:border-blue-400/20 dark:from-blue-600 dark:to-cyan-500 dark:shadow-[0_12px_26px_rgba(37,99,235,0.26)]"
                : "cursor-not-allowed border-slate-300 bg-slate-300 opacity-70 dark:border-slate-700 dark:bg-slate-700",
            ].join(" ")}
            type="submit"
            disabled={!canSubmit}
          >
            {isUploadingMedia ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : selectedFile ? (
              <Upload className="h-4 w-4" />
            ) : isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <div
          className={
            isSubmitting || isUploadingMedia
              ? "mt-1 flex min-h-3 items-center justify-center sm:min-h-4"
              : "hidden"
          }
        >
          <div className="inline-flex items-center gap-2 text-[12px] font-bold text-orange-600 dark:text-blue-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70 dark:bg-blue-400" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500 dark:bg-blue-400" />
            </span>

            {isUploadingMedia
              ? "Đang tải ảnh/video lên..."
              : "AI đang phản hồi..."}
          </div>
        </div>
      </div>
    </div>
  );
}