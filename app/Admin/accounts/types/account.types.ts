export type AccountRole = "USER" | "TECHNICIAN" | "ADMIN";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type RoleFilter = "ALL" | AccountRole;

export type StatusFilter = "ALL" | "ACTIVE" | "LOCKED";

export type VerifiedFilter = "ALL" | "VERIFIED" | "UNVERIFIED";

export type AccountSearchType =
    | "ALL"
    | "ID"
    | "FULL_NAME"
    | "PHONE_NUMBER"
    | "EMAIL";

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export type AccountItem = {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    gender?: Gender;
    role: AccountRole;

    avatarUrl: string | null;
    address: string;

    isActive: boolean;
    isVerified: boolean;
    isOnline: boolean;

    lastLogin: string;
    createdAt: string;

    devicesCount: number;
    repairJobsCount: number;
    reviewsCount: number;

    latitude?: number | null;
    longitude?: number | null;
};

export type AccountSummary = {
    total: number;
    active: number;
    locked: number;
    verified: number;
    unverified: number;
    online: number;
    customers: number;
    technicians: number;
    admins: number;
};

export type CreateAccountFormValues = {
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    gender: Gender;
    email: string;
    avatarUrl: string;
    address: string;
    role: AccountRole;
    isVerified: boolean;
    isActive: boolean;
    latitude: string;
    longitude: string;
};

export type CreateAccountPayload = {
    phoneNumber: string;
    password: string;
    fullName?: string | null;
    gender: Gender;
    email?: string | null;
    avatarUrl?: string | null;
    address?: string | null;
    role: AccountRole;
    isVerified: boolean;
    isActive: boolean;
    latitude?: number | null;
    longitude?: number | null;
};

export type UpdateAccountFormValues = {
    fullName: string;
    gender: Gender;
    email: string;
    avatarUrl: string;
    address: string;
    isVerified: boolean;
    isActive: boolean;
    latitude: string;
    longitude: string;
};

export type UpdateAccountPayload = {
    fullName?: string | null;
    gender?: Gender;
    email?: string | null;
    avatarUrl?: string | null;
    address?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    latitude?: number | null;
    longitude?: number | null;
};
export type AccountAuditAction =
    | "CREATE"
    | "UPDATE_PROFILE"
    | "LOCK"
    | "UNLOCK"
    | "VERIFY"
    | "UNVERIFY"
    | "CHANGE_ROLE"
    | "RESET_PASSWORD";

export type AccountAuditLogItem = {
    id: string;
    action: AccountAuditAction;
    actorName: string;
    actorRole: AccountRole;
    targetAccountId: string;
    targetAccountName: string;
    oldValue?: string | null;
    newValue?: string | null;
    reason: string;
    ipAddress?: string | null;
    createdAt: string;
};

export type AuditActionFilter = "ALL" | AccountAuditAction;

export type ResetPasswordFormValues = {
    password: string;
    confirmPassword: string;
    requireChangePassword: boolean;
    reason: string;
};

export type ChangeRoleFormValues = {
    role: AccountRole;
    reason: string;
};

export type ConfirmAccountActionValues = {
    reason: string;
};
