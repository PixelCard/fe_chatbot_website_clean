import { Bot, CircleAlert, Wrench } from "lucide-react";

import type { RepairSession } from "../../types/repairSession.types";
import { truncateText } from "../../utils/repairSessionFormatters";
import {
  DetailRow,
  RepairSessionPanel,
} from "../common/RepairSessionUi";
import {
  detailFlagClass,
  type RepairSessionDetailView,
} from "./repairSessionDetail.utils";

export function RepairSessionOverview({
  session,
  view,
  onOpenAi,
}: {
  session: RepairSession;
  view: RepairSessionDetailView;
  onOpenAi: () => void;
}) {
  return (
    <div className="space-y-4">
      <RepairSessionPanel className="overflow-hidden">
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF8A1F]/10 text-[#C2410C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--admin-subtle-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]">
                Việc cần xử lý
              </p>
              <h3 className="mt-1 text-base font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                {view.nextTitle}
              </h3>
              <p className="mt-1 text-sm font-medium leading-6 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
                {view.nextDescription}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:max-w-[360px] lg:justify-end">
            {view.flags.map((flag) => (
              <span
                key={flag.label}
                className={[
                  "inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold",
                  detailFlagClass(flag.tone),
                ].join(" ")}
              >
                {flag.label}
              </span>
            ))}
          </div>
        </div>
      </RepairSessionPanel>

      <RepairSessionPanel title="Thông tin chính" icon={CircleAlert}>
        <div className="grid gap-x-8 p-4 lg:grid-cols-2">
          <div>
            <DetailRow label="Triệu chứng" value={session.symptom || "--"} multiline />
            <DetailRow label="Thiết bị" value={session.deviceType || "--"} />
            <DetailRow label="Model" value={session.device?.modelCode || "--"} />
            <DetailRow label="Cập nhật" value={view.updatedTime} />
          </div>

          <div className="border-t border-[var(--admin-soft-panel-border)] pt-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <DetailRow
              label="Khách hàng"
              value={session.customer.fullName || "--"}
            />
            <DetailRow
              label="SĐT"
              value={session.contactPhone || session.customer.phoneNumber || "--"}
            />
            <DetailRow
              label="Địa chỉ"
              value={session.address || "Chưa cập nhật"}
              multiline
            />
            <DetailRow
              label="Kỹ thuật viên"
              value={session.technician?.fullName || "Chưa phân công"}
            />
          </div>
        </div>
      </RepairSessionPanel>

      <RepairSessionPanel title="Tóm tắt AI" icon={Bot}>
        <div className="p-4">
          <p className="text-sm font-medium leading-7 text-[var(--admin-theme-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
            {truncateText(
              session.aiSummary ||
                "Chưa có tóm tắt AI. Nên để kỹ thuật viên kiểm tra trực tiếp khi chưa đủ thông tin.",
              260,
            )}
          </p>

          <button
            type="button"
            onClick={onOpenAi}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] px-4 text-sm font-semibold text-[var(--admin-strong-text)] transition hover:border-[#FF8A1F]/40 hover:text-[#C2410C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#06B6D4]/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-[#22D3EE]"
          >
            Xem đầy đủ nội dung AI
          </button>
        </div>
      </RepairSessionPanel>
    </div>
  );
}
