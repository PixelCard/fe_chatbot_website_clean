"use client";

import { AlertTriangle, Clock3, UserRound } from "lucide-react";

import { AdminStatusPill } from "@/app/Admin/_shared/components/AdminStatusPill";

import type { RepairSession } from "../../types/repairSession.types";
import {
  formatTime,
  truncateText,
} from "../../utils/repairSessionFormatters";
import { hasAssignedTechnician } from "../../utils/repairSessionRules";
import { RepairSessionStatusBadge } from "../common/RepairSessionBadges";

export function RepairSessionListItem({
  session,
  active,
  onClick,
}: {
  session: RepairSession;
  active: boolean;
  onClick: () => void;
}) {
  const hasTechnician = hasAssignedTechnician(session);
  const hasPhone = Boolean(session.contactPhone || session.customer.phoneNumber);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={[
        "group w-full rounded-2xl border px-4 py-3.5 text-left transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]",
        active
          ? "border-[#FF8A1F]/55 bg-[#FFF4E8] shadow-[inset_3px_0_0_#FF8A1F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22D3EE]/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#063044]/70 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-[inset_3px_0_0_#22D3EE]"
          : "border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] hover:border-[#FF8A1F]/40 hover:bg-[#FFF7ED] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#22D3EE]/45 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#122039]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-lg font-semibold leading-6 text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              #{session.id}
            </span>
            <span className="min-w-0 truncate text-base font-semibold leading-6 text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              {session.deviceType || "Thiết bị chưa xác định"}
            </span>
          </div>

          <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-6 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
            {truncateText(
              session.symptom || "Khách mô tả chưa rõ triệu chứng.",
              76,
            )}
          </p>

          <div className="mt-2 flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
            <UserRound className="h-4 w-4 shrink-0 text-[#EA580C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]" />
            <span className="min-w-0 truncate">
              {session.customer.fullName || "Không rõ khách hàng"}
            </span>
          </div>
        </div>

      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
          <RepairSessionStatusBadge
            status={session.status}
            variant="solid"
            className="max-w-full justify-center px-3"
          />
          <AdminStatusPill
            tone={hasTechnician ? "success" : "warning"}
            variant="solid"
          >
            {hasTechnician ? "Đã có thợ" : "Chưa có thợ"}
          </AdminStatusPill>

          {session.isDangerous ? (
            <AdminStatusPill tone="danger" variant="soft" icon={AlertTriangle}>
              Nguy hiểm
            </AdminStatusPill>
          ) : null}
        </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--admin-soft-panel-border)] pt-2.5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F]">
        <span className="min-w-0 truncate text-xs font-medium text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
          {hasPhone ? "Đã có SĐT" : "Thiếu SĐT"}
        </span>
        <time className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
          <Clock3 className="h-3.5 w-3.5" />
          {formatTime(session.updatedAt)}
        </time>
      </div>
    </button>
  );
}
