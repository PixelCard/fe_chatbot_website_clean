import type { AccountItem } from "../../types/account.types";

export default function AccountStatusCard({
  account,
}: {
  account: AccountItem;
}) {
  return (
    <div className="rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-3">
      {/* Header */}
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-muted-text)]">
          Trạng thái
        </p>
        <span
          className={[
            "rounded-full border px-2.5 py-0.5 text-xs font-bold",
            account.isActive
              ? "border-[#22C55E]/55 bg-[#DCFCE7] text-[#166534] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22C55E]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]"
              : "border-[#EF4444]/50 bg-[#FEE2E2] text-[#991B1B] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#EF4444]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#EF4444]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]",
          ].join(" ")}
        >
          {account.isActive ? "Hoạt động" : "Bị khóa"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatusBox
          label="Online"
          value={account.isOnline ? "Online" : "Offline"}
          valueClass={account.isOnline ? "text-[#166534] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]" : "text-[var(--admin-theme-text)]"}
        />
        <StatusBox
          label="Xác minh"
          value={account.isVerified ? "Đã xác minh" : "Chưa xác minh"}
          valueClass={account.isVerified ? "text-cyan-800 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]" : "text-amber-800 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"}
        />
        <div className="col-span-2">
          <StatusBox
            label="Đăng nhập cuối"
            value={account.lastLogin}
          valueClass="text-[var(--admin-strong-text)]"
          />
        </div>
      </div>
    </div>
  );
}

function StatusBox({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] p-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--admin-muted-text)]">
        {label}
      </p>
      <p className={["mt-1 text-sm font-semibold", valueClass].join(" ")}>
        {value}
      </p>
    </div>
  );
}
