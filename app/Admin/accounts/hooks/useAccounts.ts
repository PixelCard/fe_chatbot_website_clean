"use client";

import { useCallback, useEffect, useState } from "react";
import {
  accountAdminService,
  type AccountActionPayload,
  type AccountListQuery,
  type VerifyAccountOtpPayload,
} from "../services/accountAdmin.service";
import type {
  AccountItem,
  AccountSummary,
  ChangeRoleFormValues,
  CreateAccountPayload,
  ResetPasswordFormValues,
  UpdateAccountPayload,
} from "../types/account.types";
import type { ApiError } from "@/app/services/apiClient";

type UseAccountsState = {
  items: AccountItem[];
  total: number;
  summary: AccountSummary;
  isLoading: boolean;
  error: ApiError | null;
};

export function useAccounts(initialQuery?: AccountListQuery) {
  const [query, setQuery] = useState<AccountListQuery | undefined>(initialQuery);
  const [isMutating, setIsMutating] = useState(false);
  const [state, setState] = useState<UseAccountsState>({
    items: [],
    total: 0,
    summary: {
      total: 0,
      active: 0,
      locked: 0,
      verified: 0,
      unverified: 0,
      online: 0,
      customers: 0,
      technicians: 0,
      admins: 0,
    },
    isLoading: true,
    error: null,
  });

  /** Hàm tải danh sách tài khoản từ API admin. */
  const fetchAccounts = useCallback(async (nextQuery?: AccountListQuery) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await accountAdminService.getAccounts(nextQuery ?? query);
      setState({
        items: result.items,
        total: result.total,
        summary: result.summary,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false, error: error as ApiError }));
    }
  }, [query]);

  useEffect(() => {
    void fetchAccounts(initialQuery);
  }, [fetchAccounts, initialQuery]);

  /** Hàm chạy mutation dùng chung: gọi API rồi tải lại danh sách. */
  const runMutation = useCallback(async <T,>(action: () => Promise<T>) => {
    setIsMutating(true);
    try {
      const result = await action();
      await fetchAccounts(query);
      return result;
    } finally {
      setIsMutating(false);
    }
  }, [fetchAccounts, query]);

  /** Cập nhật bộ lọc/phân trang và tải lại dữ liệu. */
  const updateQuery = useCallback((nextQuery: AccountListQuery) => {
    setQuery(nextQuery);
    void fetchAccounts(nextQuery);
  }, [fetchAccounts]);

  /** Tải lại danh sách theo query hiện tại. */
  const refetch = useCallback(() => fetchAccounts(query), [fetchAccounts, query]);

  /** Lấy chi tiết tài khoản theo id. */
  const getById = accountAdminService.getAccountById;

  /** Tạo tài khoản mới rồi tự động refresh danh sách. */
  const createAccount = useCallback(
    (payload: CreateAccountPayload) =>
      runMutation(() => accountAdminService.createAccount(payload)),
    [runMutation],
  );

  /** Cập nhật thông tin tài khoản rồi refresh danh sách. */
  const updateAccount = useCallback(
    (accountId: string, payload: UpdateAccountPayload) =>
      runMutation(() => accountAdminService.updateAccount(accountId, payload)),
    [runMutation],
  );

  /** Khóa tài khoản rồi refresh danh sách. */
  const lockAccount = useCallback(
    (accountId: string, payload?: AccountActionPayload) =>
      runMutation(() => accountAdminService.lockAccount(accountId, payload)),
    [runMutation],
  );

  /** Mở khóa tài khoản rồi refresh danh sách. */
  const unlockAccount = useCallback(
    (accountId: string, payload?: AccountActionPayload) =>
      runMutation(() => accountAdminService.unlockAccount(accountId, payload)),
    [runMutation],
  );

  /** Xác minh tài khoản rồi refresh danh sách. */
  const verifyAccount = useCallback(
    (accountId: string, payload?: AccountActionPayload) =>
      runMutation(() => accountAdminService.verifyAccount(accountId, payload)),
    [runMutation],
  );

  const requestAccountVerificationOtp = useCallback(
    (accountId: string) =>
      runMutation(() => accountAdminService.requestAccountVerificationOtp(accountId)),
    [runMutation],
  );

  const verifyAccountWithOtp = useCallback(
    (accountId: string, payload: VerifyAccountOtpPayload) =>
      runMutation(() => accountAdminService.verifyAccountWithOtp(accountId, payload)),
    [runMutation],
  );

  /** Hủy xác minh tài khoản rồi refresh danh sách. */
  const unverifyAccount = useCallback(
    (accountId: string, payload?: AccountActionPayload) =>
      runMutation(() => accountAdminService.unverifyAccount(accountId, payload)),
    [runMutation],
  );

  /** Đổi vai trò tài khoản rồi refresh danh sách. */
  const changeAccountRole = useCallback(
    (accountId: string, payload: ChangeRoleFormValues) =>
      runMutation(() => accountAdminService.changeAccountRole(accountId, payload)),
    [runMutation],
  );

  /** Đặt lại mật khẩu tài khoản rồi refresh danh sách. */
  const resetAccountPassword = useCallback(
    (accountId: string, payload: ResetPasswordFormValues) =>
      runMutation(() => accountAdminService.resetAccountPassword(accountId, payload)),
    [runMutation],
  );

  /** Xóa tài khoản rồi refresh danh sách. */
  const deleteAccount = useCallback(
    (accountId: string, payload?: AccountActionPayload) =>
      runMutation(() => accountAdminService.deleteAccount(accountId, payload)),
    [runMutation],
  );

  return {
    ...state,
    query,
    isMutating,
    refetch,
    updateQuery,
    getById,
    createAccount,
    updateAccount,
    lockAccount,
    unlockAccount,
    verifyAccount,
    requestAccountVerificationOtp,
    verifyAccountWithOtp,
    unverifyAccount,
    changeAccountRole,
    resetAccountPassword,
    deleteAccount,
  };
}
