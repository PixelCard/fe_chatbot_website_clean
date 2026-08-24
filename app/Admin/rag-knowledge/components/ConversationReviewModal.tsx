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

  const candidateSummary = useMemo(
    () => ({
      total: candidates.length,
      imported: candidates.filter((item) => item.alreadyImported).length,
      aiConclusion: candidates.filter((item) => item.aiConclusion).length,
    }),
    [candidates],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/55 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-review-title"
        className="flex max-h-[calc(100dvh-32px)] w-[min(1180px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] shadow-[0_30px_90px_-40px_rgba(15,23,42,0.8)]"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--admin-card-border)] px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--admin-accent)]">
              Duyệt dữ liệu chat cho RAG
            </p>
            <h2
              id="conversation-review-title"
              className="mt-1 text-xl font-black text-[var(--admin-strong-text)]"
            >
              Duyệt cuộc trò chuyện
            </h2>
            <p className="mt-1 max-w-3xl text-sm font-semibold text-[var(--admin-muted-text)]">
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

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <SummaryCard label="Tổng ứng viên" value={candidateSummary.total} />
            <SummaryCard label="AI conclusion" value={candidateSummary.aiConclusion} />
            <SummaryCard label="Đã import" value={candidateSummary.imported} />
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex min-w-0 flex-wrap gap-2">
              {filterOptions.map((option) => {
                const active = type === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={[
                      "rounded-2xl border px-3 py-2 text-left transition",
                      active
                        ? "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)] text-[var(--admin-strong-text)]"
                        : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
                    ].join(" ")}
                  >
                    <span className="block text-sm font-black">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="relative block min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted-text)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm phiên, khách, thiết bị"
                className="h-11 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] pl-9 pr-3 text-sm font-bold text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
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

          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--admin-card-border)]">
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[960px] table-auto">
                <thead>
                  <tr className="border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-left text-[11px] font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
                    <th className="px-4 py-3">Cuộc trò chuyện</th>
                    <th className="px-4 py-3">Nguồn đánh giá</th>
                    <th className="px-4 py-3">Kết luận</th>
                    <th className="px-4 py-3">Nội dung</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
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
                        className="px-4 py-10 text-center text-sm font-bold text-[var(--admin-muted-text)]"
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

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-[var(--admin-strong-text)]">
        {value.toLocaleString("vi-VN")}
      </p>
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
    <tr className="text-sm text-[var(--admin-theme-text)] transition hover:bg-[var(--admin-row-hover)]">
      <td className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-[var(--admin-strong-text)]">
              {candidate.sessionCode}
            </p>
            <p className="mt-1 truncate text-xs font-bold text-[var(--admin-muted-text)]">
              {candidate.customerName} · {candidate.customerPhone || "Chưa có SĐT"}
            </p>
            <p className="mt-1 truncate text-xs font-semibold text-[var(--admin-muted-text)]">
              {candidate.deviceType || "Chưa rõ thiết bị"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <ScoreBadge candidate={candidate} />
        <p className="mt-2 text-xs font-semibold text-[var(--admin-muted-text)]">
          {candidate.messageCount.toLocaleString("vi-VN")} tin nhắn
        </p>
      </td>

      <td className="px-4 py-3">
        <ConclusionBadge candidate={candidate} />
      </td>

      <td className="max-w-[340px] px-4 py-3">
        <p className="line-clamp-2 text-sm font-semibold text-[var(--admin-theme-text)]">
          {candidate.preview || candidate.symptom || "Chưa có nội dung xem trước."}
        </p>
      </td>

      <td className="w-0 whitespace-nowrap px-4 py-3 text-right">
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
          <p className="font-black text-[var(--admin-strong-text)]">
            {candidate.sessionCode}
          </p>
          <p className="mt-1 text-xs font-bold text-[var(--admin-muted-text)]">
            {candidate.customerName} · {candidate.deviceType || "Chưa rõ thiết bị"}
          </p>
        </div>
        <ScoreBadge candidate={candidate} />
      </div>

      <p className="mt-3 line-clamp-3 text-sm font-semibold text-[var(--admin-theme-text)]">
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
    <div className="flex flex-wrap justify-end gap-2">
      <Link
        href={`/admin/chats?sessionId=${candidate.sessionId}`}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-xs font-black text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
      >
        Mở chat
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>

      <button
        type="button"
        onClick={onImport}
        disabled={candidate.alreadyImported || importing}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-3 text-xs font-black text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {candidate.alreadyImported ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Đã import
          </>
        ) : importing ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Đang import
          </>
        ) : (
          <>
            <UploadCloud className="h-3.5 w-3.5" />
            Import RAG
          </>
        )}
      </button>
    </div>
  );
}

function ScoreBadge({ candidate }: { candidate: RagConversationCandidate }) {
  if (candidate.sourceType === "CUSTOMER_REVIEW") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/45 bg-amber-500/15 px-2.5 py-1 text-xs font-black text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-200">
        <Star className="h-3.5 w-3.5 fill-current" />
        {candidate.customerRating}/5 sao
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/45 bg-cyan-500/15 px-2.5 py-1 text-xs font-black text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200">
      <Bot className="h-3.5 w-3.5" />
      AI {candidate.aiScore}/10
    </span>
  );
}

function ConclusionBadge({ candidate }: { candidate: RagConversationCandidate }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black",
        candidate.aiConclusion
          ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200"
          : "border-emerald-400/45 bg-emerald-500/15 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-200",
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
          <td colSpan={5} className="px-4 py-3">
            <div className="h-14 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
          </td>
        </tr>
      ))}
    </>
  );
}
