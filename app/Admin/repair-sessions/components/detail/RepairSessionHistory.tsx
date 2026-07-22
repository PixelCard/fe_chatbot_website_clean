import { Clock3, History } from "lucide-react";

import type { RepairSession } from "../../types/repairSession.types";
import { formatDateTime, truncateText } from "../../utils/repairSessionFormatters";
import { RepairSessionPanel } from "../common/RepairSessionUi";
import { AssignmentHistoryTimeline } from "./AssignmentHistoryTimeline";

export function RepairSessionHistory({
  session,
}: {
  session: RepairSession;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <RepairSessionPanel title="Lịch sử trạng thái" icon={Clock3}>
        <div className="space-y-3 p-4">
          {session.statusTimeline.length > 0 ? (
            session.statusTimeline.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 py-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                    {item.title}
                  </p>
                  <time className="shrink-0 text-xs font-medium text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                    {formatDateTime(item.createdAt)}
                  </time>
                </div>
                {item.description ? (
                  <p className="mt-1 text-sm font-medium leading-6 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                    {truncateText(item.description, 180)}
                  </p>
                ) : null}
              </article>
            ))
          ) : (
            <p className="text-sm font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
              Chưa có lịch sử trạng thái.
            </p>
          )}
        </div>
      </RepairSessionPanel>

      <RepairSessionPanel title="Lịch sử điều phối" icon={History}>
        <div className="p-4">
          <AssignmentHistoryTimeline session={session} />
        </div>
      </RepairSessionPanel>
    </div>
  );
}
