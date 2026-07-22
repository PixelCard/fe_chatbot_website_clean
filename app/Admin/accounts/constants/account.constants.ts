import type {
    AccountSearchType,
    AccountRole,
    Gender,
    RoleFilter,
    StatusFilter,
    VerifiedFilter,
} from "../types/account.types";

export const ACCOUNT_SEARCH_TYPE_OPTIONS: {
    value: AccountSearchType;
    label: string;
}[] = [
        { value: "ALL", label: "Tất cả" },
        { value: "ID", label: "ID" },
        { value: "FULL_NAME", label: "Tên" },
        { value: "PHONE_NUMBER", label: "Số điện thoại" },
        { value: "EMAIL", label: "Email" },
    ];

export const ACCOUNT_ROLE_OPTIONS: {
    value: AccountRole;
    label: string;
    description: string;
}[] = [
        {
            value: "USER",
            label: "Khách hàng",
            description: "Tài khoản khách đặt ca sửa chữa.",
        },
        {
            value: "TECHNICIAN",
            label: "Thợ sửa chữa",
            description: "Tài khoản kỹ thuật viên nhận và xử lý đơn.",
        },
        {
            value: "ADMIN",
            label: "Admin",
            description: "Tài khoản quản trị hệ thống.",
        },
    ];

export const ROLE_FILTER_OPTIONS: {
    value: RoleFilter;
    label: string;
}[] = [
        { value: "ALL", label: "Tất cả vai trò" },
        { value: "USER", label: "Khách hàng" },
        { value: "TECHNICIAN", label: "Thợ sửa chữa" },
        { value: "ADMIN", label: "Admin" },
    ];

export const STATUS_FILTER_OPTIONS: {
    value: StatusFilter;
    label: string;
}[] = [
        { value: "ALL", label: "Tất cả trạng thái" },
        { value: "ACTIVE", label: "Đang hoạt động" },
        { value: "LOCKED", label: "Bị khóa" },
    ];

export const VERIFIED_FILTER_OPTIONS: {
    value: VerifiedFilter;
    label: string;
}[] = [
        { value: "ALL", label: "Tất cả xác minh" },
        { value: "VERIFIED", label: "Đã xác minh" },
        { value: "UNVERIFIED", label: "Chưa xác minh" },
    ];

export const GENDER_OPTIONS: {
    value: Gender;
    label: string;
}[] = [
        { value: "MALE", label: "Nam" },
        { value: "FEMALE", label: "Nữ" },
        { value: "OTHER", label: "Khác" },
    ];

export const ACCOUNT_STATUS_LABEL = {
    active: "Hoạt động",
    locked: "Bị khóa",
    verified: "Đã xác minh",
    unverified: "Chưa xác minh",
    online: "Online",
    offline: "Offline",
} as const;

export const ACCOUNT_FORM_LIMITS = {
    phoneMinLength: 9,
    phoneMaxLength: 15,
    passwordMinLength: 8,
    fullNameMaxLength: 80,
    emailMaxLength: 120,
    addressMaxLength: 255,
    avatarUrlMaxLength: 500,
    actionReasonMinLength: 5,
    actionReasonMaxLength: 300,
} as const;

export const DEFAULT_CREATE_ACCOUNT_VALUES = {
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    gender: "OTHER" as Gender,
    email: "",
    avatarUrl: "",
    address: "",
    role: "USER" as AccountRole,
    isVerified: false,
    isActive: true,
    latitude: "",
    longitude: "",
};

export const DEFAULT_UPDATE_ACCOUNT_VALUES = {
    fullName: "",
    gender: "OTHER" as Gender,
    email: "",
    avatarUrl: "",
    address: "",
    isVerified: false,
    isActive: true,
    latitude: "",
    longitude: "",
};

export const SUSPICIOUS_REPAIR_JOB_THRESHOLD = 15;
