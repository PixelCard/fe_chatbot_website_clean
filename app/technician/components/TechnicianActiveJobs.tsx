"use client";

import Link from "next/link";
import { Clock3, Loader2, MapPin, Phone, Wrench } from "lucide-react";
import type { ChatSessionItem } from "@/app/services/common";

type TechnicianActiveJobsProps = {
  jobs: ChatSessionItem[];
  actionSessionId: number | null;
  actionType: string | null;
  onStartMoving: (sessionId: number) => Promise<void>;
  onConfirmArrival: (sessionId: number) => Promise<void>;
  onStartRepair: (sessionId: number) => Promise<void>;
  onComplete: (sessionId: number) => Promise<void>;
  onCancel: (sessionId: number) => Promise<void>;
};

function ActionButton({
  label,
  tone,
  isLoading,
  onClick,
}: {
  label: string;
  tone: "primary" | "secondary" | "danger";
  isLoading: boolean;
  onClick: () => void;
}) {
  const toneClass =
    tone === "primary"
      ? "bg-[#06B6D4] text-[#07111F] hover:bg-[#22D3EE]"
      : tone === "danger"
        ? "border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
        : "border border-[#2A3A55] bg-[#101B2E] text-[#D1D5DB] hover:bg-[#122039]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70 ${toneClass}`}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </button>
  );
}

export default function TechnicianActiveJobs({
  jobs,
  actionSessionId,
  actionType,
  onStartMoving,
  onConfirmArrival,
  onStartRepair,
  onComplete,
  onCancel,
}: TechnicianActiveJobsProps) {
  return (
    <section className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Đơn đang xử lý</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Cập nhật trạng thái theo đúng tiến trình di chuyển và sửa chữa.
        </p>
      </div>

      {!jobs.length ? (
        <div className="rounded-2xl border border-dashed border-[#1E2A3F] bg-[#07111F]/70 px-4 py-8 text-sm text-[#94A3B8]">
          Bạn chưa có đơn nào đang xử lý.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isCurrent = actionSessionId === job.id;

            return (
              <article
                key={job.id}
                className="rounded-2xl border border-[#1E2A3F] bg-[#07111F]/80 p-4"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#4ADE80]">
                        <Wrench className="h-3.5 w-3.5" />
                        Đơn #{job.id}
                      </span>
                      <span className="inline-flex rounded-full border border-[#2A3A55] px-3 py-1 text-xs font-medium text-[#D1D5DB]">
                        {job.status}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">
                        {job.deviceType || "Thiết bị chưa xác định"}
                      </h3>
                      <p className="mt-2 break-words text-sm leading-6 text-[#D1D5DB]">
                        {job.symptom || job.aiSummary || "Khách chưa mô tả chi tiết."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-sm text-[#94A3B8] md:grid-cols-3">
                      <div className="flex items-start gap-2">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]" />
                        <span className="min-w-0 break-words">
                          {job.contactPhone || job.user?.fullName || "Chưa có liên hệ"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]" />
                        <span className="min-w-0 break-words">
                          {job.address || "Chưa có địa chỉ"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]" />
                        <span>{new Date(job.updatedAt).toLocaleString("vi-VN")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:max-w-[340px] xl:justify-end">
                    <Link
                      href={`/technician/chats/${job.id}`}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-[#2A3A55] bg-[#101B2E] px-4 text-sm font-medium text-[#D1D5DB] transition-colors duration-150 hover:bg-[#122039]"
                    >
                      Mở chat
                    </Link>

                    {job.status === "MATCHED" ? (
                      <ActionButton
                        label="Bắt đầu di chuyển"
                        tone="primary"
                        isLoading={isCurrent && actionType === "start-moving"}
                        onClick={() => void onStartMoving(job.id)}
                      />
                    ) : null}

                    {job.status === "EN_ROUTE" ? (
                      <ActionButton
                        label="Xác nhận đã đến"
                        tone="primary"
                        isLoading={isCurrent && actionType === "arrived"}
                        onClick={() => void onConfirmArrival(job.id)}
                      />
                    ) : null}

                    {job.status === "ARRIVED" ? (
                      <ActionButton
                        label="Bắt đầu sửa"
                        tone="primary"
                        isLoading={isCurrent && actionType === "start-repair"}
                        onClick={() => void onStartRepair(job.id)}
                      />
                    ) : null}

                    {job.status === "IN_PROGRESS" ? (
                      <ActionButton
                        label="Hoàn thành"
                        tone="secondary"
                        isLoading={isCurrent && actionType === "complete"}
                        onClick={() => void onComplete(job.id)}
                      />
                    ) : null}

                    <ActionButton
                      label="Hủy nhận đơn"
                      tone="danger"
                      isLoading={isCurrent && actionType === "cancel"}
                      onClick={() => void onCancel(job.id)}
                    />
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
