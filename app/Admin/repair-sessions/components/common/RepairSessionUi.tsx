import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function RepairSessionPanel({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]",
        className,
      ].join(" ")}
    >
      {title ? (
        <header className="flex items-center gap-2 border-b border-[var(--admin-soft-panel-border)] px-4 py-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
          {Icon ? (
            <Icon className="h-4 w-4 shrink-0 text-[#EA580C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]" />
          ) : null}
          <h3 className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
            {title}
          </h3>
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function RepairSessionEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-sm text-center">
      <p className="text-base font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
        {title}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
        {description}
      </p>
    </div>
  );
}

export function DetailRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: ReactNode;
  multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-[var(--admin-soft-panel-border)] py-3 first:pt-0 last:border-b-0 last:pb-0 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]/70 sm:grid-cols-[120px_minmax(0,1fr)]">
      <span className="text-sm font-medium text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
        {label}
      </span>
      <span
        className={[
          "min-w-0 text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white",
          multiline ? "break-words" : "truncate",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
