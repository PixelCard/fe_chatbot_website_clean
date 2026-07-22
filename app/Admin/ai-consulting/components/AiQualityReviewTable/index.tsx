"use client";

import { Eye, MessageSquareText, Phone, Wrench } from "lucide-react";

import { AdminDetailAction } from "../../../_shared/components/AdminDetailAction";
import type { AiQualitySessionItem } from "../../types";

type AiQualityReviewTableProps = {
    items: AiQualitySessionItem[];
    onAnalyze: (session: AiQualitySessionItem) => void;
};

export default function AiQualityReviewTable({
    items,
    onAnalyze,
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
                <div className="grid grid-cols-[1.25fr_1fr_minmax(0,2.3fr)_1fr_0.85fr] items-center border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-[var(--admin-muted-text)]">
                    <div>Khách hàng</div>
                    <div>Thiết bị</div>
                    <div>Vấn đề</div>
                    <div>Đánh giá AI</div>
                    <div className="text-right">Thao tác</div>
                </div>

                <div className="max-h-[calc(100vh-390px)] min-h-[430px] divide-y divide-[var(--admin-card-border)] overflow-y-auto">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[1.25fr_1fr_minmax(0,2.3fr)_1fr_0.85fr] items-center px-5 py-4 transition hover:bg-[var(--admin-control-hover-bg)]"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-[15px] font-black text-[var(--admin-strong-text)]">
                                    {item.customerName}
                                </p>

                                <p className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-xs font-semibold text-[var(--admin-muted-text)]">
                                    <Phone className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{item.customerPhone}</span>
                                </p>
                            </div>

                            <p className="inline-flex min-w-0 items-center gap-1.5 truncate text-[15px] font-bold text-[var(--admin-strong-text)]">
                                <Wrench className="h-4 w-4 shrink-0 text-[var(--admin-muted-text)]" />
                                <span className="truncate">{item.deviceType}</span>
                            </p>

                            <p className="truncate text-[15px] font-semibold text-[var(--admin-muted-text)]">
                                {item.symptom}
                            </p>

                            <QualityBadge
                                status={item.qualityStatus}
                                label={item.qualityLabel}
                            />

                            <div className="flex justify-end">
                                <AdminDetailAction
                                    onClick={() => onAnalyze(item)}
                                    icon={<Eye className="h-4 w-4" strokeWidth={2.5} />}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="divide-y divide-[var(--admin-card-border)] lg:hidden">
                {items.map((item) => (
                    <article
                        key={item.id}
                        className="p-4 transition hover:bg-[var(--admin-control-hover-bg)]"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="truncate text-base font-black text-[var(--admin-strong-text)]">
                                    {item.customerName}
                                </h3>

                                <p className="mt-1 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
                                    {item.deviceType} · {item.customerPhone}
                                </p>
                            </div>

                            <QualityBadge
                                status={item.qualityStatus}
                                label={item.qualityLabel}
                            />
                        </div>

                        <p className="mt-3 truncate text-sm font-semibold text-[var(--admin-muted-text)]">
                            {item.symptom}
                        </p>

                        <div className="mt-4 flex justify-end">
                            <AdminDetailAction
                                onClick={() => onAnalyze(item)}
                                icon={<Eye className="h-4 w-4" strokeWidth={2.5} />}
                            />
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
            ? "border-[#FF7A00]/35 bg-[#FF7A00]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FFB366]"
            : status === "OUT_OF_SCOPE"
                ? "border-[#A855F7]/35 bg-[#A855F7]/10 text-[#7E22CE] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#C084FC]"
                : status === "NEEDS_RAG"
                    ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
                    : "border-[#06B6D4]/35 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]";

    return (
        <span
            className={[
                "inline-flex h-8 w-fit items-center rounded-full border px-3 text-xs font-black",
                className,
            ].join(" ")}
        >
            {label}
        </span>
    );
}
