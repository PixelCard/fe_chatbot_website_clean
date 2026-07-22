import { ActionButton, type CommonActionTone } from "@/app/components/common/action-button/ActionButton";
import {
  Lock,
  ShieldCheck,
  ShieldX,
  Unlock,
} from "lucide-react";
import type { ComponentType } from "react";
import type { AccountItem } from "../../types/account.types";

type Tone = CommonActionTone;

export default function AccountActionBar({
  account,
  loading = false,
  onToggleVerify,
  onToggleLock,
}: {
  account: AccountItem;
  loading?: boolean;
  onToggleVerify?: () => void;
  onToggleLock?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--admin-strong-text)]">
        {"Xác minh và bảo mật"}
      </h3>

      <p className="mt-1 text-sm leading-6 text-[var(--admin-muted-text)]">
        Quản lý trạng thái xác minh và quyền truy cập của tài khoản.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {account.isVerified ? (
          <ActionItem
            icon={ShieldX}
            label={"Hủy xác minh"}
            tone="warning"
            disabled={loading}
            onClick={onToggleVerify}
          />
        ) : (
          <ActionItem
            icon={ShieldCheck}
            label={"Xác minh"}
            tone="success"
            disabled={loading}
            onClick={onToggleVerify}
          />
        )}

        <ActionItem
          icon={account.isActive ? Lock : Unlock}
          label={account.isActive ? "Khóa tài khoản" : "Mở khóa"}
          tone={account.isActive ? "danger" : "success"}
          disabled={loading}
          onClick={onToggleLock}
        />
      </div>
    </section>
  );
}

function ActionItem({
  icon,
  label,
  tone,
  disabled,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  tone: Tone;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <ActionButton
      icon={icon}
      label={label}
      tone={tone}
      size="md"
      fullWidth
      disabled={disabled}
      onClick={onClick}
    />
  );
}
