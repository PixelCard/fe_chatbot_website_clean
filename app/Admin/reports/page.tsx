"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarDays,
  ExternalLink,
  RefreshCcw,
  Search,
  TrendingUp,
} from "lucide-react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import { dashboardService } from "../dashboard/services/dashboard.service";
import type {
  RevenueReportData,
  RevenueReportDetail,
  RevenueReportGroupBy,
  RevenueReportQuery,
} from "../dashboard/type/types";

type ReportState = {
  data: RevenueReportData | null;
  isLoading: boolean;
  error: string | null;
};

type DatePreset = "7d" | "30d" | "90d" | "month" | "year";
type ActivePreset = DatePreset | "custom";

const presets: Array<{ value: DatePreset; label: string }> = [
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "90d", label: "90 ngày" },
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

function getPresetRange(preset: DatePreset): RevenueReportQuery {
  const today = new Date();

  if (preset === "month") {
    return {
      from: toInputDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      to: toInputDate(today),
      groupBy: "day" as RevenueReportGroupBy,
    };
  }

  if (preset === "year") {
    return {
      from: toInputDate(new Date(today.getFullYear(), 0, 1)),
      to: toInputDate(today),
      groupBy: "month" as RevenueReportGroupBy,
    };
  }

  const days = preset === "7d" ? 6 : preset === "30d" ? 29 : 89;
  return {
    from: toInputDate(addDays(today, -days)),
    to: toInputDate(today),
    groupBy: preset === "90d" ? "week" : "day",
  };
}

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatDateTime(value?: string | null) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatCompactVnd(value: number) {
  if (value >= 1_000_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(value / 1_000_000_000)} tỷ`;
  }

  if (value >= 1_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(value / 1_000_000)} triệu`;
  }

  return formatVnd(value);
}

function getSafeError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Không tải được thống kê doanh thu.";
}

const initialQuery: RevenueReportQuery = getPresetRange("30d");

export default function AdminRevenueReportsPage() {
  const [activePreset, setActivePreset] = useState<ActivePreset>("30d");
  const [draft, setDraft] = useState<RevenueReportQuery>(initialQuery);
  const [query, setQuery] = useState<RevenueReportQuery>(initialQuery);
  const [state, setState] = useState<ReportState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const queryKey = useMemo(
    () => `${query.from ?? ""}|${query.to ?? ""}|${query.groupBy ?? "day"}`,
    [query],
  );

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await dashboardService.getRevenueReport(query);
        if (!cancelled) {
          setState({ data, isLoading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            isLoading: false,
            error: getSafeError(error),
          });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [query, queryKey]);

  const chartData = useMemo(() => state.data?.series ?? [], [state.data?.series]);
  const detailRows = state.data?.details ?? [];
  const summary = state.data?.summary ?? {
    totalRevenue: 0,
    totalJobs: 0,
    acceptedQuotes: 0,
    averageOrderValue: 0,
  };
  const peakRevenuePoint = useMemo(
    () =>
      chartData.reduce(
        (best, item) => (item.revenue > best.revenue ? item : best),
        chartData[0] ?? {
          key: "",
          label: "--",
          jobs: 0,
          acceptedQuotes: 0,
          revenue: 0,
        },
      ),
    [chartData],
  );
  const acceptedRate =
    summary.totalJobs > 0
      ? Math.round((summary.acceptedQuotes / summary.totalJobs) * 100)
      : 0;
  const activeGroupBy = state.data?.groupBy ?? draft.groupBy ?? "day";

  const applyPreset = (preset: DatePreset) => {
    const next = getPresetRange(preset);
    setActivePreset(preset);
    setDraft(next);
    setQuery(next);
  };

  const applyDraft = () => {
    setActivePreset("custom");
    setQuery(draft);
  };

  return (
    <AdminShell>
      <section className="w-full min-w-0 space-y-5 px-4 py-4 text-[var(--admin-theme-text)] sm:px-5 lg:px-6 xl:px-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#06B6D4]/25 bg-[#06B6D4]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
              <TrendingUp className="h-3.5 w-3.5" />
              Thống kê doanh thu
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--admin-strong-text)]">
              Doanh thu theo thời gian
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--admin-muted-text)]">
              Chọn khoảng thời gian để theo dõi doanh thu từ báo giá đã được chấp nhận và số ca phát sinh trong hệ thống.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setQuery({ ...query })}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-bold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
          >
            <RefreshCcw className="h-4 w-4" />
            Tải lại
          </button>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4">
            <div className="mb-3">
              <p className="text-sm font-black text-[var(--admin-strong-text)]">
                Khoảng thời gian tùy chọn
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--admin-muted-text)]">
                Chọn ngày bắt đầu, ngày kết thúc và cách gom dữ liệu.
              </p>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_180px_150px]">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[var(--admin-strong-text)]">
                  Từ ngày
                </span>
                <input
                  type="date"
                  value={draft.from ?? ""}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, from: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[var(--admin-strong-text)]">
                  Đến ngày
                </span>
                <input
                  type="date"
                  value={draft.to ?? ""}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, to: event.target.value }))
                  }
                  className={inputClassName}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[var(--admin-strong-text)]">
                  Gom dữ liệu
                </span>
                <select
                  value={draft.groupBy ?? "day"}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      groupBy: event.target.value as RevenueReportGroupBy,
                    }))
                  }
                  className={inputClassName}
                >
                  <option value="day">Theo ngày</option>
                  <option value="week">Theo tuần</option>
                  <option value="month">Theo tháng</option>
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={applyDraft}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105"
                >
                  <Search className="h-4 w-4" />
                  Áp dụng
                </button>
              </div>
            </div>

          </div>

          <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4">
            <p className="text-sm font-black text-[var(--admin-strong-text)]">
              Mốc nhanh
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--admin-muted-text)]">
              Chọn nhanh khoảng thống kê thường dùng.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => applyPreset(preset.value)}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition",
                    activePreset === preset.value
                      ? "border-[#FDBA74] bg-[#FFF7ED] text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B2233] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                      : "border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)] hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]",
                  ].join(" ")}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Tổng doanh thu" value={formatVnd(summary.totalRevenue)} tone="orange" />
          <KpiCard label="Số ca phát sinh" value={formatNumber(summary.totalJobs)} tone="cyan" />
          <KpiCard label="Báo giá chấp nhận" value={formatNumber(summary.acceptedQuotes)} tone="green" />
          <KpiCard label="Giá trị trung bình" value={formatVnd(summary.averageOrderValue)} tone="slate" />
        </div>

        <section className="overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)]">
          <div className="border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-4 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--admin-strong-text)]">
                Biểu đồ doanh thu
              </h2>
              <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
                {state.data
                  ? `${state.data.from} đến ${state.data.to}`
                  : "Đang chờ dữ liệu thống kê."}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--admin-muted-text)]">
              <CalendarDays className="h-4 w-4" />
              {activeGroupBy === "month"
                ? "Theo tháng"
                : activeGroupBy === "week"
                  ? "Theo tuần"
                  : "Theo ngày"}
            </div>
          </div>
          </div>

          {state.error ? (
            <div className="m-4 rounded-2xl border border-rose-300/70 bg-rose-50 p-4 text-sm font-semibold text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200">
              {state.error}
            </div>
          ) : null}

          {state.isLoading ? (
            <div className="m-4 h-[460px] animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]" />
          ) : chartData.length > 0 ? (
            <div className="space-y-4 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <InsightCard
                  label="Mốc doanh thu cao nhất"
                  value={peakRevenuePoint.label}
                  detail={formatVnd(peakRevenuePoint.revenue)}
                  tone="orange"
                />
                <InsightCard
                  label="Tỷ lệ báo giá chấp nhận"
                  value={`${acceptedRate}%`}
                  detail={`${formatNumber(summary.acceptedQuotes)} báo giá / ${formatNumber(summary.totalJobs)} ca`}
                  tone="green"
                />
                <InsightCard
                  label="Doanh thu trung bình"
                  value={formatCompactVnd(summary.averageOrderValue)}
                  detail="Tính trên báo giá đã chấp nhận"
                  tone="cyan"
                />
              </div>

              <div className="min-w-0 overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,0.98))] p-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(7,17,31,0.98))]">
                <div className="mb-3 flex justify-end px-1">
                  <span className="rounded-full border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 py-1 text-xs font-bold text-[var(--admin-muted-text)]">
                    Đỉnh: {peakRevenuePoint.label} · {formatCompactVnd(peakRevenuePoint.revenue)}
                  </span>
                </div>
                <div className="h-[430px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 22, right: 24, bottom: 16, left: 8 }}
                >
                  <defs>
                    <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FB923C" stopOpacity={0.96} />
                      <stop offset="100%" stopColor="#F97316" stopOpacity={0.42} />
                    </linearGradient>
                    <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FDBA74" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#FDBA74" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.25)" strokeDasharray="4 7" />
                  <XAxis
                    dataKey="label"
                    interval="preserveStartEnd"
                    minTickGap={18}
                    tick={{ fill: "var(--admin-muted-text)", fontSize: 12, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="revenue"
                    tickFormatter={(value) => `${Math.round(Number(value) / 1_000_000)}tr`}
                    tick={{ fill: "var(--admin-muted-text)", fontSize: 12, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    width={64}
                  />
                  <YAxis
                    yAxisId="jobs"
                    orientation="right"
                    allowDecimals={false}
                    tick={{ fill: "var(--admin-muted-text)", fontSize: 12, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    cursor={{
                      stroke: "#64748B",
                      strokeDasharray: "4 5",
                      strokeOpacity: 0.38,
                    }}
                    content={<RevenueTooltip />}
                  />
                  <Area
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    fill="url(#revenueAreaGradient)"
                    stroke="none"
                  />
                  <Bar
                    yAxisId="revenue"
                    dataKey="revenue"
                    name="Doanh thu"
                    fill="url(#revenueBarGradient)"
                    radius={[10, 10, 3, 3]}
                    maxBarSize={42}
                  />
                  <Line
                    yAxisId="jobs"
                    type="monotone"
                    dataKey="jobs"
                    name="Số ca"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    dot={{ r: 3.5, strokeWidth: 2, fill: "#06B6D4" }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    yAxisId="jobs"
                    type="monotone"
                    dataKey="acceptedQuotes"
                    name="Báo giá chấp nhận"
                    stroke="#22C55E"
                    strokeWidth={2.6}
                    dot={{ r: 3.25, strokeWidth: 2, fill: "#22C55E" }}
                    activeDot={{ r: 5.5, strokeWidth: 2 }}
                  />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <ChartLegend tone="orange" label="Doanh thu" />
                  <ChartLegend tone="cyan" label="Số ca" />
                  <ChartLegend tone="green" label="Báo giá chấp nhận" />
                </div>
              </div>
            </div>
          ) : (
            <div className="m-4 rounded-2xl border border-dashed border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-8 text-center text-sm font-semibold text-[var(--admin-muted-text)]">
              Không có dữ liệu doanh thu trong khoảng thời gian đã chọn.
            </div>
          )}
        </section>

        <RevenueDetailTable
          rows={detailRows}
          loading={state.isLoading}
          error={state.error}
          from={state.data?.from ?? draft.from ?? ""}
          to={state.data?.to ?? draft.to ?? ""}
        />
      </section>
    </AdminShell>
  );
}

function RevenueDetailTable({
  rows,
  loading,
  error,
  from,
  to,
}: {
  rows: RevenueReportDetail[];
  loading: boolean;
  error: string | null;
  from: string;
  to: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)]">
      <div className="flex flex-col gap-2 border-b border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--admin-strong-text)]">
            Chi tiết đơn hàng
          </h2>
          <p className="mt-1 text-sm font-semibold text-[var(--admin-muted-text)]">
            {from && to
              ? `Các ca sửa phát sinh từ ${from} đến ${to}`
              : "Danh sách ca sửa phát sinh trong khoảng đang chọn."}
          </p>
        </div>

        <span className="w-fit rounded-full border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[var(--admin-muted-text)]">
          {formatNumber(rows.length)} dòng
        </span>
      </div>

      {error ? (
        <div className="m-4 rounded-2xl border border-rose-300/70 bg-rose-50 p-4 text-sm font-semibold text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200">
          Không thể tải chi tiết doanh thu: {error}
        </div>
      ) : loading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl bg-[var(--admin-card-soft-bg)]"
            />
          ))}
        </div>
      ) : rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-auto">
            <thead>
              <tr className="border-b border-[var(--admin-card-border)] text-left text-[11px] font-black uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
                <th className="px-4 py-3">Phiên / khách hàng</th>
                <th className="px-4 py-3">Thiết bị</th>
                <th className="px-4 py-3">Thợ phụ trách</th>
                <th className="px-4 py-3">Báo giá</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Doanh thu</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--admin-card-border)]">
              {rows.map((row) => (
                <tr
                  key={row.sessionId}
                  className="text-sm text-[var(--admin-theme-text)] transition hover:bg-[var(--admin-row-hover)]"
                >
                  <td className="px-4 py-3">
                    <p className="font-bold text-[var(--admin-strong-text)]">
                      SE-{row.sessionId}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[var(--admin-muted-text)]">
                      {row.sessionStatus} · {row.customerName || "Khách hàng"} ·{" "}
                      {row.customerPhone || "Chưa có SĐT"}
                    </p>
                  </td>

                  <td className="max-w-[260px] px-4 py-3">
                    <p className="truncate font-bold text-[var(--admin-strong-text)]">
                      {row.deviceType || "Chưa rõ thiết bị"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold text-[var(--admin-muted-text)]">
                      {row.symptom || "Chưa có mô tả sự cố"}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-bold text-[var(--admin-strong-text)]">
                      {row.technicianName || "Chưa gán thợ"}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[var(--admin-muted-text)]">
                      {row.technicianPhone || "Chưa có SĐT"}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-bold text-[var(--admin-strong-text)]">
                      {row.acceptedQuoteCount > 0
                        ? `${formatNumber(row.acceptedQuoteCount)} đã chấp nhận`
                        : "Chưa có"}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[var(--admin-muted-text)]">
                      {row.latestQuoteTitle ||
                        (row.latestQuoteId ? `#${row.latestQuoteId}` : "Chưa phát sinh doanh thu")}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-[var(--admin-muted-text)]">
                    {formatDateTime(row.createdAt)}
                  </td>

                  <td className="px-4 py-3 text-right text-sm font-black text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]">
                    {formatVnd(row.acceptedRevenue)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/chats?sessionId=${row.sessionId}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-xs font-black text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)]"
                    >
                      Mở phiên
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="m-4 rounded-2xl border border-dashed border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-8 text-center text-sm font-semibold text-[var(--admin-muted-text)]">
          Chưa có đơn hàng trong khoảng thời gian này.
        </div>
      )}
    </section>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "orange" | "cyan" | "green" | "slate";
}) {
  const toneClass = {
    orange:
      "border-[#FDBA74]/70 bg-[#FFF7ED] text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F97316]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#23160B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
    cyan:
      "border-[#A5F3FC]/70 bg-[#ECFEFF] text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#061A28] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
    green:
      "border-[#BBF7D0]/70 bg-[#F0FDF4] text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22C55E]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#08210F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
    slate:
      "border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] text-[var(--admin-strong-text)]",
  }[tone];

  return (
    <article className={["rounded-2xl border p-4", toneClass].join(" ")}>
      <p className="text-sm font-bold opacity-80">{label}</p>
      <p className="mt-2 break-words text-2xl font-black tracking-tight">
        {value}
      </p>
    </article>
  );
}

function ChartLegend({
  tone,
  label,
}: {
  tone: "orange" | "cyan" | "green";
  label: string;
}) {
  const toneClass = {
    orange: "bg-[#F97316]",
    cyan: "bg-[#06B6D4]",
    green: "bg-[#22C55E]",
  }[tone];

  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-xs font-bold text-[var(--admin-strong-text)]">
      <span className={["h-2.5 w-2.5 rounded-full", toneClass].join(" ")} />
      {label}
    </span>
  );
}

function InsightCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "orange" | "cyan" | "green";
}) {
  const toneClass = {
    orange:
      "border-[#FDBA74]/70 bg-[#FFF7ED] text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F97316]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#23160B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FDBA74]",
    cyan:
      "border-[#A5F3FC]/70 bg-[#ECFEFF] text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#061A28] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
    green:
      "border-[#BBF7D0]/70 bg-[#F0FDF4] text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22C55E]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#08210F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
  }[tone];

  return (
    <article className={["rounded-2xl border p-4", toneClass].join(" ")}>
      <p className="text-xs font-black uppercase tracking-[0.12em] opacity-75">
        {label}
      </p>
      <p className="mt-3 break-words text-2xl font-black tracking-tight">
        {value}
      </p>
      <p className="mt-2 text-sm font-bold opacity-80">{detail}</p>
    </article>
  );
}

type TooltipEntry = {
  name?: unknown;
  value?: unknown;
  color?: string;
  dataKey?: unknown;
};

function RevenueTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: unknown;
  payload?: TooltipEntry[];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-56 rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-3 text-sm text-[var(--admin-theme-text)] shadow-[0_22px_60px_-32px_rgba(15,23,42,0.55)]">
      <p className="font-black text-[var(--admin-strong-text)]">
        {String(label ?? "--")}
      </p>
      <div className="mt-2 space-y-2">
        {payload
          .filter((entry) => String(entry.name ?? entry.dataKey ?? "") !== "revenue")
          .map((entry) => {
            const name = String(entry.name ?? entry.dataKey ?? "");
            const value = Number(entry.value ?? 0);
            const isRevenue = name === "Doanh thu";

            return (
              <div
                key={`${name}-${String(entry.dataKey)}`}
                className="flex items-center justify-between gap-4"
              >
                <span className="inline-flex items-center gap-2 font-bold text-[var(--admin-muted-text)]">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color ?? "#94A3B8" }}
                  />
                  {name}
                </span>
                <span className="font-black text-[var(--admin-strong-text)]">
                  {isRevenue ? formatVnd(value) : formatNumber(value)}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const inputClassName =
  "h-10 w-full rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-semibold text-[var(--admin-theme-text)] outline-none transition hover:border-[var(--admin-control-hover-border)] focus:border-[#06B6D4]/70 focus:ring-2 focus:ring-[var(--admin-focus-ring)]";
