// AccountHeader.tsx
import Link from "next/link";

export default function AccountHeader() {
  return (
    <section className="admin-card rounded-2xl px-5 py-3 sm:px-6 sm:py-3.5 lg:px-7">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--admin-muted-text)]">
            <span className="text-[var(--admin-accent)]">▰</span>
            <span>Người dùng</span>
            <span>/</span>
            <span className="text-[var(--admin-strong-text)]">Tài khoản</span>
          </div>

          <h1 className="mt-2 text-[1.9rem] font-semibold tracking-tight text-[var(--admin-strong-text)] sm:text-[2rem]">
            Tài khoản
          </h1>

          <p className="mt-1 max-w-2xl text-[13px] leading-5 text-[var(--admin-muted-text)] sm:text-sm">
            Quản lý tài khoản hệ thống, vai trò và trạng thái xác minh.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/admin/accounts/create"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[image:var(--admin-cta-bg)] px-3.5 text-[13px] font-semibold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition-colors duration-150 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] sm:px-4"
          >
            <span className="text-base leading-none">+</span>
            <span>Tạo tài khoản</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
