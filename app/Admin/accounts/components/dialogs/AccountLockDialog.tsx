"use client";

import { Lock, Unlock } from "lucide-react";
import type { AccountItem } from "../../types/account.types";
import AccountConfirmActionDialog from "../actions/AccountConfirmActionDialog";

type Props = {
  open: boolean;
  account: AccountItem | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function AccountLockDialog({
  open,
  account,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!account) return null;

  const isLocking = account.isActive;

  return (
    <AccountConfirmActionDialog
      open={open}
      title={isLocking ? "Khóa tài khoản" : "Mở khóa tài khoản"}
      description={
        isLocking
          ? "Tài khoản này sẽ không thể đăng nhập hoặc sử dụng chức năng hệ thống sau khi bị khóa."
          : "Tài khoản này sẽ được mở lại quyền truy cập hệ thống."
      }
      accountName={account.fullName}
      accountId={account.id}
      confirmLabel={isLocking ? "Khóa tài khoản" : "Mở khóa"}
      tone={isLocking ? "danger" : "success"}
      icon={isLocking ? Lock : Unlock}
      loading={loading}
      requireReason
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}