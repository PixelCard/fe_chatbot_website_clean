"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  DatabaseZap,
  ExternalLink,
  FileText,
  Loader2,
  MessageSquareText,
  RefreshCcw,
  Search,
  Star,
  UploadCloud,
} from "lucide-react";

import AdminToastStack, { type AdminToast } from "@/app/components/admin/AdminToastStack";
import AdminShell from "../../dashboard/components/Action/AdminShell";
import { useRagKnowledgeApi } from "@/app/hooks/useRagKnowledgeApi";
import type {
  ImportRagConversationPayload,
  RagConversationCandidate,
  RagConversationCandidateType,
} from "../types/ragKnowledge.types";

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

export default function RagConversationReviewPage() {
  const { getConversationCandidates, importConversationCandidate, isMutating } =
    useRagKnowledgeApi();

  const [type, setType] = useState<RagConversationCandidateType>("ALL");
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<RagConversationCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const [importingSessionId, setImportingSessionId] = useState<number | null>(
    null,
  );

  const [importedCount, setImportedCount] = useState<number>(0);

  useEffect(() => {
    let active = true;

    getConversationCandidates({ type: "IMPORTED" })
      .then((items) => {
        if (active) {
          setImportedCount(items.length);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [getConversationCandidates, toasts]);

  const candidateSummary = useMemo(
    () => ({
      total: type === "IMPORTED" ? importedCount : candidates.length,
      imported: importedCount,
      aiConclusion: candidates.filter((item) => item.aiConclusion).length,
    }),
    [candidates, importedCount, type],
  );

  const activeFilter = useMemo(
    () => filterOptions.find((option) => option.value === type) ?? filterOptions[0],
    [type],
  );

  const loadCandidates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const items = await getConversationCandidates({
        type,
        search: search.trim() || undefined,
      });
      setCandidates(items);
    } catch (nextError) {
      addToast("error", "Import RAG thất bại. Vui lòng thử lại.");
      setError(
        (nextError as { message?: string }).message ||
        "Không thể tải danh sách cuộc trò chuyện.",
      );
      setCandidates([]);
      addToast("error", "Import RAG thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCandidates();
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, search]);

  const addToast = (type: AdminToast["type"], text: string) => {
    if (
      type === "error" &&
      text.includes("Import RAG") &&
      importingSessionId === null
    ) {
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleImport = async (payload: ImportRagConversationPayload) => {
    setImportingSessionId(payload.sessionId);
    setError(null);

    try {
      const candidate = candidates.find(
        (item) => item.sessionId === payload.sessionId,
      );
      await importConversationCandidate(payload);
      await loadCandidates();
      addToast(
        "success",
        `Đã import ${candidate?.sessionCode ?? `session ${payload.sessionId}`} vào kho RAG.`,
      );
    } catch (nextError) {
      addToast("error", "Import RAG thất bại. Vui lòng thử lại.");
      setError(
        (nextError as { message?: string }).message ||
        "Không thể import cuộc trò chuyện này.",
      );
    } finally {
      setImportingSessionId(null);
    }
  };

  return (
    <AdminShell>
      <section className="w-full min-w-0 space-y-5 px-4 py-4 sm:px-5 lg:px-6 xl:px-8">
        <AdminToastStack toasts={toasts} onRemove={removeToast} />

        <section className="admin-card relative overflow-hidden rounded-3xl px-5 py-6 sm:px-6 lg:px-7">
          <span className="absolute inset-x-0 top-0 h-1 bg-[image:var(--admin-cta-bg)] opacity-90" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--admin-muted-text)]">
                <Link
                  href="/admin/rag-knowledge"
                  className="inline-flex items-center gap-1 transition hover:text-[var(--admin-accent)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kho tri thức RAG
                </Link>
                <span>/</span>
                <span className="text-[var(--admin-strong-text)]">
                  Duyệt cuộc trò chuyện
                </span>
              </div>

              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--admin-accent)]">
                Duyệt dữ liệu chat cho RAG
              </p>
              <h1 className="mt-2 text-[2rem] font-black tracking-tight text-[var(--admin-strong-text)] sm:text-[2.5rem]">
                Chuyển đổi session sang tài liệu RAG
              </h1>
              <p className="mt-3 max-w-4xl text-base font-medium leading-7 text-[var(--admin-muted-text)]">
                Chọn các cuộc trò chuyện có đánh giá tốt hoặc AI conclusion đủ
                điểm để import vào kho tri thức dưới dạng tài liệu chat.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void loadCandidates()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-black text-[var(--admin-strong-text)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
              >
                <RefreshCcw className="h-4 w-4" />
                Làm mới
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="Tổng ứng viên" value={candidateSummary.total} />
          <SummaryCard
            label="AI conclusion"
            value={candidateSummary.aiConclusion}
          />
          <SummaryCard label="Đã import" value={candidateSummary.imported} />
        </section>

        <section className="admin-card rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:flex-nowrap xl:items-start xl:justify-between">
            <div className="flex min-w-0 flex-wrap gap-3 xl:flex-1">
              {filterOptions.map((option) => {
                const active = type === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={[
                      "group min-h-[82px] min-w-[180px] basis-[180px] rounded-2xl border px-5 py-4 text-left transition-all duration-200 ease-out xl:min-w-0 xl:flex-1",
                      active
                        ? "translate-y-[-1px] border-[var(--admin-accent)] bg-[var(--admin-accent-soft)] text-[var(--admin-strong-text)] shadow-[0_14px_30px_-20px_rgba(249,115,22,0.9)] ring-1 ring-[var(--admin-accent)]/20"
                        : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] hover:-translate-y-0.5 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    <span className="block text-[1.45rem] font-black leading-6">
                      {option.label}
                    </span>
                    <span className="mt-1.5 block text-[15px] font-semibold leading-6">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="relative block w-full min-w-0 xl:w-[320px] xl:max-w-[320px] xl:shrink-0">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--admin-muted-text)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm phiên, khách, thiết bị"
                className="h-14 w-full rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] pl-12 pr-5 text-lg font-black text-[var(--admin-strong-text)] outline-none transition-all duration-200 placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus-ring)]"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-base font-black text-[var(--admin-muted-text)]">
              Đang lọc:
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--admin-accent)]/25 bg-[var(--admin-accent-soft)] px-4 py-2 text-base font-black text-[var(--admin-strong-text)]">
              {activeFilter.label}
            </span>
            <span className="text-base font-medium text-[var(--admin-muted-text)]">
              {activeFilter.description}
            </span>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm font-bold text-rose-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200">
              {error}
            </div>
          ) : null}
        </section>

        <section className="admin-card overflow-hidden rounded-3xl">
          <header className="flex flex-col gap-3 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-tight text-[var(--admin-strong-text)]">
                Danh sách session đủ điều kiện
              </h2>
              <p className="mt-1 text-base font-medium text-[var(--admin-muted-text)]">
                Rà soát nhanh rồi import trực tiếp vào kho tri thức.
              </p>
            </div>

            <span className="inline-flex h-11 items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-4 text-sm font-black text-[var(--admin-strong-text)]">
              {candidateSummary.total} session
            </span>
          </header>

          <div className="hidden lg:block">
            <div className="grid grid-cols-[1.65fr_0.9fr_1.1fr_1.6fr_200px] gap-x-8 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-5 py-4 text-left text-sm font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-300">
              <div>Cuộc trò chuyện</div>
              <div>Nguồn đánh giá</div>
              <div>Trạng thái</div>
              <div>Nội dung</div>
              <div className="text-right">Thao tác</div>
            </div>

            <div className="divide-y divide-[var(--admin-card-border)]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="px-5 py-3">
                    <div className="h-16 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
                  </div>
                ))
              ) : candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <DesktopRow
                    key={`${candidate.type}-${candidate.sessionId}`}
                    candidate={candidate}
                    importing={
                      importingSessionId === candidate.sessionId || isMutating
                    }
                    onImport={() =>
                      void handleImport({
                        sessionId: candidate.sessionId,
                        sourceType: candidate.sourceType,
                      })
                    }
                  />
                ))
              ) : (
                <div className="px-5 py-12 text-center text-sm font-bold text-[var(--admin-muted-text)]">
                  Chưa có cuộc trò chuyện phù hợp với bộ lọc hiện tại.
                </div>
              )}
            </div>
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
                <MobileCard
                  key={`${candidate.type}-${candidate.sessionId}`}
                  candidate={candidate}
                  importing={
                    importingSessionId === candidate.sessionId || isMutating
                  }
                  onImport={() =>
                    void handleImport({
                      sessionId: candidate.sessionId,
                      sourceType: candidate.sourceType,
                    })
                  }
                />
              ))
            ) : (
              <p className="py-8 text-center text-sm font-bold text-[var(--admin-muted-text)]">
                Chưa có cuộc trò chuyện phù hợp với bộ lọc hiện tại.
              </p>
            )}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  const tone =
    label === "AI conclusion"
      ? "cyan"
      : label.toLowerCase().includes("import")
        ? "green"
        : "orange";

  const toneClasses = {
    orange: {
      icon: FileText,
      iconClassName:
        "border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
      accentClassName: "bg-[#FF7A00]",
    },
    cyan: {
      icon: DatabaseZap,
      iconClassName:
        "border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
      accentClassName: "bg-[#06B6D4]",
    },
    green: {
      icon: CheckCircle2,
      iconClassName:
        "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
      accentClassName: "bg-[#22C55E]",
    },
  } as const;

  const toneConfig = toneClasses[tone];
  const Icon = toneConfig.icon;

  return (
    <section className="admin-card group relative min-h-[124px] overflow-hidden rounded-3xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]">
      <span
        aria-hidden="true"
        className={["absolute inset-x-0 top-0 h-1", toneConfig.accentClassName].join(
          " ",
        )}
      />

      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
            {label}
          </p>
          <p className="mt-4 text-[3rem] font-black leading-none tracking-tight text-[var(--admin-strong-text)]">
            {value.toLocaleString("vi-VN")}
          </p>
        </div>

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-200 group-hover:scale-105",
            toneConfig.iconClassName,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" strokeWidth={2.3} />
        </div>
      </div>
    </section>
  );
}

function DesktopRow({
  candidate,
  importing,
  onImport,
}: {
  candidate: RagConversationCandidate;
  importing: boolean;
  onImport: () => void;
}) {
  return (
    <div className="grid grid-cols-[1.65fr_0.9fr_1.1fr_1.6fr_200px] items-start gap-x-8 px-5 py-5 transition-all duration-200 ease-out hover:bg-[var(--admin-control-hover-bg)]">
      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-600 transition-transform duration-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200">
            <MessageSquareText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-[1.5rem] font-black leading-6 text-[var(--admin-strong-text)]">
                {candidate.sessionCode}
              </p>
              <ImportStateBadge imported={candidate.alreadyImported} />
            </div>
            <p className="mt-1 truncate text-[17px] font-extrabold leading-6 text-[var(--admin-strong-text)]">
              {candidate.customerName} ·{" "}
              {candidate.customerPhone || "Chưa có SĐT"}
            </p>
            <p className="mt-1 truncate text-[15px] font-bold leading-6 text-orange-500 dark:text-orange-400">
              {candidate.deviceType || "Chưa rõ thiết bị"}
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <ScoreBadge candidate={candidate} />
        <p className="mt-2 text-[15px] font-semibold leading-6 text-[var(--admin-muted-text)]">
          {candidate.messageCount.toLocaleString("vi-VN")} tin nhắn
        </p>
      </div>

      <div className="min-w-0 space-y-2">
        <ConclusionBadge candidate={candidate} />
        <p className="text-[15px] font-semibold leading-6 text-[var(--admin-muted-text)]">
          {candidate.aiConclusion
            ? "Đã có AI conclusion đủ điều kiện import."
            : "Đủ điều kiện theo đánh giá khách hàng."}
        </p>
      </div>

      <div className="min-w-0">
        <p className="line-clamp-3 text-[17px] font-extrabold leading-relaxed text-[var(--admin-theme-text)]">
          {candidate.preview || candidate.symptom || "Chưa có nội dung xem trước."}
        </p>
      </div>

      <div className="flex justify-end">
        <CandidateActions
          candidate={candidate}
          importing={importing}
          onImport={onImport}
        />
      </div>
    </div>
  );
}

function MobileCard({
  candidate,
  importing,
  onImport,
}: {
  candidate: RagConversationCandidate;
  importing: boolean;
  onImport: () => void;
}) {
  return (
    <article className="rounded-3xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-black text-[var(--admin-strong-text)]">
              {candidate.sessionCode}
            </p>
            <ImportStateBadge imported={candidate.alreadyImported} />
          </div>
          <p className="mt-1 text-sm font-bold text-[var(--admin-muted-text)]">
            {candidate.customerName} · {candidate.deviceType || "Chưa rõ thiết bị"}
          </p>
        </div>
        <ScoreBadge candidate={candidate} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConclusionBadge candidate={candidate} />
        <span className="text-sm font-semibold text-[var(--admin-muted-text)]">
          {candidate.messageCount.toLocaleString("vi-VN")} tin nhắn
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-[15px] font-semibold leading-7 text-[var(--admin-theme-text)]">
        {candidate.preview || candidate.symptom || "Chưa có nội dung xem trước."}
      </p>

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
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end lg:w-[180px] lg:flex-col lg:items-stretch">
      <Link
        href={`/admin/chats?sessionId=${candidate.sessionId}`}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-black text-[var(--admin-strong-text)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] lg:w-full"
      >
        Mở chat
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>

      <button
        type="button"
        onClick={onImport}
        disabled={candidate.alreadyImported || importing}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-black text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55 lg:w-full"
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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/45 bg-amber-500/15 px-3.5 py-2 text-[15px] font-black leading-none text-amber-700 transition-colors [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-200">
        <Star className="h-3.5 w-3.5 fill-current" />
        {candidate.customerRating}/5 sao
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/45 bg-cyan-500/15 px-3.5 py-2 text-[15px] font-black leading-none text-cyan-700 transition-colors [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200">
      <Bot className="h-3.5 w-3.5" />
      AI {candidate.aiScore}/10
    </span>
  );
}

function ConclusionBadge({ candidate }: { candidate: RagConversationCandidate }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[15px] font-black leading-none transition-colors",
        candidate.aiConclusion
          ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200"
          : "border-emerald-400/45 bg-emerald-500/15 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-200",
      ].join(" ")}
    >
      {candidate.aiConclusion ? "AI conclusion" : "Khách hàng đánh giá"}
    </span>
  );
}

function ImportStateBadge({ imported }: { imported: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-black leading-none",
        imported
          ? "border-emerald-400/40 bg-emerald-500/12 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-200"
          : "border-amber-400/40 bg-amber-500/12 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-200",
      ].join(" ")}
    >
      {imported ? "Đã import" : "Chưa import"}
    </span>
  );
}
