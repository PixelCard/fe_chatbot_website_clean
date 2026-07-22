"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AdminShell from "../../../dashboard/components/Action/AdminShell";
import AccountUpdateForm from "../../components/forms/AccountUpdateForm";
import type { AccountItem } from "../../types/account.types";
import { accountAdminService } from "../../services";

export default function EditAccountPage() {
  const params = useParams<{ id: string }>();
  const accountId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [account, setAccount] = useState<AccountItem | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(accountId));
  const [error, setError] = useState<string | null>(
    accountId ? null : "Thiếu mã tài khoản.",
  );

  useEffect(() => {
    if (!accountId) {
      return;
    }

    let isMounted = true;

    const loadAccount = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextAccount = await accountAdminService.getAccountById(accountId);
        if (isMounted) {
          setAccount(nextAccount);
        }
      } catch (nextError) {
        if (isMounted) {
          const message =
            nextError instanceof Error
              ? nextError.message
              : "Không thể tải tài khoản.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAccount();

    return () => {
      isMounted = false;
    };
  }, [accountId]);

  return (
    <AdminShell>
      <main className="min-w-0">
        <div className="w-full min-w-0 space-y-5 px-4 py-4 sm:px-5 lg:px-6 xl:px-8">
          {error ? (
            <section className="rounded-2xl border border-red-500/30 bg-red-50 p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-red-500/10">
              <p className="text-sm font-medium text-red-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-red-100">{error}</p>
            </section>
          ) : null}

          {isLoading ? (
            <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] p-4 text-sm font-medium text-[var(--admin-muted-text)]">
              Đang tải dữ liệu tài khoản...
            </section>
          ) : null}

          {!isLoading && !error && account ? <AccountUpdateForm account={account} /> : null}
        </div>
      </main>
    </AdminShell>
  );
}
