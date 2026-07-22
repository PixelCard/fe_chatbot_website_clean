"use client";

import { useMemo, useRef, useState } from "react";
import { dashboardService } from "../../services/dashboard.service";
import type { RevenuePoint, RevenueReportQuery } from "../../type/types";

type SafePoint = {
  date: string;
  jobs: number;
  revenue: number; // đơn vị: triệu
};

type HoverPoint = {
  index: number;
  x: number;
};

type DatePreset = "1d" | "7d" | "15d" | "30d" | "month" | "year";

const DATE_PRESETS: Array<{ value: DatePreset; label: string }> = [
  { value: "1d", label: "1 ngày" },
  { value: "7d", label: "7 ngày" },
  { value: "15d", label: "15 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm nay" },
];

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getPresetQuery(preset: DatePreset): RevenueReportQuery {
  const today = new Date();

  if (preset === "month") {
    return {
      from: toInputDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      to: toInputDate(today),
      groupBy: "day",
    };
  }

  if (preset === "year") {
    return {
      from: toInputDate(new Date(today.getFullYear(), 0, 1)),
      to: toInputDate(today),
      groupBy: "month",
    };
  }

  const days = preset === "1d" ? 0 : preset === "7d" ? 6 : preset === "15d" ? 14 : 29;
  return {
    from: toInputDate(addDays(today, -days)),
    to: toInputDate(today),
    groupBy: "day",
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }

  return {};
}

function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const normalized = value.replace(/[^\d.-]/g, "");
    const parsed = Number(normalized);

    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
}

function getFirstNumber(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (key in item) {
      return parseNumber(item[key]);
    }
  }

  return 0;
}

function getFirstText(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "--";
}

function normalizeRevenueData(data: RevenuePoint[] = []): SafePoint[] {
  const rawItems = data.map((rawItem) => {
    const item = toRecord(rawItem);

    return {
      date: getFirstText(item, [
        "date",
        "label",
        "day",
        "name",
        "time",
        "createdAt",
      ]),
      jobs: getFirstNumber(item, [
        "jobs",
        "orders",
        "orderCount",
        "totalOrders",
        "totalJobs",
        "repairCount",
        "sessions",
        "count",
      ]),
      rawRevenue: getFirstNumber(item, [
        "revenue",
        "totalRevenue",
        "revenueAmount",
        "amount",
        "income",
        "money",
      ]),
    };
  });

  const maxRawRevenue = Math.max(
    ...rawItems.map((item) => item.rawRevenue),
    0,
  );

  // Nếu revenue lớn hơn 10.000 thì coi là VND và đổi sang triệu.
  // Nếu revenue đã là 0.5 / 1.2 / 3.5 thì giữ nguyên.
  const shouldConvertToMillion = maxRawRevenue > 10_000;

  return rawItems.map((item) => ({
    date: item.date,
    jobs: item.jobs,
    revenue: shouldConvertToMillion
      ? item.rawRevenue / 1_000_000
      : item.rawRevenue,
  }));
}

function roundUp(value: number, step: number) {
  if (!Number.isFinite(value) || value <= 0) return step;
  return Math.ceil(value / step) * step;
}

function toSharpPath(points: Array<{ x: number; y: number }>) {
  if (!points.length) return "";

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function buildAreaPath(
  linePath: string,
  points: Array<{ x: number; y: number }>,
  baselineY: number,
) {
  if (!points.length || !linePath) return "";

  return `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x
    } ${baselineY} Z`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatMillion(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: value < 10 ? 1 : 0,
  }).format(value);
}

export default function RevenueLineChart({
  data = [],
  loading,
  error,
}: {
  data?: RevenuePoint[];
  loading?: boolean;
  error?: string | null;
}) {
  const [hover, setHover] = useState<HoverPoint | null>(null);
  const [activePreset, setActivePreset] = useState<DatePreset>("7d");
  const [reportData, setReportData] = useState<RevenuePoint[] | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const loadPreset = async (preset: DatePreset) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setActivePreset(preset);
    setHover(null);
    setReportLoading(true);
    setReportError(null);

    try {
      const report = await dashboardService.getRevenueReport(getPresetQuery(preset));
      if (requestIdRef.current !== requestId) return;

      setReportData(
        report.series.map((item) => ({
          date: item.label,
          jobs: item.jobs,
          revenue: item.revenue,
        })),
      );
    } catch (caughtError) {
      if (requestIdRef.current !== requestId) return;

      setReportData(null);
      setReportError(
        caughtError && typeof caughtError === "object" && "message" in caughtError
          ? String(caughtError.message)
          : "Không tải được dữ liệu doanh thu theo thời gian.",
      );
    } finally {
      if (requestIdRef.current === requestId) setReportLoading(false);
    }
  };

  const chartData = useMemo(
    () => normalizeRevenueData(reportData ?? data),
    [data, reportData],
  );
  const activeError = reportError ?? error;

  if (loading || reportLoading) {
    return <div className="admin-card h-[430px] animate-pulse rounded-3xl" />;
  }

  if (activeError) {
    return (
      <div className="rounded-3xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm font-bold text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]">
        Không tải được biểu đồ: {activeError}
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="admin-card rounded-3xl p-4 text-sm font-bold text-[var(--admin-strong-text)]">
        Chưa có dữ liệu đơn sửa và doanh thu.
      </div>
    );
  }

  const width = 920;
  const height = 340;

  const padLeft = 56;
  const padRight = 70;
  const padTop = 34;
  const padBottom = 46;

  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;
  const baselineY = padTop + innerHeight;

  const maxJobs = Math.max(...chartData.map((item) => item.jobs), 0);
  const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 0);

  const roundedMaxJobs = roundUp(maxJobs, maxJobs <= 10 ? 2 : 10);
  const roundedMaxRevenue = roundUp(maxRevenue, maxRevenue <= 1 ? 0.25 : 1);

  const totalJobs = chartData.reduce((sum, item) => sum + item.jobs, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  const x = (index: number) =>
    padLeft + (index / Math.max(chartData.length - 1, 1)) * innerWidth;

  const yJobs = (value: number) =>
    padTop + innerHeight - (value / Math.max(roundedMaxJobs, 1)) * innerHeight;

  const yRevenue = (value: number) =>
    padTop +
    innerHeight -
    (value / Math.max(roundedMaxRevenue, 1)) * innerHeight;

  const jobsPoints = chartData.map((item, index) => ({
    x: x(index),
    y: yJobs(item.jobs),
  }));

  const revenuePoints = chartData.map((item, index) => ({
    x: x(index),
    y: yRevenue(item.revenue),
  }));

  const jobsPath = toSharpPath(jobsPoints);
  const revenuePath = toSharpPath(revenuePoints);

  const jobsArea = buildAreaPath(jobsPath, jobsPoints, baselineY);
  const revenueArea = buildAreaPath(revenuePath, revenuePoints, baselineY);

  const activeIndex = hover?.index ?? null;
  const activeItem = activeIndex !== null ? chartData[activeIndex] : null;

  const handleMove = (clientX: number, box: DOMRect) => {
    const relativeX = clientX - box.left;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    chartData.forEach((_, index) => {
      const pointX = (x(index) / width) * box.width;
      const distance = Math.abs(pointX - relativeX);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setHover({
      index: nearestIndex,
      x: x(nearestIndex),
    });
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="overflow-hidden rounded-3xl border border-[#D0D5DD] bg-white p-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.14)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold tracking-tight text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white sm:text-2xl">
            Đơn sửa và doanh thu theo thời gian
          </h3>

          <p className="mt-1 max-w-xl text-sm font-semibold leading-6 text-[#475467] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
            Theo dõi xu hướng đơn sửa và doanh thu vận hành.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:justify-end">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => void loadPreset(preset.value)}
              className={[
                "h-10 rounded-xl border px-4 text-sm font-bold transition-colors",
                activePreset === preset.value
                  ? "border-[#FDBA74] bg-[#FFF1E8] text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F97316]/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#2A1A0A] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]"
                  : "border-[#D0D5DD] bg-white text-[#344054] hover:border-[#FDBA74] hover:text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B1527] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#D1D5DB] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white",
              ].join(" ")}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SummaryBox
          tone="cyan"
          label="Tổng đơn"
          value={formatNumber(totalJobs)}
          note="+12%"
        />

        <SummaryBox
          tone="orange"
          label="Tổng doanh thu"
          value={`${formatMillion(totalRevenue)} triệu`}
          note="+8.4%"
        />
      </div>

      <div className="relative mt-5 rounded-[24px] border border-[#E4E7EC] bg-[#F8FAFC] p-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1A2940] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B1729] sm:p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[280px] w-full sm:h-[340px]"
          preserveAspectRatio="none"
          onMouseMove={(event) =>
            handleMove(event.clientX, event.currentTarget.getBoundingClientRect())
          }
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="jobsLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>

            <linearGradient id="revenueLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FF8A1F" />
            </linearGradient>

            <linearGradient id="jobsArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <rect
            x={padLeft}
            y={padTop}
            width={innerWidth}
            height={innerHeight}
            rx="18"
            className="fill-white/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:fill-[#0F1B2D]"
          />

          {yTicks.map((tick) => {
            const gridY = padTop + innerHeight * tick;
            const jobValue = Math.round(roundedMaxJobs * (1 - tick));
            const revenueValue = roundedMaxRevenue * (1 - tick);

            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={gridY}
                  x2={padLeft + innerWidth}
                  y2={gridY}
                  stroke="rgba(148,163,184,0.24)"
                  strokeWidth="1"
                  strokeDasharray={tick === 1 ? "0" : "5 7"}
                />

                <text
                  x={padLeft - 14}
                  y={gridY + 4}
                  textAnchor="end"
                  className="text-[10px] font-bold"
                  style={{ fill: "var(--admin-subtle-text)" }}
                >
                  {jobValue}
                </text>

                <text
                  x={padLeft + innerWidth + 14}
                  y={gridY + 4}
                  textAnchor="start"
                  className="text-[10px] font-bold"
                  style={{ fill: "var(--admin-subtle-text)" }}
                >
                  {formatMillion(revenueValue)}
                </text>
              </g>
            );
          })}

          <text
            x={padLeft}
            y={22}
            className="text-[10px] font-extrabold"
            style={{ fill: "var(--admin-theme-text)" }}
          >
            Số đơn
          </text>

          <text
            x={padLeft + innerWidth}
            y={22}
            textAnchor="end"
            className="text-[10px] font-extrabold"
            style={{ fill: "var(--admin-theme-text)" }}
          >
            Doanh thu / triệu
          </text>

          <path d={jobsArea} fill="url(#jobsArea)" />
          <path d={revenueArea} fill="url(#revenueArea)" />

          <path
            d={jobsPath}
            fill="none"
            stroke="url(#jobsLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={revenuePath}
            fill="none"
            stroke="url(#revenueLine)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartData.map((item, index) => {
            const jobsX = x(index);
            const jobsY = yJobs(item.jobs);
            const revenueX = x(index);
            const revenueY = yRevenue(item.revenue);
            const isActive = activeIndex === index;
            const size = isActive ? 11 : 8.5;

            return (
              <g key={`${item.date}-${index}`}>
                <rect
                  x={jobsX - size / 2}
                  y={jobsY - size / 2}
                  width={size}
                  height={size}
                  rx="1.5"
                  fill="#22D3EE"
                  stroke="#0F172A"
                  strokeWidth="2"
                  transform={`rotate(45 ${jobsX} ${jobsY})`}
                />

                <rect
                  x={revenueX - size / 2}
                  y={revenueY - size / 2}
                  width={size}
                  height={size}
                  rx="1.5"
                  fill="#F97316"
                  stroke="#0F172A"
                  strokeWidth="2"
                  transform={`rotate(45 ${revenueX} ${revenueY})`}
                />

                <text
                  x={x(index)}
                  y={height - 12}
                  textAnchor="middle"
                  className="text-[10px] font-bold"
                  style={{ fill: "var(--admin-subtle-text)" }}
                >
                  {item.date}
                </text>
              </g>
            );
          })}

          {hover ? (
            <line
              x1={hover.x}
              y1={padTop}
              x2={hover.x}
              y2={baselineY}
              stroke="#64748B"
              strokeDasharray="4 5"
              opacity="0.45"
            />
          ) : null}
        </svg>

        {hover && activeItem ? (
          <div
            className="pointer-events-none absolute top-5 z-10 w-52 rounded-2xl border border-[#D0D5DD] bg-white p-3 text-xs text-[#344054] shadow-[0_20px_50px_-24px_rgba(15,23,42,0.28)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0F172A] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]"
            style={{
              left: `clamp(0.5rem, ${(hover.x / width) * 100}%, calc(100% - 13.5rem))`,
              transform: "translateX(-50%)",
            }}
          >
            <p className="text-sm font-extrabold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              {activeItem.date}
            </p>

            <div className="mt-2 space-y-1.5">
              <TooltipRow label="Đơn sửa" value={formatNumber(activeItem.jobs)} tone="cyan" />
              <TooltipRow
                label="Doanh thu"
                value={`${formatMillion(activeItem.revenue)} triệu`}
                tone="orange"
              />
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
          <LegendItem tone="cyan" label="Đơn sửa" />
          <LegendItem tone="orange" label="Doanh thu" />
        </div>
      </div>
    </section>
  );
}

function SummaryBox({
  tone,
  label,
  value,
  note,
}: {
  tone: "cyan" | "orange";
  label: string;
  value: string;
  note: string;
}) {
  const toneClass =
    tone === "cyan"
      ? {
        dot: "bg-[#06B6D4]",
        box: "border-[#A5F3FC] bg-[#ECFEFF] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#061A28]",
        value:
          "text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
      }
      : {
        dot: "bg-[#F97316]",
        box: "border-[#FED7AA] bg-[#FFF7ED] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F97316]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#23160B]",
        value:
          "text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
      };

  return (
    <div className={["rounded-2xl border px-4 py-3", toneClass.box].join(" ")}>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={[
            "h-3 w-3 shrink-0 rotate-45 rounded-[2px]",
            toneClass.dot,
          ].join(" ")}
        />

        <p className="min-w-0 truncate text-sm font-bold text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
          {label}:{" "}
          <span
            className={[
              "text-base font-extrabold",
              toneClass.value,
            ].join(" ")}
          >
            {value}
          </span>{" "}
          <span className={toneClass.value}>{note}</span>
        </p>
      </div>
    </div>
  );
}

function LegendItem({
  tone,
  label,
}: {
  tone: "cyan" | "orange";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={[
          "h-2.5 w-2.5 rotate-45",
          tone === "cyan" ? "bg-[#22D3EE]" : "bg-[#F97316]",
        ].join(" ")}
      />
      {label}
    </span>
  );
}

function TooltipRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "orange";
}) {
  return (
    <p className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 font-semibold">
        <span
          className={[
            "h-2 w-2 rotate-45",
            tone === "cyan" ? "bg-[#22D3EE]" : "bg-[#F97316]",
          ].join(" ")}
        />
        {label}
      </span>

      <span
        className={[
          "text-sm font-extrabold",
          tone === "cyan"
            ? "text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
            : "text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
        ].join(" ")}
      >
        {value}
      </span>
    </p>
  );
}
