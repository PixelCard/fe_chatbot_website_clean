"use client";

import Link from "next/link";
import { createElement, isValidElement } from "react";
import type { ComponentType, ReactNode } from "react";

export type CommonActionTone =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "purple"
  | "neutral";

export type CommonActionSize = "sm" | "md" | "lg";

type BaseProps = {
  icon?: ComponentType<{ className?: string }> | ReactNode;
  label: string;
  description?: string;
  tone?: CommonActionTone;
  size?: CommonActionSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  trailing?: ReactNode;
  className?: string;
  contentClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  widthClassName?: string;
  heightClassName?: string;
  target?: "_blank" | "_self";
};

type LinkProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

type Props = LinkProps | ButtonProps;

const toneClass: Record<CommonActionTone, string> = {
  info: "border-cyan-400/80 bg-cyan-100 text-cyan-800 hover:border-cyan-500/80 hover:bg-cyan-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/45",
  success:
    "border-amber-400/80 bg-amber-100 text-amber-800 hover:border-amber-500/80 hover:bg-amber-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#F59E0B]/45",
  warning:
    "border-amber-400/80 bg-amber-100 text-amber-800 hover:border-amber-500/80 hover:bg-amber-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#F59E0B]/45",
  danger:
    "border-rose-400/80 bg-rose-100 text-rose-800 hover:border-rose-500/80 hover:bg-rose-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#EF4444]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#EF4444]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#EF4444]/45",
  purple:
    "border-fuchsia-400/70 bg-fuchsia-100 text-fuchsia-800 hover:border-fuchsia-500/75 hover:bg-fuchsia-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#A855F7]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#A855F7]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#C084FC] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#A855F7]/50",
  neutral:
    "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[var(--admin-control-bg)]",
};

const sizeClass: Record<CommonActionSize, string> = {
  sm: "h-9 rounded-xl px-3 text-sm font-bold",
  md: "h-10 rounded-xl px-3.5 text-sm font-bold",
  lg: "h-11 rounded-xl px-4 text-base font-semibold",
};

export function ActionButton(props: Props) {
  const {
    icon,
    label,
    tone = "neutral",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    loadingLabel = "Đang xử lý...",
    trailing,
    className = "",
    contentClassName = "",
    labelClassName = "",
    descriptionClassName = "",
    widthClassName = "",
    heightClassName = "",
    target = "_self",
  } = props;
  const hasRichContent = Boolean(props.description || trailing);

  const classes = [
    "inline-flex min-w-0 items-center border transition focus-visible:outline-none focus-visible:ring-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    hasRichContent ? "justify-between gap-3" : "justify-center gap-2",
    fullWidth ? "w-full" : "",
    sizeClass[size],
    heightClassName,
    widthClassName,
    toneClass[tone],
    getFocusRing(tone),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Hỗ trợ cả nút ngắn và nút thao tác dạng thẻ mà không cần tạo component riêng.
  const content = hasRichContent ? (
    <>
      <div
        className={[
          "flex min-w-0 items-center gap-3",
          trailing ? "flex-1" : "",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {loading ? (
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          renderIcon(icon)
        )}

        <div className="min-w-0">
          <span
            className={[
              "block truncate",
              labelClassName || "text-sm font-bold",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {loading ? loadingLabel : label}
          </span>

          {props.description ? (
            <span
              className={[
                "mt-1 block line-clamp-2 text-sm leading-5",
                descriptionClassName || "font-medium opacity-80",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {props.description}
            </span>
          ) : null}
        </div>
      </div>

      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </>
  ) : (
    <>
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        renderIcon(icon)
      )}
      <span className={["truncate", labelClassName].filter(Boolean).join(" ")}>
        {loading ? loadingLabel : label}
      </span>
    </>
  );

  if ("href" in props && props.href) {
    if (disabled) {
      return (
        <span aria-disabled="true" className={classes}>
          {content}
        </span>
      );
    }

    return (
      <Link
        href={props.href}
        target={target}
        rel={target === "_blank" ? "noreferrer noopener" : undefined}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={disabled || loading}
      onClick={props.onClick}
      className={classes}
    >
      {content}
    </button>
  );
}

function renderIcon(
  icon?: ComponentType<{ className?: string }> | ReactNode,
) {
  if (!icon) return null;
  if (isValidElement(icon)) {
    return icon;
  }
  return createElement(icon as ComponentType<{ className?: string }>, {
    className: "h-4 w-4 shrink-0",
  });
}

function getFocusRing(tone: CommonActionTone) {
  if (tone === "danger") return "focus-visible:ring-[#EF4444]/40";
  if (tone === "warning" || tone === "success") {
    return "focus-visible:ring-[#F59E0B]/40";
  }
  if (tone === "purple") return "focus-visible:ring-[#A855F7]/40";
  if (tone === "info") return "focus-visible:ring-[#06B6D4]/40";
  return "focus-visible:ring-[var(--admin-focus-ring)]";
}
