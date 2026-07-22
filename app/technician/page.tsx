"use client";

import TechnicianActiveJobs from "./components/TechnicianActiveJobs";
import TechnicianBroadcastList from "./components/TechnicianBroadcastList";
import { useTechnicianJobs } from "./hooks/useTechnicianJobs";

export default function TechnicianPage() {
  const {
    broadcastJobs,
    activeJobs,
    isLoading,
    error,
    actionSessionId,
    actionType,
    summary,
    reload,
    acceptJob,
    startMoving,
    confirmArrival,
    startRepair,
    completeJob,
    cancelJob,
  } = useTechnicianJobs();

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            Broadcast
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary.broadcasting}</p>
          <p className="mt-1 text-sm text-[#94A3B8]">Đơn chờ kỹ thuật viên nhận</p>
        </div>
        <div className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            Active
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary.active}</p>
          <p className="mt-1 text-sm text-[#94A3B8]">Đơn bạn đang xử lý</p>
        </div>
        <div className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            En route
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary.enRoute}</p>
          <p className="mt-1 text-sm text-[#94A3B8]">Đơn đang trên đường di chuyển</p>
        </div>
      </section>

      {error ? (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm font-medium text-red-200">Không tải được dữ liệu đơn kỹ thuật.</p>
          <p className="mt-1 text-sm text-red-100/90">{error.message}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-4 inline-flex h-10 items-center rounded-xl border border-red-300/30 px-4 text-sm font-medium text-red-100 transition-colors duration-150 hover:bg-red-500/20"
          >
            Thử lại
          </button>
        </section>
      ) : null}

      {isLoading && !error ? (
        <section className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-4 text-sm text-[#94A3B8]">
          Đang tải bảng đơn kỹ thuật...
        </section>
      ) : null}

      {!isLoading ? (
        <>
          <TechnicianBroadcastList
            jobs={broadcastJobs}
            actionSessionId={actionSessionId}
            actionType={actionType}
            onAccept={acceptJob}
          />

          <TechnicianActiveJobs
            jobs={activeJobs}
            actionSessionId={actionSessionId}
            actionType={actionType}
            onStartMoving={startMoving}
            onConfirmArrival={confirmArrival}
            onStartRepair={startRepair}
            onComplete={completeJob}
            onCancel={cancelJob}
          />
        </>
      ) : null}
    </div>
  );
}
