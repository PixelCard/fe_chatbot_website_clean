"use client";

import type { ReactNode } from "react";
import { Eye, Sparkles } from "lucide-react";

import { AdminDetailAction } from "../../_shared/components/AdminDetailAction";
import type {
  AiFeedback,
  AiReasoningLogItem,
  RiskLevel,
} from "../types/aiReasoning.types";
import { getEffectiveScore } from "../lib/aiReasoningHelpers";

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
        <div className="grid grid-cols-[1fr_1.25fr_1.05fr_1.35fr_1.15fr_0.9fr] items-center border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-5 py-4 text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-300">
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
                <p className="truncate text-[17px] font-black text-[var(--admin-strong-text)]">
                  {getSafeText(log.userName, "Không rõ")}
                </p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-[var(--admin-strong-text)]">
                  {getSafeText(log.userPhone, "--")}
                </p>
              </div>

              <ContextCell log={log} />

              <div className="flex justify-center">
                <QualityBadge
                  feedback={log.aiFeedback}
                  isGolden={log.isGolden}
                  score={getEffectiveScore(log)}
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
                score={getEffectiveScore(log)}
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
    <span className="inline-flex h-8.5 max-w-full items-center rounded-full bg-amber-400 px-4 text-xs font-black text-slate-950 shadow-sm">
      <span className="truncate">{children}</span>
    </span>
  );
}

function PriorityBadge({ log }: { log: AiReasoningLogItem }) {
  const priority = getPriority(log);

  return (
    <span
      className={[
        "inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-black text-white shadow-md whitespace-nowrap",
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
      <span className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-black text-white shadow-md shadow-emerald-600/20 whitespace-nowrap">
        <Sparkles className="h-4 w-4" />
        Mẫu tốt
      </span>
    );
  }

  if (!hasUserFeedback) {
    return (
      <span className="inline-flex h-8.5 items-center justify-center rounded-full bg-slate-600 px-4 text-sm font-black text-white shadow-md whitespace-nowrap">
        Chưa phản hồi
      </span>
    );
  }

  if (feedback === "LIKE") {
    return (
      <span className="inline-flex h-8.5 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-black text-white shadow-md shadow-emerald-600/20 whitespace-nowrap">
        {score}/10
      </span>
    );
  }

  return (
    <span className="inline-flex h-8.5 items-center justify-center rounded-full bg-rose-600 px-4 text-sm font-black text-white shadow-md shadow-rose-600/20 whitespace-nowrap">
      {score}/10
    </span>
  );
}

function getPriority(log: AiReasoningLogItem) {
  if (log.riskLevel === "CRITICAL" || log.riskLevel === "HIGH") {
    return {
      label: "Rủi ro cao",
      className: "bg-rose-600 shadow-rose-600/20",
    };
  }

  const effectiveScore = getEffectiveScore(log);

  if (effectiveScore <= 4 || log.aiFeedback === "DISLIKE") {
    return {
      label: "Nghi vấn sai",
      className: "bg-amber-500 text-slate-950 shadow-amber-500/20",
    };
  }

  if (log.isGolden || effectiveScore >= 8) {
    return {
      label: "Ổn định",
      className: "bg-emerald-600 shadow-emerald-600/20",
    };
  }

  return {
    label: getRiskText(log.riskLevel),
    className: "bg-sky-600 shadow-sky-600/20",
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
