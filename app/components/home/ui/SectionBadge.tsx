import type { LucideIcon } from "lucide-react";

import { cn } from "./GlassCard";

type SectionBadgeProps = {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export function SectionBadge({
  children,
  icon: Icon,
  className,
}: SectionBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-600 shadow-sm",
        "dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
        className,
      )}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </div>
  );
}