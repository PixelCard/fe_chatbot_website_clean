import type { ReactNode } from "react";

export type CommonStatusTone =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type CommonStatusSize = "sm" | "md" | "lg";

type Props = {
  label: string;
  tone?: CommonStatusTone;
  toneClassName?: string;
  size?: CommonStatusSize;
  className?: string;
  widthClassName?: string;
  heightClassName?: string;
  roundedClassName?: string;
  icon?: ReactNode;
  dot?: boolean;
};

const toneClass: Record<CommonStatusTone, string> = {
  info: "border-cyan-400/80 bg-cyan-100 text-cyan-800 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
  success:
    "border-[#22C55E]/55 bg-[#DCFCE7] text-[#166534] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22C55E]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
  warning:
    "border-amber-400/80 bg-amber-100 text-amber-800 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
  danger:
    "border-rose-400/80 bg-rose-100 text-rose-800 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#EF4444]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#EF4444]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]",
  neutral:
    "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] text-[var(--admin-strong-text)]",
};

const sizeClass: Record<CommonStatusSize, string> = {
  sm: "px-2.5 py-1 text-xs font-bold",
  md: "px-3 py-1.5 text-sm font-semibold",
  lg: "px-3.5 py-2 text-sm font-bold",
};

export function StatusBadge({
  label,
  tone = "neutral",
  toneClassName,
  size = "md",
  className = "",
  widthClassName = "",
  heightClassName = "",
  roundedClassName = "rounded-full",
  icon,
  dot = false,
}: Props) {
  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-1.5 border",
        roundedClassName,
        sizeClass[size],
        heightClassName,
        widthClassName,
        toneClassName || toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? icon : dot ? <span className="h-2 w-2 rounded-full bg-current" /> : null}
      <span className="truncate">{label}</span>
    </span>
  );
}
