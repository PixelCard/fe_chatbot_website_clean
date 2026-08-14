"use client";

import { Bot, Clock, User, Wrench } from "lucide-react";
import type { ReactNode } from "react";

import type { ChatMessage, SenderType } from "../../types/chat.types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const meta = getSenderMeta(message.senderType);
  const isUser = message.senderType === "USER";

  return (
    <div
      className={[
        "flex w-full gap-3 px-2 py-1.5",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      {!isUser ? (
        <MessageAvatar icon={meta.icon} className={meta.iconClass} />
      ) : null}

      <div
        className={[
          "flex min-w-0 flex-col",
          isUser ? "items-end" : "items-start",
        ].join(" ")}
      >
        <MessageMeta
          label={meta.label}
          createdAt={message.createdAt}
          isUser={isUser}
        />

        <div
          className={[
            "whitespace-pre-wrap break-words px-4 py-3 text-[15px] font-semibold leading-7 shadow-sm [overflow-wrap:anywhere]",
            "max-w-[min(86vw,760px)]",
            isUser
              ? "rounded-[22px] rounded-br-md text-left sm:max-w-[min(76vw,680px)]"
              : "rounded-[22px] rounded-bl-md sm:max-w-[min(78vw,780px)]",
            meta.bubbleClass,
          ].join(" ")}
        >
          <MessageContent content={message.content} />
        </div>
      </div>

      {isUser ? (
        <MessageAvatar icon={meta.icon} className={meta.iconClass} />
      ) : null}
    </div>
  );
}

function MessageAvatar({
  icon,
  className,
}: {
  icon: ReactNode;
  className: string;
}) {
  return (
    <div
      className={[
        "mt-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 shadow-[0_12px_28px_rgba(15,23,42,0.14)] ring-4 ring-white",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-[0_12px_28px_rgba(0,0,0,0.34)]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:ring-[#07111F]",
        className,
      ].join(" ")}
    >
      {icon}
    </div>
  );
}

function MessageMeta({
  label,
  createdAt,
  isUser,
}: {
  label: string;
  createdAt: string;
  isUser: boolean;
}) {
  return (
    <div
      className={[
        "mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-bold",
        "text-[#64748B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]",
        isUser ? "justify-end self-end" : "justify-start self-start",
      ].join(" ")}
    >
      <span>{isUser ? "Khách hàng" : label}</span>

      <span className="text-[#CBD5E1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#475569]">
        •
      </span>

      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {formatMessageTime(createdAt)}
      </span>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={`empty-${index}`} className="h-1" />;
        }

        return (
          <p key={`${trimmed}-${index}`} className="min-w-0">
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-black">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function getSenderMeta(senderType: SenderType) {
  switch (senderType) {
    case "AI":
      return {
        label: "AI hỗ trợ",
        icon: <Bot className="h-[22px] w-[22px]" strokeWidth={2.7} />,
        iconClass:
          "border-[#22D3EE]/55 bg-[#CFFAFE] text-[#0369A1] ring-[#ECFEFF] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22D3EE]/55 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#083344] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#67E8F9]",
        bubbleClass:
          "border border-[#E4E7EC] bg-white text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#243247] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F8FAFC]",
      };

    case "TECHNICIAN":
      return {
        label: "Thợ kỹ thuật",
        icon: <Wrench className="h-[22px] w-[22px]" strokeWidth={2.7} />,
        iconClass:
          "border-[#F59E0B]/55 bg-[#FFEDD5] text-[#C2410C] ring-[#FFF7ED] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#451A03] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
        bubbleClass:
          "border border-[#FED7AA] bg-[#FFF7ED] text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/35 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#1B2433] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F8FAFC]",
      };

    case "USER":
      return {
        label: "Khách hàng",
        icon: <User className="h-[22px] w-[22px]" strokeWidth={2.7} />,
        iconClass:
          "border-[#06B6D4]/55 bg-[#CFFAFE] text-[#0891B2] ring-[#ECFEFF] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#083344] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
        bubbleClass:
          "border border-[#0891B2] bg-[#0891B2] text-white shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#0284C7] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0284C7] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white",
      };

    default:
      return {
        label: String(senderType),
        icon: <User className="h-[22px] w-[22px]" strokeWidth={2.7} />,
        iconClass:
          "border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B] ring-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#334155] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]",
        bubbleClass:
          "border border-[#E4E7EC] bg-white text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#243247] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F8FAFC]",
      };
  }
}

function formatMessageTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}