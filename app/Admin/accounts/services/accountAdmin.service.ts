import { apiClient, normalizeListResponse, type ApiListResult } from "@/app/services/apiClient";
import type {
  AccountItem,
  AccountSummary,
  ChangeRoleFormValues,
  CreateAccountPayload,
  ResetPasswordFormValues,
  UpdateAccountPayload,
} from "../types/account.types";

export type AccountListQuery = {
  keyword?: string;
  role?: string;
  status?: string;
  verified?: string;
  page?: number;
  pageSize?: number;
};

export type AccountActionPayload = {
  reason?: string;
};

export type VerifyAccountOtpPayload = {
  otp: string;
};

export type AccountListResult = ApiListResult<AccountItem> & {
  summary: AccountSummary;
};

const ACCOUNTS_BASE = "/api/admin/accounts";

export const accountAdminService = {
  async getAccounts(query?: AccountListQuery): Promise<AccountListResult> {
    const raw = await apiClient.get<unknown>(ACCOUNTS_BASE, query);
    const normalized = normalizeListResponse<AccountItem>(raw);
    const summary =
      typeof raw === "object" && raw !== null && "summary" in raw
        ? (raw as { summary: AccountSummary }).summary
        : {
            total: normalized.total,
            active: normalized.items.filter((item) => item.isActive).length,
            locked: normalized.items.filter((item) => !item.isActive).length,
            verified: normalized.items.filter((item) => item.isVerified).length,
            unverified: normalized.items.filter((item) => !item.isVerified).length,
            online: normalized.items.filter((item) => item.isOnline).length,
            customers: normalized.items.filter((item) => item.role === "USER").length,
            technicians: normalized.items.filter((item) => item.role === "TECHNICIAN").length,
            admins: normalized.items.filter((item) => item.role === "ADMIN").length,
          };

    return { ...normalized, summary };
  },

  getAccountById(accountId: string) {
    return apiClient.get<AccountItem>(`${ACCOUNTS_BASE}/${accountId}`);
  },

  createAccount(payload: CreateAccountPayload) {
    return apiClient.post<AccountItem>(ACCOUNTS_BASE, payload);
  },

  updateAccount(accountId: string, payload: UpdateAccountPayload) {
    return apiClient.patch<AccountItem>(`${ACCOUNTS_BASE}/${accountId}`, payload);
  },

  lockAccount(accountId: string, payload?: AccountActionPayload) {
    return apiClient.post<AccountItem>(
      `${ACCOUNTS_BASE}/${accountId}/lock`,
      payload,
    );
  },

  unlockAccount(accountId: string, payload?: AccountActionPayload) {
    return apiClient.post<AccountItem>(
      `${ACCOUNTS_BASE}/${accountId}/unlock`,
      payload,
    );
  },

  verifyAccount(accountId: string, payload?: AccountActionPayload) {
    return apiClient.post<AccountItem>(
      `${ACCOUNTS_BASE}/${accountId}/verify`,
      payload,
    );
  },

  requestAccountVerificationOtp(accountId: string) {
    return apiClient.post<{ message: string }>(
      `${ACCOUNTS_BASE}/${accountId}/verify/request-otp`,
    );
  },

  verifyAccountWithOtp(accountId: string, payload: VerifyAccountOtpPayload) {
    return apiClient.post<AccountItem>(
      `${ACCOUNTS_BASE}/${accountId}/verify/confirm-otp`,
      payload,
    );
  },

  unverifyAccount(accountId: string, payload?: AccountActionPayload) {
    return apiClient.post<AccountItem>(
      `${ACCOUNTS_BASE}/${accountId}/unverify`,
      payload,
    );
  },

  changeAccountRole(accountId: string, payload: ChangeRoleFormValues) {
    return apiClient.post<unknown>(`${ACCOUNTS_BASE}/${accountId}/role`, payload);
  },

  resetAccountPassword(accountId: string, payload: ResetPasswordFormValues) {
    return apiClient.post<unknown>(`${ACCOUNTS_BASE}/${accountId}/reset-password`, payload);
  },

  deleteAccount(accountId: string, payload?: AccountActionPayload) {
    const path = payload?.reason
      ? `${ACCOUNTS_BASE}/${accountId}?reason=${encodeURIComponent(payload.reason)}`
      : `${ACCOUNTS_BASE}/${accountId}`;

    return apiClient.delete<unknown>(path);
  },
};
