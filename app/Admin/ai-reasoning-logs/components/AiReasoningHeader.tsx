"use client";

import { BotMessageSquare, Sparkles } from "lucide-react";

export function AiReasoningHeader() {
  return (
    <section className="admin-card rounded-2xl px-5 py-5 sm:px-6 lg:px-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--admin-muted-text)]">
            <Sparkles className="h-4 w-4 text-[var(--admin-accent)]" />
            <span>AI & tri thức</span>
            <span>/</span>
            <span className="text-[var(--admin-strong-text)]">
              Log suy luận AI
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
            Quản lý AI tư vấn
          </h1>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
            Theo dõi lịch sử hỏi đáp AI, mức rủi ro, phản hồi thích hoặc không
            thích, mẫu tốt đã xác nhận và các dấu hiệu cần kiểm tra lại.
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
          <BotMessageSquare className="h-6 w-6" />
        </div>
      </div>
    </section>
  );
}
