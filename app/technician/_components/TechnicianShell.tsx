"use client";

import Link from "next/link";
import { RadioTower, UserCircle } from "lucide-react";
import type { ReactNode } from "react";

export default function TechnicianShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(6,182,212,0.16),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(34,197,94,0.08),transparent_32%)]"
      />

      <div className="relative min-h-screen">
        <header className="sticky top-0 z-20 border-b border-[#1E2A3F] bg-[#07111F]/90 backdrop-blur">
          <div className="flex w-full max-w-none items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-6 xl:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22D3EE]">
                Technician Workspace
              </p>
              <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-white">
                Nhận và xử lý đơn kỹ thuật
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/technician"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#1E2A3F] bg-[#101B2E] px-4 text-sm font-medium text-[#D1D5DB] transition-colors duration-150 hover:border-[#2A3A55] hover:bg-[#122039]"
              >
                <RadioTower className="h-4 w-4" />
                Bảng đơn
              </Link>
              <Link
                href="/technician/profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E2A3F] bg-[#101B2E] text-[#D1D5DB] transition-colors duration-150 hover:border-[#2A3A55] hover:bg-[#122039]"
                aria-label="Hồ sơ kỹ thuật viên"
              >
                <UserCircle className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        <section className="min-w-0 px-4 py-4 sm:px-5 lg:px-6 xl:px-8">
          <div className="w-full max-w-none space-y-5">{children}</div>
        </section>
      </div>
    </main>
  );
}
