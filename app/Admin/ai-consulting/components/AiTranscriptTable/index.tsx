"use client";

import { Eye, MessageSquareText, Phone, Wrench } from "lucide-react";

import type { AiQualitySessionItem } from "../../types";

type AiQualityReviewTableProps = {
  items: AiQualitySessionItem[];
  selectedId: number | null;
  onSelect: (sessionId: number) => void;
};

export default function AiQualityReviewTable({
  items,
  selectedId,
  onSelect,
}: AiQualityReviewTableProps) {
  if (items.length === 0) {
    return (
      <section className="admin-card flex min-h-[320px] flex-col items-center justify-center rounded-2xl p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
          <MessageSquareText className="h-7 w-7" />
        </span>

        <h3 className="mt-4 text-xl font-black text-[var(--admin-strong-text)]">
          Chưa có phiên AI tư vấn
        </h3>

        <p className="mt-2 max-w-md text-sm font-medium leading-6 text-[var(--admin-muted-text)]">
          Hiện chưa có phiên nào cần đánh giá chất lượng AI.
        </p>
      </section>
    );
  }

  return (
    <section className="admin-card overflow-hidden rounded-2xl">
      <header className="flex flex-col gap-3 border-b border-[var(--admin-card-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-black tracking-tight text-[var(--admin-strong-text)]">
            Hàng đợi đánh giá AI
          </h2>
        </div>

        <span className="inline-flex h-9 w-fit shrink-0 items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 text-sm font-black text-[var(--admin-strong-text)]">
          {items.length} phiên
        </span>
      </header>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[1.15fr_0.95fr_minmax(0,1.65fr)_1fr_1.1fr_1.05fr] items-center border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
          <div>Khách hàng</div>
          <div>Thiết bị</div>
          <div>Vấn đề</div>
          <div>Đánh giá AI</div>
          <div>Gợi ý xử lý</div>
          <div className="text-right">Thao tác</div>
        </div>

        <div className="max-h-[calc(100vh-370px)] min-h-[430px] divide-y divide-[var(--admin-card-border)] overflow-y-auto">
          {items.map((item) => {
            const selected = selectedId === item.id;

            return (
              <div
                key={item.id}
                className={[
                  "grid grid-cols-[1.15fr_0.95fr_minmax(0,1.65fr)_1fr_1.1fr_1.05fr] items-center px-5 py-4 transition",
                  selected
                    ? "bg-[#06B6D4]/10"
                    : "hover:bg-[var(--admin-control-hover-bg)]",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="min-w-0 text-left"
                >
                  <p className="truncate text-[15px] font-black text-[var(--admin-strong-text)]">
                    {item.customerName}
                  </p>

                  <p className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-xs font-semibold text-[var(--admin-muted-text)]">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.customerPhone}</span>
                  </p>
                </button>

                <p className="inline-flex min-w-0 items-center gap-1.5 truncate text-[15px] font-bold text-[var(--admin-strong-text)]">
                  <Wrench className="h-4 w-4 shrink-0 text-[var(--admin-muted-text)]" />
                  <span className="truncate">{item.deviceType}</span>
                </p>

                <p className="truncate text-[15px] font-semibold text-[var(--admin-muted-text)]">
                  {item.symptom}
                </p>

                <QualityBadge status={item.qualityStatus} label={item.qualityLabel} />

                <p className="truncate text-sm font-bold text-[var(--admin-strong-text)]">
                  {item.actionHint}
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#06B6D4]/35 bg-[#06B6D4]/10 px-3 text-sm font-black text-[#0891B2] transition hover:bg-[#06B6D4]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                  >
                    <Eye className="h-4 w-4" strokeWidth={2.5} />
                    Phân tích
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="divide-y divide-[var(--admin-card-border)] lg:hidden">
        {items.map((item) => (
          <article
            key={item.id}
            className={[
              "p-4 transition hover:bg-[var(--admin-control-hover-bg)]",
              selectedId === item.id ? "bg-[#06B6D4]/10" : "",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className="min-w-0 text-left"
              >
                <h3 className="truncate text-base font-black text-[var(--admin-strong-text)]">
                  {item.customerName}
                </h3>

                <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
                  {item.deviceType} · {item.customerPhone}
                </p>
              </button>

              <QualityBadge status={item.qualityStatus} label={item.qualityLabel} />
            </div>

            <p className="mt-3 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
              {item.symptom}
            </p>

            <p className="mt-2 truncate text-sm font-bold text-[var(--admin-strong-text)]">
              {item.actionHint}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#06B6D4]/35 bg-[#06B6D4]/10 px-3 text-sm font-black text-[#0891B2] transition hover:bg-[#06B6D4]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
              >
                <Eye className="h-4 w-4" strokeWidth={2.5} />
                Phân tích
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function QualityBadge({
  status,
  label,
}: {
  status: AiQualitySessionItem["qualityStatus"];
  label: string;
}) {
  const className =
    status === "CRITICAL"
      ? "border-[#EA580C] bg-[#EA580C] text-white"
      : status === "OUT_OF_SCOPE"
        ? "border-[#7C3AED] bg-[#7C3AED] text-white"
        : status === "NEEDS_RAG"
          ? "border-[#D97706] bg-[#D97706] text-white"
          : "border-[#059669] bg-[#059669] text-white";

  return (
    <span
      className={[
        "inline-flex h-8 w-fit items-center rounded-full border px-3.5 text-xs font-bold text-white shadow-sm",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}



