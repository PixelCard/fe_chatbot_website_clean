import Link from "next/link";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import type { ReactNode } from "react";

export function ReviewHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="admin-card rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
              <MessageSquareText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black text-[var(--admin-strong-text)] sm:text-xl">
                {title}
              </h1>
              <p className="mt-1 text-sm font-medium text-[var(--admin-muted-text)]">
                {description}
              </p>
            </div>
          </div>
        </div>

        {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
      </div>
    </section>
  );
}

export function ReviewBackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]"
    >
      <ArrowLeft className="h-4 w-4" />
      Quay lại
    </Link>
  );
}
