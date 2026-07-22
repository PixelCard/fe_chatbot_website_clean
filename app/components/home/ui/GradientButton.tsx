import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "./GlassCard";

type GradientButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function GradientButton({
  href,
  children,
  variant = "primary",
  className,
}: GradientButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[18px] px-6 text-sm font-black transition duration-300",
        "focus:outline-none focus-visible:ring-4",
        isPrimary
          ? "bg-orange-500 text-white shadow-[0_18px_38px_rgba(255,122,0,0.24)] hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:ring-orange-500/25 dark:bg-blue-700 dark:shadow-[0_18px_38px_rgba(37,99,235,0.24)] dark:hover:bg-blue-800 dark:focus-visible:ring-blue-500/30"
          : "border border-orange-200 bg-white/80 text-slate-900 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 focus-visible:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:focus-visible:ring-blue-500/25",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}