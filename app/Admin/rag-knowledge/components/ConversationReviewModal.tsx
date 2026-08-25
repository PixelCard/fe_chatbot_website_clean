"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MessageSquareText,
  Search,
  Star,
  UploadCloud,
  X,
} from "lucide-react";

import type {
  ImportRagConversationPayload,
  RagConversationCandidate,
  RagConversationCandidateType,
} from "../types/ragKnowledge.types";

type ConversationReviewModalProps = {
  open: boolean;
  isMutating: boolean;
  onClose: () => void;
  onLoad: (query?: {
    type?: RagConversationCandidateType;
    search?: string;
  }) => Promise<RagConversationCandidate[]>;
  onImport: (payload: ImportRagConversationPayload) => Promise<unknown>;
};

const filterOptions: Array<{
  value: RagConversationCandidateType;
  label: string;
  description: string;
}> = [
  {
    value: "ALL",
    label: "Tất cả",
    description: "Mọi cuộc trò chuyện đủ điều kiện",
  },
  {
    value: "IMPORTED",
    label: "Đã import",
    description: "Đã đưa vào kho tri thức RAG",
  },
  {
    value: "CUSTOMER_5_STAR",
    label: "5 sao",
    description: "Khách hàng đánh giá rất tốt",
  },
  {
    value: "CUSTOMER_4_STAR",
    label: "4 sao",
    description: "Khách hàng đánh giá tốt",
  },
  {
    value: "AI_8_10",
    label: "AI 8-10 điểm",
    description: "AI conclusion chất lượng cao",
  },
  {
    value: "AI_6_7",
    label: "AI 6-7 điểm",
    description: "Cần admin rà soát kỹ",
  },
];

export default function ConversationReviewModal({
  open,
  isMutating,
  onClose,
  onLoad,
  onImport,
}: ConversationReviewModalProps) {
  const [type, setType] = useState<RagConversationCandidateType>("ALL");
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<RagConversationCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [importingSessionId, setImportingSessionId] = useState<number | null>(
    null,
  );

  const [importedCount, setImportedCount] = useState<number>(0);

  useEffect(() => {
    if (!open) return;
    let active = true;

    onLoad({ type: "IMPORTED" })
      .then((items) => {
        if (active) {
          setImportedCount(items.length);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [open, onLoad, successMessage]);

  const candidateSummary = useMemo(
    () => ({
      total: type === "IMPORTED" ? importedCount : candidates.length,
      imported: importedCount,
      aiConclusion: candidates.filter((item) => item.aiConclusion).length,
    }),
    [candidates, importedCount, type],
  );

  useEffect(() => {
    if (!open) return;

    let active = true;

    const loadCandidates = async () => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const items = await onLoad({
          type,
          search: search.trim() || undefined,
        });

        if (active) {
          setCandidates(items);
        }
      } catch (nextError) {
        if (active) {
          setError(
            (nextError as { message?: string }).message ||
              "Không thể tải danh sách cuộc trò chuyện.",
          );
          setCandidates([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadCandidates();

    return () => {
      active = false;
    };
  }, [onLoad, open, search, type]);

  if (!open) return null;

  const reload = async () => {
    const items = await onLoad({ type, search: search.trim() || undefined });
    setCandidates(items);
  };

  const handleImport = async (candidate: RagConversationCandidate) => {
    setImportingSessionId(candidate.sessionId);
    setError(null);
    setSuccessMessage(null);

    try {
      await onImport({
        sessionId: candidate.sessionId,
        sourceType: candidate.sourceType,
      });
      await reload();
      setSuccessMessage(
        `Đã import ${candidate.sessionCode} vào kho RAG thành công.`,
      );
    } catch (nextError) {
      setError(
        (nextError as { message?: string }).message ||
          "Không thể import cuộc trò chuyện này.",
      );
    } finally {
      setImportingSessionId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/90 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-review-title"
        className="flex max-h-[calc(100dvh-32px)] w-[min(1380px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-[var(--admin-card-border)] bg-slate-900 [.admin-ripple-theme-shell[data-admin-theme=light]_&]:bg-white opacity-100 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)]"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--admin-card-border)] px-6 py-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--admin-accent)]">
              Duyệt dữ liệu chat cho RAG
            </p>
            <h2
              id="conversation-review-title"
              className="mt-1 text-2xl font-bold tracking-tight text-[var(--admin-strong-text)]"
            >
              Duyệt cuộc trò chuyện
            </h2>
            <p className="mt-1.5 max-w-3xl text-sm font-medium leading-relaxed text-[var(--admin-muted-text)]">
              Chọn các cuộc trò chuyện có đánh giá tốt hoặc AI conclusion đủ
              điểm để import vào kho tri thức dưới dạng tài liệu chat.
            </p>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              label="Tổng ứng viên"
              value={candidateSummary.total}
              tone="cyan"
              icon={MessageSquareText}
            />
            <SummaryCard
              label="AI conclusion"
              value={candidateSummary.aiConclusion}
              tone="violet"
              icon={Bot}
            />
            <SummaryCard
              label="Đã import"
              value={candidateSummary.imported}
              tone="emerald"
              icon={CheckCircle2}
            />
          </div>

          <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-stretch xl:justify-between">
            <div className="flex flex-1 min-w-0 flex-wrap gap-3">
              {filterOptions.map((option) => {
                const active = type === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={[
                      "flex flex-col justify-center rounded-2xl border px-4 py-3 text-left transition-all duration-150 active:scale-[0.98]",
                      active
                        ? "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)] text-[var(--admin-strong-text)] shadow-sm ring-1 ring-[var(--admin-accent)]"
                        : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]",
                    ].join(" ")}
                  >
                    <span className="block text-base font-bold leading-tight">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-sm font-medium opacity-85">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="relative block shrink-0 xl:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--admin-muted-text)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm mã phiên, khách, thiết bị..."
                className="h-12 w-full rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] pl-11 pr-4 text-base font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-sm placeholder:font-normal placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
              />
            </label>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm font-bold text-rose-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          ) : null}

          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)]">
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1080px] table-fixed">
                <colgroup>
                  <col className="w-[26%]" />
                  <col className="w-[16%]" />
                  <col className="w-[18%]" />
                  <col className="w-[24%]" />
                  <col className="w-[16%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-left text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-300">
                    <th className="px-5 py-4 align-middle">Cuộc trò chuyện</th>
                    <th className="px-5 py-4 align-middle text-center">Nguồn đánh giá</th>
                    <th className="px-5 py-4 align-middle text-center">Kết luận</th>
                    <th className="px-5 py-4 align-middle">Nội dung xem trước</th>
                    <th className="px-5 py-4 align-middle text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--admin-card-border)]">
                  {isLoading ? (
                    <LoadingRows />
                  ) : candidates.length > 0 ? (
                    candidates.map((candidate) => (
                      <CandidateRow
                        key={`${candidate.type}-${candidate.sessionId}`}
                        candidate={candidate}
                        importing={
                          importingSessionId === candidate.sessionId ||
                          isMutating
                        }
                        onImport={() => void handleImport(candidate)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm font-bold text-[var(--admin-muted-text)]"
                      >
                        Chưa có cuộc trò chuyện phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-3 lg:hidden">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]"
                  />
                ))
              ) : candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <CandidateMobileCard
                    key={`${candidate.type}-${candidate.sessionId}`}
                    candidate={candidate}
                    importing={
                      importingSessionId === candidate.sessionId || isMutating
                    }
                    onImport={() => void handleImport(candidate)}
                  />
                ))
              ) : (
                <p className="py-8 text-center text-sm font-bold text-[var(--admin-muted-text)]">
                  Chưa có cuộc trò chuyện phù hợp với bộ lọc hiện tại.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: "cyan" | "violet" | "emerald";
  icon: React.ElementType;
}) {
  const toneClasses = {
    cyan: {
      accent: "bg-cyan-500",
      iconBox: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
    violet: {
      accent: "bg-violet-500",
      iconBox: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    emerald: {
      accent: "bg-emerald-500",
      iconBox: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  };

  const currentTone = toneClasses[tone];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] p-5 transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] shadow-sm">
      <span
        aria-hidden="true"
        className={["absolute inset-x-0 top-0 h-1", currentTone.accent].join(" ")}
      />
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-[0.1em] text-[var(--admin-muted-text)]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black text-[var(--admin-strong-text)] sm:text-4xl">
            {value.toLocaleString("vi-VN")}
          </p>
        </div>
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
            currentTone.iconBox,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" strokeWidth={2.3} />
        </div>
      </div>
    </div>
  );
}

function CandidateRow({
  candidate,
  importing,
  onImport,
}: {
  candidate: RagConversationCandidate;
  importing: boolean;
  onImport: () => void;
}) {
  return (
    <tr className="text-sm transition duration-150 hover:bg-[var(--admin-control-hover-bg)]">
      <td className="px-5 py-4 align-middle">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
            <MessageSquareText className="h-5.5 w-5.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[18px] font-black text-[var(--admin-strong-text)]">
              {candidate.sessionCode}
            </p>
            <p className="mt-0.5 truncate text-[15px] font-bold text-[var(--admin-strong-text)]">
              {candidate.customerName} {candidate.customerPhone ? `· ${candidate.customerPhone}` : ""}
            </p>
            <p className="mt-0.5 truncate text-[14px] font-black text-orange-500 dark:text-orange-400">
              {candidate.deviceType || "Thiết bị chưa phân loại"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 align-middle text-center">
        <ScoreBadge candidate={candidate} />
        <p className="mt-2 text-sm font-bold text-[var(--admin-strong-text)]">
          {candidate.messageCount.toLocaleString("vi-VN")} tin nhắn
        </p>
      </td>

      <td className="px-5 py-4 align-middle text-center">
        <ConclusionBadge candidate={candidate} />
      </td>

      <td className="px-5 py-4 align-middle">
        <p className="line-clamp-3 text-[16px] font-extrabold leading-relaxed text-[var(--admin-strong-text)]">
          {candidate.preview || candidate.symptom || "Chưa có nội dung xem trước."}
        </p>
      </td>

      <td className="px-5 py-4 text-right align-middle">
        <CandidateActions
          candidate={candidate}
          importing={importing}
          onImport={onImport}
        />
      </td>
    </tr>
  );
}

function CandidateMobileCard({
  candidate,
  importing,
  onImport,
}: {
  candidate: RagConversationCandidate;
  importing: boolean;
  onImport: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-[var(--admin-strong-text)]">
            {candidate.sessionCode}
          </p>
          <p className="mt-0.5 text-xs font-medium text-[var(--admin-muted-text)]">
            {candidate.customerName} · {candidate.deviceType || "Chưa rõ thiết bị"}
          </p>
        </div>
        <ScoreBadge candidate={candidate} />
      </div>

      <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-[var(--admin-strong-text)]">
        {candidate.preview || candidate.symptom || "Chưa có nội dung xem trước."}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConclusionBadge candidate={candidate} />
      </div>

      <div className="mt-4">
        <CandidateActions
          candidate={candidate}
          importing={importing}
          onImport={onImport}
        />
      </div>
    </article>
  );
}

function CandidateActions({
  candidate,
  importing,
  onImport,
}: {
  candidate: RagConversationCandidate;
  importing: boolean;
  onImport: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2.5">
      <Link
        href={`/admin/chats?sessionId=${candidate.sessionId}`}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3.5 text-sm font-bold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] whitespace-nowrap"
      >
        Mở chat
        <ExternalLink className="h-4 w-4" />
      </Link>

      {candidate.alreadyImported ? (
        <span className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 text-sm font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
          <CheckCircle2 className="h-4 w-4" />
          Đã import
        </span>
      ) : (
        <button
          type="button"
          onClick={onImport}
          disabled={importing}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55 whitespace-nowrap"
        >
          {importing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang import
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Import RAG
            </>
          )}
        </button>
      )}
    </div>
  );
}

function ScoreBadge({ candidate }: { candidate: RagConversationCandidate }) {
  if (candidate.sourceType === "CUSTOMER_REVIEW") {
    return (
      <span className="inline-flex h-8.5 items-center gap-1.5 rounded-full bg-amber-500 px-4 text-sm font-black text-slate-950 shadow-md whitespace-nowrap shrink-0">
        <Star className="h-4 w-4 fill-current" />
        {candidate.customerRating}/5 sao
      </span>
    );
  }

  return (
    <span className="inline-flex h-8.5 items-center gap-1.5 rounded-full bg-cyan-600 px-4 text-sm font-black text-white shadow-md whitespace-nowrap shrink-0">
      <Bot className="h-4 w-4" />
      AI {candidate.aiScore}/10
    </span>
  );
}

function ConclusionBadge({ candidate }: { candidate: RagConversationCandidate }) {
  return (
    <span
      className={[
        "inline-flex h-8.5 items-center gap-1.5 rounded-full px-4 text-sm font-black text-white shadow-md whitespace-nowrap shrink-0",
        candidate.aiConclusion ? "bg-cyan-600" : "bg-emerald-600",
      ].join(" ")}
    >
      {candidate.aiConclusion ? "AI conclusion" : "Khách hàng đánh giá"}
    </span>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <tr key={index}>
          <td colSpan={5} className="px-5 py-4">
            <div className="h-14 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
          </td>
        </tr>
      ))}
    </>
  );
}
