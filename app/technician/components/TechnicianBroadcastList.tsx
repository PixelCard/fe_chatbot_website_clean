"use client";

import { Loader2, RadioTower, User, MapPin } from "lucide-react";
import type { BroadcastJobItem } from "@/app/services/common";

type TechnicianBroadcastListProps = {
  jobs: BroadcastJobItem[];
  actionSessionId: number | null;
  actionType: string | null;
  onAccept: (job: BroadcastJobItem) => Promise<void>;
};

export default function TechnicianBroadcastList({
  jobs,
  actionSessionId,
  actionType,
  onAccept,
}: TechnicianBroadcastListProps) {
  return (
    <section className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Đơn đang phát sóng</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Chọn đơn phù hợp để nhận ngay từ hàng chờ điều phối.
          </p>
        </div>
        <div className="inline-flex h-10 items-center rounded-xl border border-[#1E2A3F] bg-[#07111F] px-3 text-sm font-medium text-[#22D3EE]">
          {jobs.length} đơn
        </div>
      </div>

      {!jobs.length ? (
        <div className="rounded-2xl border border-dashed border-[#1E2A3F] bg-[#07111F]/70 px-4 py-8 text-sm text-[#94A3B8]">
          Hiện chưa có đơn broadcast mới cho kỹ thuật viên.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {jobs.map((job) => {
            const isActing = actionSessionId === job.id && actionType === "accept";

            return (
              <article
                key={job.id}
                className="rounded-2xl border border-[#1E2A3F] bg-[#07111F]/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#06B6D4]/10 px-3 py-1 text-xs font-semibold text-[#22D3EE]">
                      <RadioTower className="h-3.5 w-3.5" />
                      Đơn #{job.id}
                    </div>
                    <h3 className="mt-3 truncate text-base font-semibold text-white">
                      {job.deviceType || "Thiết bị chưa xác định"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onAccept(job)}
                    disabled={isActing}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#06B6D4] px-4 text-sm font-semibold text-[#07111F] transition-colors duration-150 hover:bg-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isActing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Nhận đơn"}
                  </button>
                </div>

                <p className="mt-3 break-words text-sm leading-6 text-[#D1D5DB]">
                  {job.symptom || job.aiSummary || "Khách chưa mô tả chi tiết."}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-[#94A3B8]">
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]" />
                    <span className="min-w-0 truncate">
                      {job.contactName || job.user?.fullName || "Khách hàng"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]" />
                    <span className="min-w-0 break-words">
                      {job.address || "Chưa có địa chỉ hỗ trợ"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
