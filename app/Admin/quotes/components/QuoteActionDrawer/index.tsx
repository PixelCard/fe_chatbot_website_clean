"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ReceiptText,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import type { QuoteItem } from "../../types/quote.types";

interface QuoteActionDrawerProps {
  open: boolean;
  quote?: QuoteItem | null;
  onClose: () => void;
}

export default function QuoteActionDrawer({
  open,
  quote,
  onClose,
}: QuoteActionDrawerProps) {
  if (!open || !quote) return null;

  const warnings = getQuoteWarnings(quote);
  const latestHistory = quote.history.slice(0, 4);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[#020617]/72 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="ÄÃ³ng popup bÃ¡o giÃ¡"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative z-10 flex w-[min(1120px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] flex-col overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] text-[var(--admin-theme-text)] shadow-[0_24px_80px_rgba(2,8,23,0.28)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B1424]">
        <header className="shrink-0 border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-6 py-5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0F192B]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                  BÃ¡o giÃ¡ {quote.id}
                </h2>
                <StatusBadge status={quote.status} />
              </div>

              <p className="mt-2 truncate text-sm font-semibold text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
                {quote.customerName || "KhÃ¡ch hÃ ng chÆ°a xÃ¡c Ä‘á»‹nh"} Â·{" "}
                {quote.deviceName || "ChÆ°a rÃµ thiáº¿t bá»‹"} Â·{" "}
                {formatVND(quote.totalAmount)}
              </p>

              <p className="mt-1 text-xs font-semibold text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                Cáº­p nháº­t gáº§n nháº¥t Â· {formatTimestamp(quote.updatedAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="ÄÃ³ng"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#FF8A1F]/45 hover:text-[#C2410C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/45 focus-visible:ring-offset-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus-visible:ring-offset-[#0B1424] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid auto-rows-min gap-4 xl:grid-cols-2">
            <SectionCard title="ThÃ´ng tin bÃ¡o giÃ¡" icon={<ReceiptText />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoField
                  label="Tá»•ng tiá»n"
                  value={formatVND(quote.totalAmount)}
                  tone="cyan"
                />
                <InfoField label="Thiáº¿t bá»‹" value={quote.deviceName || "--"} />
                <InfoField
                  label="KhÃ¡ch hÃ ng"
                  value={quote.customerName || "--"}
                />
                <InfoField
                  label="Ká»¹ thuáº­t viÃªn"
                  value={quote.technicianName || "--"}
                />
                <InfoField
                  label="Ca sá»­a chá»¯a"
                  value={quote.sessionId || "--"}
                />
                <InfoField
                  label="Tráº¡ng thÃ¡i"
                  value={<StatusBadge status={quote.status} />}
                />
                <InfoField
                  label="MÃ´ táº£ lá»—i"
                  value={quote.issueSummary || "ChÆ°a cÃ³ mÃ´ táº£ bÃ¡o giÃ¡"}
                  spanFull
                  multiline
                />
                <InfoField
                  label="Äá»‹a chá»‰"
                  value={quote.address || "ChÆ°a cÃ³ Ä‘á»‹a chá»‰"}
                  spanFull
                  multiline
                />
              </div>
            </SectionCard>

            {warnings.length > 0 ? (
              <section className="rounded-2xl border border-amber-200/70 bg-amber-50/90 p-4 shadow-sm shadow-amber-100/50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-white text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-300/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0F172A] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-200">
                    <AlertTriangle className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-amber-900 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-100">
                      Cáº£nh bÃ¡o
                    </p>

                    <div className="mt-2 space-y-2">
                      {warnings.map((warning) => (
                        <WarningLine key={warning}>{warning}</WarningLine>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-emerald-200/75 bg-emerald-50/85 px-4 py-3 shadow-sm shadow-emerald-100/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-400/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-300" />
                  <p className="text-sm font-semibold leading-6 text-emerald-900 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-100">
                    BÃ¡o giÃ¡ á»•n Ä‘á»‹nh, chÆ°a cÃ³ cáº£nh bÃ¡o.
                  </p>
                </div>
              </section>
            )}

            <SectionCard title="Lá»‹ch sá»­ gáº§n nháº¥t" icon={<Clock3 />}>
              {latestHistory.length > 0 ? (
                <div className="space-y-2">
                  {latestHistory.map((item) => (
                    <HistoryLine
                      key={`${item.action}-${item.at}`}
                      action={item.action}
                      at={item.at}
                      actor={item.actor}
                      note={item.note}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                  ChÆ°a cÃ³ lá»‹ch sá»­ xá»­ lÃ½.
                </p>
              )}
            </SectionCard>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 shadow-sm shadow-slate-100/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#FF8A1F]/25 bg-[#FF8A1F]/10 text-[#C2410C] [&>svg]:h-5 [&>svg]:w-5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
          {icon}
        </span>
        <h3 className="text-base font-extrabold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function InfoField({
  label,
  value,
  tone = "default",
  multiline = false,
  spanFull = false,
}: {
  label: string;
  value: ReactNode;
  tone?: "cyan" | "green" | "amber" | "red" | "default";
  multiline?: boolean;
  spanFull?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.03)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F]",
        spanFull ? "sm:col-span-2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
        {label}
      </p>

      <div
        className={[
          "mt-2 min-w-0 text-sm font-extrabold",
          multiline
            ? "break-words leading-6 [overflow-wrap:anywhere]"
            : "truncate",
          tone === "cyan" &&
            "text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
          tone === "green" &&
            "text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
          tone === "amber" &&
            "text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
          tone === "red" &&
            "text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
          tone === "default" &&
            "text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function HistoryLine({
  action,
  at,
  actor,
  note,
}: {
  action: string;
  at: string;
  actor: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 py-2.5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm font-extrabold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
          {action}
        </p>
        <span className="shrink-0 text-xs font-bold text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
          {formatTimestamp(at)}
        </span>
      </div>

      <p className="mt-1 text-xs font-semibold text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
        {actor}
      </p>

      {note ? (
        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
          {note}
        </p>
      ) : null}
    </div>
  );
}

function WarningLine({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/20 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]" />
        <p className="text-sm font-bold leading-6 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDE68A]">
          {children}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: QuoteItem["status"] }) {
  return (
    <span
      className={[
        "inline-flex h-8 items-center rounded-full border px-3 text-sm font-bold",
        status === "PENDING" &&
          "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]",
        status === "ACCEPTED" &&
          "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
        status === "REJECTED" &&
          "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {getQuoteStatusLabel(status)}
    </span>
  );
}

function getQuoteWarnings(quote: QuoteItem) {
  const warnings: string[] = [];

  if (quote.isOverdueLv2) {
    warnings.push("QuÃ¡ háº¡n pháº£n há»“i má»©c 2, cáº§n xá»­ lÃ½ Æ°u tiÃªn.");
  } else if (quote.isOverdueLv1) {
    warnings.push("QuÃ¡ háº¡n pháº£n há»“i má»©c 1, nÃªn nháº¯c khÃ¡ch sá»›m.");
  }

  if (quote.isStateMismatch) {
    warnings.push("Tráº¡ng thÃ¡i bÃ¡o giÃ¡ khÃ´ng khá»›p vá»›i ca sá»­a chá»¯a.");
  }

  if (quote.isAbnormalAmount) {
    warnings.push("Tá»•ng tiá»n cÃ³ dáº¥u hiá»‡u báº¥t thÆ°á»ng, cáº§n kiá»ƒm tra.");
  }

  return warnings;
}

function getQuoteStatusLabel(status: QuoteItem["status"]) {
  if (status === "PENDING") return "Chá» pháº£n há»“i";
  if (status === "ACCEPTED") return "ÄÃ£ cháº¥p nháº­n";
  if (status === "REJECTED") return "ÄÃ£ tá»« chá»‘i";
  return status;
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} Â· ${hours}:${minutes}`;
}

function formatVND(amount: number) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)} Ä‘`;
}
