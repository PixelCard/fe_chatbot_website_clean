import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-orange-100/80 bg-white/82 shadow-[0_26px_70px_rgba(255,122,0,0.10)] backdrop-blur-[22px]",
        "dark:border-slate-700/80 dark:bg-slate-900/78 dark:shadow-[0_30px_90px_rgba(0,0,0,0.34)]",
        className,
      )}
    >
      {children}
    </div>
  );
}