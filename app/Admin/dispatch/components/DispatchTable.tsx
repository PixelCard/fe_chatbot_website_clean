import type { ReactNode } from "react";
import { ChevronRight, Phone, Wrench } from "lucide-react";

import { AdminDetailAction } from "../../_shared/components/AdminDetailAction";
import type { ChatSession } from "../types/dispatch.types";
import { JOB_STATUS_VI } from "../types/dispatch.types";

type DispatchTableProps = {
  rows?: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
};

export function getStatusBadgeStyle(status: ChatSession["status"]) {
  switch (status) {
    case "AI_CONSULTING":
      return [
        "border-violet-200 bg-violet-50 text-violet-700 shadow-violet-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-violet-400/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-violet-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-violet-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");

    case "BROADCASTING":
      return [
        "border-amber-200 bg-amber-50 text-amber-700 shadow-amber-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");

    case "MATCHED":
      return [
        "border-sky-200 bg-sky-50 text-sky-700 shadow-sky-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-sky-400/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-sky-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-sky-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");

    case "EN_ROUTE":
      return [
        "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-indigo-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-indigo-400/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-indigo-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-indigo-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");

    case "ARRIVED":
      return [
        "border-teal-200 bg-teal-50 text-teal-700 shadow-teal-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-teal-400/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-teal-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-teal-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");

    case "IN_PROGRESS":
      return [
        "border-orange-200 bg-orange-50 text-orange-700 shadow-orange-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-orange-400/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-orange-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-orange-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");

    case "COMPLETED":
      return [
        "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-400/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");

    case "CANCELLED":
      return [
        "border-rose-200 bg-rose-50 text-rose-700 shadow-rose-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-400/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");

    default:
      return [
        "border-slate-200 bg-slate-50 text-slate-700 shadow-slate-100/70",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-slate-500/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-slate-400/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-slate-200",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none",
      ].join(" ");
  }
}

export default function DispatchTable({
  rows = [],
  onSelectSession,
}: DispatchTableProps) {
  if (!rows.length) {
    return (
      <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm shadow-slate-200/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#64748B]">
          <Wrench className="h-6 w-6" />
        </div>

        <h3 className="text-base font-bold text-slate-950 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
          Không tìm thấy yêu cầu
        </h3>

        <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
          Không có phiên yêu cầu sửa chữa nào phù hợp với bộ lọc hiện tại.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none">
      <div className="block lg:hidden">
        <div className="space-y-3 p-3">
          {rows.map((session) => (
            <MobileDispatchCard
              key={session.id}
              session={session}
              onSelect={() => onSelectSession(session)}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-slate-50/90 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F]">
              <tr className="border-b border-slate-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
                <HeaderCell className="w-[10%]">Mã đơn</HeaderCell>
                <HeaderCell className="w-[18%]">Khách hàng</HeaderCell>
                <HeaderCell className="w-[18%]">Số điện thoại</HeaderCell>
                <HeaderCell className="w-[16%]">Thiết bị</HeaderCell>
                <HeaderCell className="w-[20%]">Trạng thái</HeaderCell>
                <HeaderCell className="w-[18%]">Thao tác</HeaderCell>
              </tr>
            </thead>

            <tbody>
              {rows.map((session) => (
                <tr
                  key={session.id}
                  className="group border-b border-slate-200 bg-white transition-[background,box-shadow] duration-200 last:border-b-0 hover:bg-slate-50 hover:shadow-[inset_3px_0_0_#fb923c] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#122039] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:shadow-[inset_3px_0_0_#22d3ee]"
                >
                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => onSelectSession(session)}
                      className="text-base font-bold text-orange-700 transition hover:text-orange-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white"
                    >
                      #{session.id}
                    </button>
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <p className="mx-auto max-w-[180px] truncate text-[15px] font-bold text-slate-950 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                      {session.customerName || "Không rõ khách hàng"}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <div className="flex min-w-0 items-center justify-center gap-2 text-sm font-semibold text-slate-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
                      <Phone className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-orange-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-300" />
                      <span className="truncate">
                        {session.customerPhone || "--"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <div className="flex justify-center">
                      <DeviceBadge>{session.deviceType}</DeviceBadge>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <div className="flex justify-center">
                      <StatusBadge status={session.status} />
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <div className="flex justify-center">
                      <AdminDetailAction
                        onClick={() => onSelectSession(session)}
                        className="group min-w-[120px] px-4 tracking-[-0.01em]"
                        trailing={
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function HeaderCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={[
        "px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]",
        className,
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function DeviceBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 max-w-[140px] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 shadow-sm shadow-slate-100/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-slate-500/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-slate-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-slate-200 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none">
      <span className="truncate">{children}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: ChatSession["status"] }) {
  return (
    <span
      className={[
        "inline-flex h-8 min-w-[132px] max-w-[170px] items-center justify-center truncate whitespace-nowrap rounded-full border px-3 text-center text-sm font-bold shadow-sm",
        getStatusBadgeStyle(status),
      ].join(" ")}
    >
      {JOB_STATUS_VI[status]}
    </span>
  );
}

function MobileDispatchCard({
  session,
  onSelect,
}: {
  session: ChatSession;
  onSelect: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#122039]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-bold text-orange-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-cyan-200">
            #{session.id}
          </p>

          <p className="mt-1 truncate text-[15px] font-bold text-slate-950 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
            {session.customerName || "Không rõ khách hàng"}
          </p>

          <div className="mt-2">
            <DeviceBadge>{session.deviceType}</DeviceBadge>
          </div>
        </div>

        <StatusBadge status={session.status} />
      </div>

      <div className="mt-3 space-y-1.5 text-sm font-semibold text-slate-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
        <p className="truncate">SĐT: {session.customerPhone || "Chưa có"}</p>
      </div>

      <AdminDetailAction
        onClick={onSelect}
        label="Xem chi tiết"
        fullWidth
        size="md"
        className="mt-4"
        trailing={<ChevronRight className="h-4 w-4" />}
      />
    </article>
  );
}
