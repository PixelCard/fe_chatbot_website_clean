import { CalendarDays, MapPin, Phone } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import type { AccountItem } from "../../types/account.types";
import { hasAccountLocation } from "../../utils/accountFormatters";
import AccountActionBar from "../actions/AccountActionBar";
import AccountWarningCard from "./AccountWarningCard";

type Props = {
  account: AccountItem;
  actionLoading?: boolean;
  onToggleVerify?: () => void;
  onToggleLock?: () => void;
};

export default function AccountDetailPanel({
  account,
  actionLoading = false,
  onToggleVerify,
  onToggleLock,
}: Props) {
  return (
    <div className="bg-[var(--admin-card-bg)] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <AccountWarningCard account={account} />

          <DetailCard title="Thông tin cá nhân">
            <div className="space-y-3">
              <CompactInfoRow
                icon={Phone}
                label="Số điện thoại"
                value={getSafeText(account.phoneNumber)}
                emphasize
              />

              <CompactInfoRow
                icon={MapPin}
                label="Địa chỉ"
                value={getSafeText(account.address)}
                multiline
              />
            </div>
          </DetailCard>

          <DetailCard title="Hồ sơ theo vai trò">
            <div className="space-y-3">
              <CompactInfoRow
                icon={CalendarDays}
                label={getRoleDateLabel(account.role)}
                value={getSafeText(account.createdAt)}
              />

              {account.role === "USER" && hasAccountLocation(account) ? (
                <CompactInfoRow
                  icon={MapPin}
                  label="Vị trí GPS"
                  value={`${account.latitude}, ${account.longitude}`}
                  multiline
                />
              ) : null}

              {account.role === "TECHNICIAN" ? (
                <>
                  {account.repairJobsCount > 0 ? (
                    <CompactInfoRow
                      icon={CalendarDays}
                      label="Ca sửa đã ghi nhận"
                      value={String(account.repairJobsCount)}
                    />
                  ) : null}

                  {account.reviewsCount > 0 ? (
                    <CompactInfoRow
                      icon={CalendarDays}
                      label="Đánh giá đã ghi nhận"
                      value={String(account.reviewsCount)}
                    />
                  ) : null}
                </>
              ) : null}
            </div>
          </DetailCard>
        </div>

        <div className="space-y-4">
          <StatusCard account={account} />
          <AccountActionBar
            account={account}
            loading={actionLoading}
            onToggleVerify={onToggleVerify}
            onToggleLock={onToggleLock}
          />
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#D0D5DD] bg-[#F8FAFC] p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
      <h3 className="text-base font-black uppercase tracking-[0.08em] text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
        {title}
      </h3>

      <div className="mt-3">{children}</div>
    </section>
  );
}

function StatusCard({ account }: { account: AccountItem }) {
  return (
    <DetailCard title="Trạng thái tài khoản">
      <div className="space-y-3">
        <div className="rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
          <div className="min-w-0">
            <p className={labelClass}>Tình trạng tài khoản</p>

            <p className="mt-1 text-base font-extrabold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
              {account.isActive ? "Đang hoạt động" : "Đang bị khóa"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatusRow
            label="Xác minh"
            value={account.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            valueClass={
              account.isVerified
                ? "text-[#0F766E] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                : "text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
            }
          />

          <StatusRow
            label="Trạng thái truy cập"
            value={account.isOnline ? "Online" : "Offline"}
            valueClass={
              account.isOnline
                ? "text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
                : "text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]"
            }
          />
        </div>
      </div>
    </DetailCard>
  );
}

function CompactInfoRow({
  icon: Icon,
  label,
  value,
  emphasize = false,
  multiline = false,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  emphasize?: boolean;
  multiline?: boolean;
}) {
  const isMissing = value === "Chưa cập nhật";

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D0D5DD] bg-[#F8FAFC] text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className={labelClass}>{label}</p>

        <p
          title={value}
          className={[
            "mt-1 text-sm leading-6",
            emphasize
              ? "font-extrabold text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
              : "font-bold text-[#1F2937] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#E5E7EB]",
            isMissing
              ? "italic text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]"
              : "",
            multiline ? "break-words [overflow-wrap:anywhere]" : "truncate",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  valueClass,
  multiline = false,
}: {
  label: string;
  value: string;
  valueClass: string;
  multiline?: boolean;
}) {
  const isMissing = value === "Chưa cập nhật";

  return (
    <div className="rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#101B2E]">
      <p className={labelClass}>{label}</p>

      <p
        title={value}
        className={[
          "mt-1 text-base font-extrabold leading-6",
          valueClass,
          isMissing
            ? "italic text-[#667085] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]"
            : "",
          multiline ? "break-words [overflow-wrap:anywhere]" : "truncate",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function getSafeText(value?: string | null) {
  if (!value) return "Chưa cập nhật";
  return value.trim() ? value : "Chưa cập nhật";
}

function getRoleDateLabel(role: AccountItem["role"]) {
  if (role === "TECHNICIAN") return "Ngày tham gia";
  return "Ngày tạo tài khoản";
}

const labelClass =
  "text-sm font-semibold text-[#475467] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]";
