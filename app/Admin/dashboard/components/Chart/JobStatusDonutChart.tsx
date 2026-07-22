"use client";

import { useState } from "react";
import type { JobStatus, StatusPoint } from "../../type/types";
import { JOB_STATUS_LABEL } from "../../type/status";

const STATUS_ORDER: JobStatus[] = [
  "AI_CONSULTING",
  "BROADCASTING",
  "MATCHED",
  "EN_ROUTE",
  "ARRIVED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_COLOR: Record<JobStatus, string> = {
  AI_CONSULTING: "#A855F7",
  BROADCASTING: "#06B6D4",
  MATCHED: "#3B82F6",
  EN_ROUTE: "#F97316",
  ARRIVED: "#14B8A6",
  IN_PROGRESS: "#EAB308",
  COMPLETED: "#22C55E",
  CANCELLED: "#EF4444",
};

type JobStatusDonutChartProps = {
  data: StatusPoint[];
  loading?: boolean;
  error?: string | null;
};

export default function JobStatusDonutChart({
  data,
  loading,
  error,
}: JobStatusDonutChartProps) {
  const [hoveredStatus, setHoveredStatus] = useState<JobStatus | null>(null);

  if (loading) {
    return (
      <div className="admin-card h-80 animate-pulse rounded-3xl" />
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm text-[#FCA5A5]">
        Không tải được biểu đồ: {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="admin-card rounded-3xl p-4 text-sm text-[var(--admin-theme-text-muted)]">
        Chưa có dữ liệu để hiển thị biểu đồ.
      </div>
    );
  }

  const normalized = STATUS_ORDER.map((status) => ({
    status,
    count: data.find((item) => item.status === status)?.count ?? 0,
  }));

  const total = normalized.reduce((sum, item) => sum + item.count, 0);

  const segments = normalized
    .reduce<
      Array<
        (typeof normalized)[number] & {
          percentage: number;
          start: number;
          tooltipX: number;
          tooltipY: number;
        }
      >
    >((acc, item) => {
      const start =
        acc.length > 0 ? acc[acc.length - 1].start + acc[acc.length - 1].percentage : 0;
      const percentage = total > 0 ? (item.count / total) * 100 : 0;
      const middle = start + percentage / 2;
      const angle = middle * 3.6 - 90;
      const radian = (angle * Math.PI) / 180;

      acc.push({
        ...item,
        percentage,
        start,
        tooltipX: 50 + Math.cos(radian) * 43,
        tooltipY: 50 + Math.sin(radian) * 43,
      });
      return acc;
    }, [])
    .filter((item) => item.count > 0);

  const hoveredSegment =
    segments.find((item) => item.status === hoveredStatus) ?? null;

  return (
    <article className="admin-card relative min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(249,115,22,0.08),transparent_28%)]"
      />

      <div className="relative space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--admin-strong-text)] sm:text-xl">
              Tỉ lệ trạng thái đơn
            </h3>
          </div>
        </div>

        <div className="flex justify-self-center">
          <span className="rounded-lg border border-[var(--admin-control-border)] bg-[var(--admin-control-bg)] px-3 py-2 text-xs font-semibold text-[var(--admin-theme-text-muted)] sm:text-sm">
            Toàn bộ dữ liệu hiện có
          </span>
        </div>
      </div>

      <div className="relative mt-6 flex min-w-0 flex-col gap-5">
        <div className="flex justify-center">
          <div className="relative h-[clamp(13rem,42vw,16rem)] w-[clamp(13rem,42vw,16rem)]">
            <svg
              viewBox="0 0 120 120"
              className="h-full w-full -rotate-90 overflow-visible"
            >
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="var(--admin-control-border)"
                strokeWidth="14"
              />

              {segments.map((item) => {
                const isActive = hoveredStatus === item.status;

                return (
                  <circle
                    key={item.status}
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    pathLength={100}
                    stroke={STATUS_COLOR[item.status]}
                    strokeWidth={isActive ? "16" : "14"}
                    strokeDasharray={`${item.percentage} ${100 - item.percentage}`}
                    strokeDashoffset={-item.start}
                    strokeLinecap="butt"
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      pointerEvents: "stroke",
                      opacity:
                        hoveredStatus && hoveredStatus !== item.status ? 0.35 : 1,
                      filter: isActive
                        ? `drop-shadow(0 0 10px ${STATUS_COLOR[item.status]}66)`
                        : undefined,
                    }}
                    onMouseEnter={() => setHoveredStatus(item.status)}
                    onMouseLeave={() => setHoveredStatus(null)}
                  />
                );
              })}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-[58%] w-[58%] flex-col items-center justify-center rounded-full bg-[var(--admin-card-bg)] text-center">
                <p className="text-4xl font-extrabold leading-none text-[var(--admin-strong-text)] sm:text-[2.6rem]">
                  {total}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[var(--admin-theme-text-muted)] sm:text-xs">
                  Tong don
                </p>
              </div>
            </div>

            {hoveredSegment ? (
              <div
                className="pointer-events-none absolute z-50 w-[118px] -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-xs shadow-2xl backdrop-blur-md transition-all duration-150"
                style={{
                  left: `${hoveredSegment.tooltipX}%`,
                  top: `${hoveredSegment.tooltipY}%`,
                  borderColor: `${STATUS_COLOR[hoveredSegment.status]}CC`,
                  backgroundColor: "var(--admin-control-bg)",
                  boxShadow: `0 10px 30px ${STATUS_COLOR[hoveredSegment.status]}44`,
                }}
              >
                <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_COLOR[hoveredSegment.status] }}
                  />
                  <span className="min-w-0 truncate text-sm font-bold text-[var(--admin-strong-text)]">
                    {JOB_STATUS_LABEL[hoveredSegment.status]}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-[var(--admin-theme-text-muted)]">Don</p>
                    <p className="text-lg font-extrabold leading-tight text-[var(--admin-strong-text)]">
                      {hoveredSegment.count}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[var(--admin-theme-text-muted)]">Ti le</p>
                    <p className="text-lg font-extrabold leading-tight text-[var(--admin-strong-text)]">
                      {hoveredSegment.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <ul className="min-w-0 space-y-2">
          {normalized.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;

            return (
              <li
                key={item.status}
                className="grid min-w-0 grid-cols-[12px_minmax(0,1fr)_36px_48px] items-center gap-2 rounded-xl border border-[var(--admin-control-border)] bg-[var(--admin-control-bg)] px-3 py-2.5 text-xs transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] sm:grid-cols-[12px_minmax(0,1fr)_44px_56px] sm:gap-3 sm:text-sm"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLOR[item.status] }}
                />
                <span className="min-w-0 truncate font-semibold text-[var(--admin-theme-text)]">
                  {JOB_STATUS_LABEL[item.status]}
                </span>
                <span className="text-right text-base font-bold text-[var(--admin-strong-text)]">
                  {item.count}
                </span>
                <span className="text-right text-[var(--admin-theme-text-muted)]">
                  {percentage.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
