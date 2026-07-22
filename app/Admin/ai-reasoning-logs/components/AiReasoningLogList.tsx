"use client";

import type { ReactNode } from "react";
import { Eye, Sparkles } from "lucide-react";

import { AdminDetailAction } from "../../_shared/components/AdminDetailAction";
import type {
  AiFeedback,
  AiReasoningLogItem,
  RiskLevel,
} from "../types/aiReasoning.types";

type Props = {
  logs: AiReasoningLogItem[];
  total: number;
  isLoading: boolean;
};

export function AiReasoningLogList({ logs, total, isLoading }: Props) {
  if (isLoading) {
    return (
      <section className="admin-card rounded-2xl p-5">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!logs.length) {
    return (
      <section className="admin-card flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-dashed p-8 text-center">
        <h3 className="text-lg font-black text-[var(--admin-strong-text)]">
          Không có log AI
        </h3>

        <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--admin-muted-text)]">
          Hiện tại chưa có dữ liệu log suy luận AI để hiển thị.
        </p>
      </section>
    );
  }

  return (
    <section className="admin-card overflow-hidden rounded-2xl">
      <header className="flex flex-col gap-3 border-b border-[var(--admin-card-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-black tracking-tight text-[var(--admin-strong-text)]">
            Lịch sử hỏi đáp AI
          </h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-[var(--admin-muted-text)]">
            Bảng chỉ hiển thị thông tin cơ bản. Bấm chi tiết để xem đầy đủ log.
          </p>
        </div>
        <span className="inline-flex h-9 w-fit shrink-0 items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 text-sm font-black text-[var(--admin-strong-text)]">
          {total} log
        </span>
      </header>

      <div className="hidden xl:block">
        <div className="grid grid-cols-[1fr_1.25fr_1.05fr_1.35fr_1.15fr_0.9fr] items-center border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
          <div className="text-center">Ưu tiên</div>
          <div>Người dùng</div>
          <div>SĐT</div>
          <div>Ngữ cảnh</div>
          <div className="text-center">Chất lượng</div>
          <div className="text-center">Thao tác</div>
        </div>

        <div className="max-h-[calc(100vh-390px)] min-h-[500px] divide-y divide-[var(--admin-card-border)] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="grid grid-cols-[1fr_1.25fr_1.05fr_1.35fr_1.15fr_0.9fr] items-center px-5 py-4 transition hover:bg-[var(--admin-control-hover-bg)]"
            >
              <div className="flex justify-center">
                <PriorityBadge log={log} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[15px] font-black text-[var(--admin-strong-text)]">
                  {getSafeText(log.userName, "Không rõ")}
                </p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--admin-muted-text)]">
                  {getSafeText(log.userPhone, "--")}
                </p>
              </div>

              <ContextCell log={log} />

              <div className="flex justify-center">
                <QualityBadge
                  feedback={log.aiFeedback}
                  isGolden={log.isGolden}
                  score={log.score}
                />
              </div>

              <div className="flex justify-center">
                <AdminDetailAction
                  href={`/admin/ai-reasoning-logs/${log.id}`}
                  size="md"
                  className="min-w-[112px]"
                  icon={<Eye className="h-4 w-4" strokeWidth={2.5} />}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[var(--admin-card-border)] xl:hidden">
        {logs.map((log) => (
          <article
            key={log.id}
            className="p-4 transition hover:bg-[var(--admin-control-hover-bg)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <PriorityBadge log={log} />

                <h3 className="mt-3 truncate text-base font-black text-[var(--admin-strong-text)]">
                  {getSafeText(log.userName, "Không rõ")}
                </h3>

                <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
                  SĐT: {getSafeText(log.userPhone, "--")}
                </p>
              </div>

              <QualityBadge
                feedback={log.aiFeedback}
                isGolden={log.isGolden}
                score={log.score}
              />
            </div>

            <div className="mt-3">
              <ContextCell log={log} />
            </div>

            <div className="mt-4 flex justify-end">
              <AdminDetailAction
                href={`/admin/ai-reasoning-logs/${log.id}`}
                size="md"
                className="min-w-[112px]"
                icon={<Eye className="h-4 w-4" strokeWidth={2.5} />}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContextCell({ log }: { log: AiReasoningLogItem }) {
  const context = getPrimaryContext(log);

  if (!context) {
    return (
      <div className="min-w-0">
        <span className="text-sm font-semibold text-[var(--admin-muted-text)]">
          Chưa có ngữ cảnh
        </span>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <SmallTag>{context}</SmallTag>
    </div>
  );
}

function getPrimaryContext(log: AiReasoningLogItem) {
  const deviceCategory = log.deviceCategory?.trim();
  const sessionCode = log.sessionCode?.trim();

  return deviceCategory || sessionCode || "";
}

function SmallTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-8 max-w-full items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 text-xs font-bold text-[var(--admin-muted-text)]">
      <span className="truncate">{children}</span>
    </span>
  );
}

function PriorityBadge({ log }: { log: AiReasoningLogItem }) {
  const priority = getPriority(log);

  return (
    <span
      className={[
        "inline-flex h-8 w-fit items-center justify-center rounded-full border px-3 text-xs font-black",
        priority.className,
      ].join(" ")}
    >
      {priority.label}
    </span>
  );
}

function QualityBadge({
  feedback,
  isGolden,
  score,
}: {
  feedback: AiFeedback;
  isGolden: boolean;
  score: number;
}) {
  const hasUserFeedback = feedback === "LIKE" || feedback === "DISLIKE";

  if (isGolden) {
    return (
      <span className="inline-flex h-8 w-fit items-center justify-center gap-1 rounded-full border border-[#22C55E]/35 bg-[#22C55E]/10 px-3 text-xs font-black text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
        <Sparkles className="h-3.5 w-3.5" />
        Mẫu tốt
      </span>
    );
  }

  if (!hasUserFeedback) {
    return (
      <span className="inline-flex h-8 w-fit items-center justify-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 text-xs font-black text-[var(--admin-muted-text)]">
        Chưa phản hồi
      </span>
    );
  }

  if (feedback === "LIKE") {
    return (
      <span className="inline-flex h-8 w-fit items-center justify-center rounded-full border border-[#22C55E]/35 bg-[#22C55E]/10 px-3 text-xs font-black text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
        {score}/10
      </span>
    );
  }

  return (
    <span className="inline-flex h-8 w-fit items-center justify-center rounded-full border border-[#EF4444]/35 bg-[#EF4444]/10 px-3 text-xs font-black text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
      {score}/10
    </span>
  );
}

function getPriority(log: AiReasoningLogItem) {
  if (log.riskLevel === "CRITICAL" || log.riskLevel === "HIGH") {
    return {
      label: "Rủi ro cao",
      className:
        "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
    };
  }

  if (log.score <= 4 || log.aiFeedback === "DISLIKE") {
    return {
      label: "Nghi vấn sai",
      className:
        "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
    };
  }

  if (log.isGolden || log.score >= 8) {
    return {
      label: "Ổn định",
      className:
        "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    };
  }

  return {
    label: getRiskText(log.riskLevel),
    className:
      "border-[#06B6D4]/35 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
  };
}

function getRiskText(riskLevel: RiskLevel) {
  if (riskLevel === "MEDIUM") return "Theo dõi";
  if (riskLevel === "LOW") return "Thấp";
  return "Chưa rõ";
}

function getSafeText(value?: string | null, fallback = "--") {
  if (!value) return fallback;

  const normalized = value.trim();
  return normalized ? normalized : fallback;
}
