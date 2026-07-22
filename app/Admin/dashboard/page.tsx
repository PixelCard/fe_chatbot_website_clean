"use client";

import AdminShell from "./components/Action/AdminShell";
import DashboardHeader from "./components/Action/DashboardHeader";
import AiQualityCard from "./components/Card/AiQualityCard";
import JobStatusDonutChart from "./components/Chart/JobStatusDonutChart";
import KpiGrid from "./components/Card/KpiGrid";
import LiveJobsTable from "./components/Chart/LiveJobsTable";
import OnlineTechniciansTable from "./components/Chart/OnlineTechniciansTable";
import RecentActivityTimeline from "./components/Chart/RecentActivityTimeline";
import RevenueLineChart from "./components/Chart/RevenueLineChart";
import TopDeviceBarChart from "./components/Chart/TopDeviceBarChart";
import { useDashboardApi } from "./hooks/useDashboardApi";

/** Hiển thị dashboard admin với dữ liệu tổng hợp từ các route BE hiện có. */
export default function AdminDashBroad() {
  const {
    overview,
    jobsByStatus,
    onlineTechnicians,
    recentActivities,
    revenueSeries,
    topAiDevices,
    topRepairDevices,
    urgentJobs,
    aiQuality,
    isLoading,
    error,
  } = useDashboardApi();

  const errorMessage = error?.message ?? null;

  return (
    <AdminShell>
      <div className="space-y-4">
        <DashboardHeader data={overview} loading={isLoading} />
        <KpiGrid
          items={overview.kpis}
          loading={isLoading}
          error={errorMessage}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueLineChart
            data={revenueSeries}
            loading={isLoading}
            error={errorMessage}
          />
        </div>

        <JobStatusDonutChart
          data={jobsByStatus}
          loading={isLoading}
          error={errorMessage}
        />
      </section>

      <section className="w-full">
        <LiveJobsTable
          rows={urgentJobs}
          loading={isLoading}
          error={errorMessage}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[3fr_2fr]">
        <RecentActivityTimeline
          data={recentActivities}
          loading={isLoading}
          error={errorMessage}
        />

        <OnlineTechniciansTable
          rows={onlineTechnicians}
          loading={isLoading}
          error={errorMessage}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TopDeviceBarChart
          title="Top thiết bị tư vấn AI nhiều nhất"
          href="/admin/ai-consulting"
          data={topAiDevices}
          loading={isLoading}
          error={errorMessage}
        />

        <TopDeviceBarChart
          title="Top thiết bị tạo đơn sửa nhiều nhất"
          href="/admin/repair-sessions"
          data={topRepairDevices}
          loading={isLoading}
          error={errorMessage}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <AiQualityCard
            data={aiQuality}
            loading={isLoading}
            error={errorMessage}
          />
        </div>

        <div className="xl:col-span-2">
          <TopDeviceBarChart
            title="Top thiết bị cần bổ sung tri thức"
            href="/admin/rag-knowledge"
            data={topAiDevices}
            loading={isLoading}
            error={errorMessage}
          />
        </div>
      </section>
    </AdminShell>
  );
}
