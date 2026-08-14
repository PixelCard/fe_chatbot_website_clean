import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type AdminStatusPillTone =
  | "neutral"
  | "success"
  | "danger"
  | "failed"
  | "cancel"
  | "warning"
  | "info"
  | "sky"
  | "purple";

export type AdminStatusPillProps = {
  children: ReactNode;
  tone?: AdminStatusPillTone;
  variant?: "solid" | "soft";
  icon?: LucideIcon;
  className?: string;
};

type PresetStatusPillProps = Omit<AdminStatusPillProps, "tone">;

const TONE_CLASS: Record<AdminStatusPillTone, string> = {
  neutral:
    "border-slate-600 bg-slate-600 text-white shadow-slate-200/80",
  success:
    "border-emerald-600 bg-emerald-600 text-white shadow-emerald-200/80",
  danger:
    "border-rose-600 bg-rose-600 text-white shadow-rose-200/80",
  failed:
    "border-red-600 bg-red-600 text-white shadow-red-200/80",
  cancel:
    "border-rose-600 bg-rose-600 text-white shadow-rose-200/80",
  warning:
    "border-amber-600 bg-amber-600 text-white shadow-amber-200/80",
  info:
    "border-cyan-600 bg-cyan-600 text-white shadow-cyan-200/80",
  sky:
    "border-sky-600 bg-sky-600 text-white shadow-sky-200/80",
  purple:
    "border-violet-600 bg-violet-600 text-white shadow-violet-200/80",
};

const SOFT_TONE_CLASS: Record<AdminStatusPillTone, string> = {
  neutral:
    "border-slate-300 bg-slate-100 text-slate-800 shadow-slate-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-slate-500/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-slate-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-slate-200",
  success:
    "border-emerald-400 bg-emerald-100 text-emerald-800 shadow-emerald-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-200",
  danger:
    "border-rose-400 bg-rose-100 text-rose-800 shadow-rose-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200",
  failed:
    "border-red-400 bg-red-100 text-red-800 shadow-red-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-red-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-red-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-red-200",
  cancel:
    "border-rose-400 bg-rose-100 text-rose-800 shadow-rose-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200",
  warning:
    "border-amber-400 bg-amber-100 text-amber-800 shadow-amber-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-200",
  info:
    "border-cyan-400 bg-cyan-100 text-cyan-800 shadow-cyan-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-cyan-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-cyan-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200",
  sky:
    "border-sky-400 bg-sky-100 text-sky-800 shadow-sky-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-sky-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-sky-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-sky-200",
  purple:
    "border-violet-400 bg-violet-100 text-violet-800 shadow-violet-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-violet-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-violet-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-violet-200",
};

export function AdminStatusPill({
  children,
  tone = "neutral",
  variant = "solid",
  icon: Icon,
  className = "",
}: AdminStatusPillProps) {
  return (
    <span
      className={[
        "inline-flex min-h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
        variant === "soft" ? SOFT_TONE_CLASS[tone] : TONE_CLASS[tone],
        className,
      ].join(" ")}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function AdminSuccessPill(props: PresetStatusPillProps) {
  return <AdminStatusPill tone="success" {...props} />;
}

export function AdminFailedPill(props: PresetStatusPillProps) {
  return <AdminStatusPill tone="failed" {...props} />;
}

export function AdminCancelPill(props: PresetStatusPillProps) {
  return <AdminStatusPill tone="cancel" {...props} />;
}

export function AdminWarningPill(props: PresetStatusPillProps) {
  return <AdminStatusPill tone="warning" {...props} />;
}

export function AdminInfoPill(props: PresetStatusPillProps) {
  return <AdminStatusPill tone="info" {...props} />;
}
