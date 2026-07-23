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
    <section className="rounded-2xl border border-[#CBD5E1] bg-white p-4 shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728]">
      <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
        {"Xác minh và bảo mật"}
      </h3>

      <p className="mt-1 text-sm font-medium leading-6 text-[#344054] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
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
      className={getStrongActionClass(tone)}
      labelClassName="font-extrabold"
      disabled={disabled}
      onClick={onClick}
    />
  );
}

function getStrongActionClass(tone: Tone) {
  if (tone === "success") {
    return "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:border-emerald-700 hover:bg-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:bg-emerald-700";
  }

  if (tone === "danger") {
    return "border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:border-rose-700 hover:bg-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:bg-rose-700";
  }

  if (tone === "warning") {
    return "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-500/20 hover:border-amber-600 hover:bg-amber-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#111827] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:bg-amber-400";
  }

  return "";
}
