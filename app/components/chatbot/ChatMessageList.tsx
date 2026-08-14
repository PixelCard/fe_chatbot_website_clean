"use client";

import { useState, type RefObject } from "react";
import {
  AlertTriangle,
  Bot,
  FileWarning,
  Star,
  Zap,
} from "lucide-react";

import type { ChatUiMessage } from "@/app/hooks/useChatbotApi";
import type { ApiError } from "@/app/services/apiClient";
import { reviewAdminService } from "@/app/Admin/Reviews/services/reviewAdmin.service";

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
  sessionId?: number | null;
  currentDeviceLabel?: string;
  profileName?: string;
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
  sessionId,
  currentDeviceLabel,
  profileName,
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
          if (message.role === "user") {
            return <UserBubble key={message.id} message={message} />;
          }

          if (message.type === "device-switch") {
            return (
              <DeviceSwitchBubble key={message.id} message={message} />
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
          <StarRatingFeedback
            feedbackSubmitted={feedbackSubmitted}
            feedbackChoice={feedbackChoice}
            isSubmittingFeedback={isSubmittingFeedback}
            onSubmitFeedback={onSubmitFeedback}
            sessionId={sessionId}
            currentDeviceLabel={currentDeviceLabel}
            profileName={profileName}
          />
        ) : null}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function getStoredUserInfo(profileNameProp?: string) {
  if (typeof window !== "undefined") {
    try {
      const userProfileRaw = localStorage.getItem("user_profile");
      if (userProfileRaw) {
        const parsed = JSON.parse(userProfileRaw) as {
          name?: string;
          fullName?: string;
          contactName?: string;
          phoneNumber?: string;
          phone?: string;
          contactPhone?: string;
        };
        const resolvedName = parsed.name || parsed.fullName || parsed.contactName;
        const resolvedPhone = parsed.phoneNumber || parsed.phone || parsed.contactPhone;
        if (resolvedName || resolvedPhone) {
          return {
            name: resolvedName?.trim() || profileNameProp || "Khách hàng",
            phone: resolvedPhone?.trim() || "0901234567",
          };
        }
      }

      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const parsed = JSON.parse(userRaw) as {
          fullName?: string;
          name?: string;
          phoneNumber?: string;
          phone?: string;
        };
        const resolvedName = parsed.fullName || parsed.name;
        const resolvedPhone = parsed.phoneNumber || parsed.phone;
        if (resolvedName || resolvedPhone) {
          return {
            name: resolvedName?.trim() || profileNameProp || "Khách hàng",
            phone: resolvedPhone?.trim() || "0901234567",
          };
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  const fallbackName =
    profileNameProp && profileNameProp !== "Khách hàng"
      ? profileNameProp.trim()
      : "Khách hàng";

  return {
    name: fallbackName,
    phone: "0901234567",
  };
}

function StarRatingFeedback({
  feedbackSubmitted,
  feedbackChoice,
  isSubmittingFeedback,
  onSubmitFeedback,
  sessionId,
  currentDeviceLabel,
  profileName,
}: {
  feedbackSubmitted: boolean;
  feedbackChoice: "LIKE" | "DISLIKE" | null;
  isSubmittingFeedback: boolean;
  onSubmitFeedback: (feedback: "LIKE" | "DISLIKE") => Promise<unknown>;
  sessionId?: number | null;
  currentDeviceLabel?: string;
  profileName?: string;
}) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(
    feedbackSubmitted ? (feedbackChoice === "LIKE" ? 5 : 2) : null,
  );

  const starLabels: Record<number, string> = {
    1: "Chưa hài lòng",
    2: "Cần cải thiện",
    3: "Bình thường",
    4: "Tốt & Hữu ích",
    5: "Rất tuyệt vời",
  };

  const handleSelectStar = async (starCount: number) => {
    if (isSubmittingFeedback || feedbackSubmitted) return;
    setSelectedRating(starCount);

    // 1. Tạo và lưu bản ghi Review vào CSDL/Review Admin TRƯỚC TIÊN để xác định 5-sao
    try {
      const now = new Date();
      const existingRaw = localStorage.getItem("smartelec_user_reviews");
      const rawList: Array<{ id: number }> = existingRaw ? JSON.parse(existingRaw) : [];
      const cleanList = rawList.filter((item) => Number(item.id) < 100000000);
      const maxId = cleanList.reduce(
        (max, item) => Math.max(max, Number(item.id) || 10),
        10,
      );
      const nextId = maxId + 1;
      const userInfo = getStoredUserInfo(profileName);
      const activeSessionId = sessionId ?? 147;
      const deviceName = currentDeviceLabel || "Điều hòa";

      const reviewItem = {
        id: nextId,
        sessionId: activeSessionId,
        sessionCode: `SE-${activeSessionId}`,
        userId: 1,
        customerName: userInfo.name,
        customerPhone: userInfo.phone,
        technicianId: 999,
        technicianName: "SmartElec AI Assistant",
        technicianPhone: "1955-AI",
        rating: starCount,
        comment: `Đánh giá ${starCount}/5 sao cho phiên tư vấn AI (${starLabels[starCount] || ""})`,
        tags: starCount >= 4 ? ["Tư vấn rõ ràng", "Nhiệt tình"] : ["Không hài lòng"],
        repairServiceName: deviceName,
        address: "Online Chatbot",
        createdAt: now.toISOString(),
      };

      // Đồng bộ lưu tức thì vào Local Cache & gọi API Review
      localStorage.setItem("smartelec_user_reviews", JSON.stringify([reviewItem, ...cleanList]));
      void reviewAdminService.createReview(reviewItem).catch(() => {});
    } catch {
      // Ignore local storage error
    }

    // 2. Gửi phản hồi tư vấn AI
    const choice = starCount >= 4 ? "LIKE" : "DISLIKE";
    await onSubmitFeedback(choice);
  };

  const activeRating = hoverRating || selectedRating || 0;

  return (
    <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700/80 dark:bg-[#102036] dark:shadow-[0_12px_28px_rgba(0,0,0,0.20)] sm:rounded-[24px] sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-black text-slate-900 dark:text-slate-50 sm:text-[16px]">
            {feedbackSubmitted
              ? "Cảm ơn bạn đã đánh giá!"
              : "Đánh giá chất lượng đoạn tư vấn:"}
          </p>

          {activeRating > 0 ? (
            <p className="mt-1 text-[13px] font-bold text-amber-600 dark:text-amber-400">
              {activeRating}/5 sao - {starLabels[activeRating]}
            </p>
          ) : (
            <p className="mt-1 text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              Vui lòng chọn số sao để giúp chúng tôi cải thiện
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= activeRating;

            return (
              <button
                key={star}
                type="button"
                disabled={isSubmittingFeedback || feedbackSubmitted}
                onMouseEnter={() => !feedbackSubmitted && setHoverRating(star)}
                onMouseLeave={() => !feedbackSubmitted && setHoverRating(0)}
                onClick={() => void handleSelectStar(star)}
                className="group relative p-1 transition-transform hover:scale-125 focus:outline-none disabled:cursor-default"
                aria-label={`Đánh giá ${star} sao`}
              >
                <Star
                  className={[
                    "h-6 w-6 transition-all duration-200 sm:h-7 sm:w-7",
                    isFilled
                      ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                      : "fill-transparent text-slate-300 dark:text-slate-600 group-hover:text-amber-400",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
