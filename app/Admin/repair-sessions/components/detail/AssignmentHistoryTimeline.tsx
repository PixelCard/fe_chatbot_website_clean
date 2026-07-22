import { ASSIGNMENT_ACTION_LABELS } from "../../constants/repairSession.constants";
import type { RepairSession } from "../../types/repairSession.types";
import { formatDateTime } from "../../utils/repairSessionFormatters";

export function AssignmentHistoryTimeline({
  session,
}: {
  session: RepairSession;
}) {
  if (session.assignmentHistory.length === 0) {
    return (
      <p className="text-sm font-medium text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
        Chưa có lịch sử điều phối.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {session.assignmentHistory.map((item) => (
        <li key={item.id} className="relative pl-5">
          <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-[#FF8A1F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22D3EE]" />
          <p className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
            {ASSIGNMENT_ACTION_LABELS[item.action]}
            {item.technicianName ? ` · ${item.technicianName}` : ""}
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
            {formatDateTime(item.createdAt)}
          </p>
          {item.reason ? (
            <p className="mt-1 text-sm font-medium leading-6 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
              {item.reason}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
