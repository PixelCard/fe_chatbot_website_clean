"use client";

import {
    AlertTriangle,
    DatabaseZap,
    X,
} from "lucide-react";

import type { AiQualitySessionItem } from "../../types";

type AiQualityInsightPanelProps = {
    session: AiQualitySessionItem | null;
    onClose: () => void;
};

type InfoTone =
    | "cyan"
    | "orange"
    | "red"
    | "purple"
    | "green"
    | "blue"
    | "slate";

export default function AiQualityInsightPanel({
    session,
    onClose,
}: AiQualityInsightPanelProps) {
    if (!session) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
            <button
                type="button"
                aria-label="ÄÃ³ng phÃ¢n tÃ­ch cháº¥t lÆ°á»£ng AI"
                className="absolute inset-0 cursor-default bg-[#020817]/70 backdrop-blur-[6px]"
                onClick={onClose}
            />

            <section className="relative z-10 flex max-h-[calc(100dvh-32px)] w-[min(1040px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[linear-gradient(180deg,var(--admin-card-bg),var(--admin-soft-panel))] text-[var(--admin-strong-text)] shadow-[0_24px_80px_-40px_rgba(0,0,0,0.75)]">
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--admin-card-border)] px-5 py-4">
                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
                            PhÃ¢n tÃ­ch cháº¥t lÆ°á»£ng AI
                        </p>

                        <h2 className="mt-1 truncate text-2xl font-black tracking-tight text-[var(--admin-strong-text)]">
                            {session.customerName}
                        </h2>

                        <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
                            {session.deviceType} Â· {session.customerPhone}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-muted-text)] transition hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-strong-text)]"
                        aria-label="ÄÃ³ng"
                    >
                        <X className="h-5 w-5" strokeWidth={2.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--admin-control-bg)]/35 px-5 py-4">
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoCard
                            label="ÄÃ¡nh giÃ¡"
                            value={session.qualityLabel}
                            tone={getQualityTone(session.qualityStatus)}
                        />

                        <InfoCard
                            label="Má»©c rá»§i ro"
                            value={session.riskLabel}
                            tone={getRiskTone(session.riskLevel)}
                        />

                        <InfoCard
                            label="Tin nháº¯n"
                            value={String(session.messageCount)}
                            tone="blue"
                        />

                        <InfoCard
                            label="Cáº­p nháº­t"
                            value={formatDateTime(session.updatedAt)}
                            tone="slate"
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <article className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]" />

                                <h3 className="text-sm font-black text-[var(--admin-strong-text)]">
                                    Váº¥n Ä‘á» chÃ­nh
                                </h3>
                            </div>

                            <p className="mt-3 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-[var(--admin-theme-text)]">
                                {session.symptom}
                            </p>
                        </article>

                        <article className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#06B6D4]" />

                                <h3 className="text-sm font-black text-[var(--admin-strong-text)]">
                                    TÃ³m táº¯t AI
                                </h3>
                            </div>

                            <p className="mt-3 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-[var(--admin-theme-text)]">
                                {session.aiSummary}
                            </p>
                        </article>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
                                    <AlertTriangle className="h-4 w-4" />
                                </span>

                                <h3 className="text-sm font-black text-[var(--admin-strong-text)]">
                                    LÃ½ do Ä‘Ã¡nh giÃ¡
                                </h3>
                            </div>

                            <ul className="mt-3 space-y-2.5">
                                {session.analysisReasons.map((reason) => (
                                    <li
                                        key={reason}
                                        className="flex gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 py-2.5 text-sm font-semibold leading-6 text-[var(--admin-theme-text)]"
                                    >
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B]" />
                                        <span className="min-w-0 whitespace-pre-wrap break-words">{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]">
                                    <DatabaseZap className="h-4 w-4" />
                                </span>

                                <h3 className="text-sm font-black text-[var(--admin-strong-text)]">
                                    Gá»£i Ã½ xá»­ lÃ½
                                </h3>
                            </div>

                            <p className="mt-3 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-[var(--admin-theme-text)]">
                                {session.actionHint}
                            </p>
                        </section>
                    </div>
                </div>

                <footer className="flex shrink-0 flex-col gap-2 border-t border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:bg-[var(--admin-control-hover-bg)]"
                    >
                        ÄÃ³ng
                    </button>


                </footer>
            </section>
        </div>
    );
}

function InfoCard({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: InfoTone;
}) {
    const toneClass = {
        cyan:
            "bg-[#06B6D4]",
        orange:
            "bg-[#F59E0B]",
        red:
            "bg-[#EF4444]",
        purple:
            "bg-[#A855F7]",
        green:
            "bg-[#22C55E]",
        blue:
            "bg-[#3B82F6]",
        slate:
            "bg-[#64748B]",
    }[tone];

    return (
        <article
            className={[
                "relative overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
            ].join(" ")}
        >
            <span
                aria-hidden="true"
                className={["absolute inset-y-3 left-0 w-1 rounded-r-full", toneClass].join(" ")}
            />

            <p className="pl-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
                {label}
            </p>

            <p className="mt-1.5 break-words pl-2 text-base font-black leading-6 text-[var(--admin-strong-text)]">
                {value}
            </p>
        </article>
    );
}

function getQualityTone(status: AiQualitySessionItem["qualityStatus"]): InfoTone {
    if (status === "CRITICAL") return "orange";
    if (status === "OUT_OF_SCOPE") return "purple";
    if (status === "NEEDS_RAG") return "green";
    return "cyan";
}

function getRiskTone(riskLevel: AiQualitySessionItem["riskLevel"]): InfoTone {
    if (riskLevel === "HIGH") return "red";
    if (riskLevel === "MEDIUM") return "orange";
    return "green";
}

function formatDateTime(value?: string) {
    if (!value) return "--";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "--";
    }

    return date.toLocaleString("vi-VN");
}


