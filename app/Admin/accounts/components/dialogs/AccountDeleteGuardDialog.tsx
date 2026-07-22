"use client";

import { Trash2 } from "lucide-react";
import type { AccountItem } from "../../types/account.types";

type Props = {
  open: boolean;
  account: AccountItem | null;
  onClose: () => void;
};

export default function AccountDeleteGuardDialog({
  open,
  account,
  onClose,
}: Props) {
  if (!open || !account) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-guard-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#1E2A3F] bg-[#101B2E] shadow-[0_24px_80px_-45px_rgba(0,0,0,0.9)]">
        <header className="border-b border-[#1E2A3F] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/10 text-[#F87171]">
              <Trash2 className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h2
                id="delete-guard-title"
                className="text-lg font-semibold text-white"
              >
                Không nên xóa cứng tài khoản
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">
                Với môi trường production, tài khoản đã phát sinh dữ liệu như
                thiết bị, ca sửa, đánh giá hoặc báo giá không nên bị xóa cứng.
                Nên dùng chức năng khóa tài khoản bằng <code>isActive</code>.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-4 p-4 sm:p-5">
          <section className="rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
              Tài khoản
            </p>

            <p className="mt-3 truncate text-base font-semibold text-white">
              {account.fullName}
            </p>

            <p className="font-mono text-sm font-semibold text-[#94A3B8]">
              #{account.id}
            </p>
          </section>

          <section className="rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/10 p-4">
            <p className="text-base font-semibold text-[#F87171]">
              Khuyến nghị
            </p>

            <p className="mt-2 text-sm leading-6 text-[#D1D5DB]">
              Thay vì xóa, hãy khóa tài khoản để giữ lịch sử dữ liệu, audit log
              và tính toàn vẹn quan hệ dữ liệu.
            </p>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-[#1E2A3F] p-4 sm:flex-row sm:justify-end sm:p-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#1E2A3F] bg-[#0D1728] px-4 text-base font-semibold text-[#D1D5DB] transition hover:border-[#64748B]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748B]/40"
          >
            Đã hiểu
          </button>
        </footer>
      </div>
    </div>
  );
}
