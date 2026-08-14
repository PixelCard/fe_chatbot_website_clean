"use client";

import type { RefObject } from "react";
import {
  AlertTriangle,
  Bot,
  FileWarning,
  Zap,
} from "lucide-react";

import type { ChatUiMessage } from "@/app/hooks/useChatbotApi";
import type { ApiError } from "@/app/services/apiClient";

function AiAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20 dark:from-[#06B6D4] dark:to-[#0284C7] dark:shadow-[#06B6D4]/20 sm:h-10 sm:w-10">
      <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-full justify-start gap-2 sm:gap-3">
      <AiAvatar />

      <div className="rounded-[18px] rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-[#1E2A3F] dark:bg-[#101B2E] sm:rounded-[24px] sm:px-5 sm:py-4">
        <p className="mb-1.5 text-[12px] font-black text-slate-600 dark:text-slate-300 sm:mb-2 sm:text-[13px]">
          SmartElec AI đang nhập
        </p>

        <div className="flex items-center gap-2">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-2 w-2 animate-bounce rounded-full bg-orange-500 dark:bg-[#22D3EE] sm:h-2.5 sm:w-2.5"
              style={{
                animationDelay: `${item * 140}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeviceSwitchBubble({
  message,
}: {
  message: ChatUiMessage;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[18px] border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-amber-900 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-100 sm:rounded-[24px] sm:px-5 sm:py-4">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-amber-500/20 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300 sm:h-10 sm:w-10 sm:rounded-[16px]">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-black sm:text-[15px]">
            Cảnh báo lệch thiết bị
          </p>

          <p className="mt-1.5 whitespace-pre-wrap text-[13px] font-semibold leading-6 sm:mt-2 sm:text-[14px] sm:leading-7">
            {message.content}
          </p>

          <div className="mt-2.5 grid gap-2 text-[12px] font-bold sm:mt-3 sm:grid-cols-2 sm:text-[13px]">
            <div className="rounded-lg bg-white/70 px-2.5 py-2 dark:bg-black/20 sm:rounded-xl sm:px-3">
              Thiết bị hiện tại:{" "}
              {message.deviceSwitch?.currentDevice ||
                "Chưa xác định"}
            </div>

            <div className="rounded-lg bg-white/70 px-2.5 py-2 dark:bg-black/20 sm:rounded-xl sm:px-3">
              Thiết bị phát hiện:{" "}
              {message.deviceSwitch?.detectedDevice ||
                "Chưa xác định"}
            </div>
          </div>

          {message.deviceSwitch?.actions?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.deviceSwitch.actions.map((action) => (
                <span
                  key={`${message.id}-${action.action}`}
                  className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] dark:border-amber-400/30"
                >
                  {action.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function UserBubble({
  message,
}: {
  message: ChatUiMessage;
}) {
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[90%] overflow-hidden rounded-[18px] rounded-br-md border border-orange-300/40 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 px-4 py-2.5 text-[14px] font-bold leading-6 text-white shadow-md dark:border-[#0891B2] dark:from-[#0891B2] dark:to-[#0284C7] sm:max-w-[78%] sm:rounded-[24px] sm:px-5 sm:py-3.5 sm:text-[15px] sm:leading-7">
        {message.type === "image" && message.mediaUrl ? (
          <div className="space-y-2.5 sm:space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.mediaUrl}
              alt={message.content}
              className="max-h-[220px] w-full rounded-lg object-cover sm:max-h-[320px] sm:rounded-xl"
            />

            <p className="break-words text-[13px] font-semibold text-white/90 [overflow-wrap:anywhere]">
              {message.content}
            </p>
          </div>
        ) : null}

        {message.type === "video" && message.mediaUrl ? (
          <div className="space-y-2.5 sm:space-y-3">
            <video
              src={message.mediaUrl}
              controls
              className="max-h-[220px] w-full rounded-lg bg-black sm:max-h-[320px] sm:rounded-xl"
            />

            <p className="break-words text-[13px] font-semibold text-white/90 [overflow-wrap:anywhere]">
              {message.content}
            </p>
          </div>
        ) : null}

        {message.type === "text" ? (
          <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {message.content}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={`${part}-${index}`}
          className="font-extrabold text-slate-900 dark:text-white"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function AssistantBubble({
  message,
}: {
  message: ChatUiMessage;
}) {
  const contentLines = message.content
    .split("\n")
    .filter((line) => line.trim());

  return (
    <div className="flex w-full justify-start gap-2 sm:gap-3">
      <AiAvatar />

      <div className="max-w-[91%] rounded-[18px] rounded-bl-md border border-slate-200 bg-white px-4 py-2.5 text-[14px] font-semibold leading-6 text-slate-800 shadow-sm dark:border-[#1E2A3F] dark:bg-[#101B2E] dark:text-slate-50 sm:max-w-[80%] sm:rounded-[24px] sm:px-5 sm:py-3.5 sm:text-[15px] sm:leading-7">
        <div className="space-y-2.5 sm:space-y-3">
          {contentLines.map((line, index) =>
            /^(\*\*)?Bước\s+\d+:/i.test(line) ? (
              <div
                key={`${message.id}-${index}`}
                className="rounded-xl border border-orange-100 bg-orange-50 px-3.5 py-2.5 text-[13px] font-black text-orange-700 dark:border-cyan-400/30 dark:bg-cyan-500/15 dark:text-cyan-200 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-[14px]"
              >
                {line.replace(/\*\*/g, "")}
              </div>
            ) : (
              <p
                key={`${message.id}-${index}`}
                className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
              >
                {renderInlineMarkdown(line)}
              </p>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

type ChatMessageListProps = {
  messages: ChatUiMessage[];
  chatClosed: boolean;
  feedbackPending: boolean;
  feedbackSubmitted: boolean;
  feedbackChoice: "LIKE" | "DISLIKE" | null;
  isSubmittingFeedback: boolean;
  isSubmitting: boolean;
  isUploadingMedia: boolean;
  error: ApiError | null;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onSubmitFeedback: (
    feedback: "LIKE" | "DISLIKE",
  ) => Promise<unknown>;
};

export function ChatMessageList({
  messages,
  chatClosed,
  feedbackPending,
  feedbackSubmitted,
  feedbackChoice,
  isSubmittingFeedback,
  isSubmitting,
  isUploadingMedia,
  error,
  messagesEndRef,
  onSubmitFeedback,
}: ChatMessageListProps) {
  const shouldShowFeedbackPanel =
    chatClosed && (feedbackPending || feedbackSubmitted);

  return (
    <div
      data-chat-scroll-container="true"
      className="relative min-h-0 flex-1 overscroll-contain overflow-y-auto scroll-smooth bg-[#f8fafc] dark:bg-[#07111f]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-orange-200/14 blur-[100px] dark:bg-blue-500/10" />

        <div className="absolute bottom-8 right-[-2rem] h-64 w-64 rounded-full bg-blue-200/10 blur-[110px] dark:bg-cyan-500/8" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#f8fafc] to-transparent dark:from-[#07111f] sm:h-24" />

      <div className="relative mx-auto flex min-h-full w-full max-w-[960px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-6 md:py-6">
        {messages.length <= 1 ? (
          <div className="mb-1 rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] dark:border-slate-700/80 dark:bg-[#0f1d31] dark:shadow-[0_14px_30px_rgba(0,0,0,0.20)] sm:rounded-[24px] sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-orange-50 text-orange-600 dark:bg-blue-500/12 dark:text-blue-300 sm:h-12 sm:w-12 sm:rounded-[18px]">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <div>
                <p className="text-[16px] font-black text-slate-900 dark:text-slate-50 sm:text-[18px]">
                  Bắt đầu bằng cách mô tả lỗi
                </p>

                <p className="mt-1.5 text-[13px] font-semibold leading-6 text-slate-600 dark:text-slate-300 sm:mt-2 sm:text-[14px] sm:leading-7">
                  Ví dụ: “Máy lạnh không lạnh”, “Tủ lạnh kêu rè rè”, “Laptop tự
                  tắt khi đang dùng”. AI sẽ hỏi thêm để gom thông tin trước khi
                  đề xuất gọi thợ.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {messages.map((message) => {
          if (message.type === "device-switch") {
            return (
              <DeviceSwitchBubble
                key={message.id}
                message={message}
              />
            );
          }

          if (message.role === "user") {
            return (
              <UserBubble
                key={message.id}
                message={message}
              />
            );
          }

          return (
            <AssistantBubble
              key={message.id}
              message={message}
            />
          );
        })}

        {isSubmitting || isUploadingMedia ? (
          <TypingIndicator />
        ) : null}

        {error ? (
          <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-600 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 sm:rounded-[22px] sm:px-5 sm:py-4 sm:text-[14px]">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <FileWarning className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error.message}</p>
            </div>
          </div>
        ) : null}

        {shouldShowFeedbackPanel ? (
          <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700/80 dark:bg-[#102036] dark:shadow-[0_12px_28px_rgba(0,0,0,0.20)] sm:rounded-[24px] sm:px-5 sm:py-5">
            <p className="text-[15px] font-black text-slate-900 dark:text-slate-50 sm:text-[16px]">
              Đoạn tư vấn này có hữu ích không?
            </p>

            {feedbackSubmitted ? (
              <p className="mt-3 text-[14px] font-semibold text-slate-600 dark:text-slate-300">
                Cảm ơn bạn đã đánh giá.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-wrap sm:gap-3">
                <button
                  type="button"
                  disabled={isSubmittingFeedback}
                  onClick={() =>
                    void onSubmitFeedback("LIKE")
                  }
                  className={[
                    "rounded-[13px] border px-3 py-2.5 text-[13px] font-black transition sm:rounded-[16px] sm:px-4 sm:text-[14px]",
                    feedbackChoice === "LIKE"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:text-blue-300",
                  ].join(" ")}
                >
                  Hữu ích
                </button>

                <button
                  type="button"
                  disabled={isSubmittingFeedback}
                  onClick={() =>
                    void onSubmitFeedback("DISLIKE")
                  }
                  className={[
                    "rounded-[13px] border px-3 py-2.5 text-[13px] font-black transition sm:rounded-[16px] sm:px-4 sm:text-[14px]",
                    feedbackChoice === "DISLIKE"
                      ? "border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                      : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:text-blue-300",
                  ].join(" ")}
                >
                  Không hữu ích
                </button>
              </div>
            )}
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
