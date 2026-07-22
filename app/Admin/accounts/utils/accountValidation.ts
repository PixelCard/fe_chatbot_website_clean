import type {
    AccountRole,
    ChangeRoleFormValues,
    ConfirmAccountActionValues,
    CreateAccountFormValues,
    Gender,
    ResetPasswordFormValues,
    UpdateAccountFormValues,
} from "../types/account.types";
import { ACCOUNT_FORM_LIMITS } from "../constants/account.constants";

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

const VIETNAM_PHONE_REGEX = /^(0|\+84)(\d{9,10})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;

const ACCOUNT_ROLES: AccountRole[] = ["USER", "TECHNICIAN", "ADMIN"];
const GENDERS: Gender[] = ["MALE", "FEMALE", "OTHER"];

export function validateCreateAccountForm(
    values: CreateAccountFormValues,
): ValidationErrors<CreateAccountFormValues> {
    const errors: ValidationErrors<CreateAccountFormValues> = {};

    const phoneNumber = values.phoneNumber.trim();
    const password = values.password;
    const confirmPassword = values.confirmPassword;
    const fullName = values.fullName.trim();
    const email = values.email.trim();
    const avatarUrl = values.avatarUrl.trim();
    const address = values.address.trim();

    //Phone number
    if (!phoneNumber) {
        errors.phoneNumber = "Vui lòng nhập số điện thoại.";
    } else if (
        phoneNumber.length < ACCOUNT_FORM_LIMITS.phoneMinLength ||
        phoneNumber.length > ACCOUNT_FORM_LIMITS.phoneMaxLength
    ) {
        errors.phoneNumber = "Số điện thoại phải từ 9 đến 15 ký tự.";
    } else if (!VIETNAM_PHONE_REGEX.test(phoneNumber)) {
        errors.phoneNumber = "Số điện thoại không đúng định dạng.";
    }

    //password
    if (!password) {
        errors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < ACCOUNT_FORM_LIMITS.passwordMinLength) {
        errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    } else if (!hasLetterAndNumber(password)) {
        errors.password = "Mật khẩu phải có cả chữ và số.";
    }

    //confirmPassword
    if (!confirmPassword) {
        errors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp.";
    }

    //fullName
    if (fullName.length > ACCOUNT_FORM_LIMITS.fullNameMaxLength) {
        errors.fullName = "Họ tên không được vượt quá 80 ký tự.";
    }

    //GENDERS
    if (!GENDERS.includes(values.gender)) {
        errors.gender = "Giới tính không hợp lệ.";
    }

    //email
    if (email) {
        if (email.length > ACCOUNT_FORM_LIMITS.emailMaxLength) {
            errors.email = "Email không được vượt quá 120 ký tự.";
        } else if (!EMAIL_REGEX.test(email)) {
            errors.email = "Email không đúng định dạng.";
        }
    }

    //avatarUrl
    if (avatarUrl) {
        if (avatarUrl.length > ACCOUNT_FORM_LIMITS.avatarUrlMaxLength) {
            errors.avatarUrl = "Avatar URL không được vượt quá 500 ký tự.";
        } else if (!URL_REGEX.test(avatarUrl)) {
            errors.avatarUrl = "Avatar URL phải bắt đầu bằng http:// hoặc https://.";
        }
    }

    //address
    if (address.length > ACCOUNT_FORM_LIMITS.addressMaxLength) {
        errors.address = "Địa chỉ không được vượt quá 255 ký tự.";
    }

    //ACCOUNT_ROLES
    if (!ACCOUNT_ROLES.includes(values.role)) {
        errors.role = "Vai trò không hợp lệ.";
    }

    validateLatitudeLongitude(values.latitude, values.longitude, errors);

    return errors;
}

export function validateUpdateAccountForm(
    values: UpdateAccountFormValues,
): ValidationErrors<UpdateAccountFormValues> {
    const errors: ValidationErrors<UpdateAccountFormValues> = {};

    const fullName = values.fullName.trim();
    const email = values.email.trim();
    const avatarUrl = values.avatarUrl.trim();
    const address = values.address.trim();

    if (fullName.length > ACCOUNT_FORM_LIMITS.fullNameMaxLength) {
        errors.fullName = "Họ tên không được vượt quá 80 ký tự.";
    }

    if (!GENDERS.includes(values.gender)) {
        errors.gender = "Giới tính không hợp lệ.";
    }

    if (email) {
        if (email.length > ACCOUNT_FORM_LIMITS.emailMaxLength) {
            errors.email = "Email không được vượt quá 120 ký tự.";
        } else if (!EMAIL_REGEX.test(email)) {
            errors.email = "Email không đúng định dạng.";
        }
    }

    if (avatarUrl) {
        if (avatarUrl.length > ACCOUNT_FORM_LIMITS.avatarUrlMaxLength) {
            errors.avatarUrl = "Avatar URL không được vượt quá 500 ký tự.";
        } else if (!URL_REGEX.test(avatarUrl)) {
            errors.avatarUrl = "Avatar URL phải bắt đầu bằng http:// hoặc https://.";
        }
    }

    if (address.length > ACCOUNT_FORM_LIMITS.addressMaxLength) {
        errors.address = "Địa chỉ không được vượt quá 255 ký tự.";
    }

    validateLatitudeLongitude(values.latitude, values.longitude, errors);

    return errors;
}

export function validateResetPasswordForm(
    values: ResetPasswordFormValues,
): ValidationErrors<ResetPasswordFormValues> {
    const errors: ValidationErrors<ResetPasswordFormValues> = {};

    if (!values.password) {
        errors.password = "Vui lòng nhập mật khẩu mới.";
    } else if (values.password.length < ACCOUNT_FORM_LIMITS.passwordMinLength) {
        errors.password = "Mật khẩu mới phải có ít nhất 8 ký tự.";
    } else if (!hasLetterAndNumber(values.password)) {
        errors.password = "Mật khẩu mới phải có cả chữ và số.";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp.";
    }

    validateReason(values.reason, errors);

    return errors;
}

export function validateChangeRoleForm(
    values: ChangeRoleFormValues,
    currentRole: AccountRole,
): ValidationErrors<ChangeRoleFormValues> {
    const errors: ValidationErrors<ChangeRoleFormValues> = {};

    if (!ACCOUNT_ROLES.includes(values.role)) {
        errors.role = "Vai trò không hợp lệ.";
    }

    if (values.role === currentRole) {
        errors.role = "Vai trò mới phải khác vai trò hiện tại.";
    }

    validateReason(values.reason, errors);

    return errors;
}

export function validateConfirmAccountAction(
    values: ConfirmAccountActionValues,
): ValidationErrors<ConfirmAccountActionValues> {
    const errors: ValidationErrors<ConfirmAccountActionValues> = {};

    validateReason(values.reason, errors);

    return errors;
}

export function hasValidationErrors<T extends object>(
    errors: ValidationErrors<T>,
) {
    return Object.keys(errors).length > 0;
}

function hasLetterAndNumber(value: string) {
    return /[A-Za-z]/.test(value) && /\d/.test(value);
}

function validateReason<T extends { reason?: string }>(
    reason: string,
    errors: ValidationErrors<T>,
) {
    const cleanedReason = reason.trim();

    if (!cleanedReason) {
        errors.reason = "Vui lòng nhập lý do.";
    } else if (cleanedReason.length < ACCOUNT_FORM_LIMITS.actionReasonMinLength) {
        errors.reason = "Lý do phải có ít nhất 5 ký tự.";
    } else if (
        cleanedReason.length > ACCOUNT_FORM_LIMITS.actionReasonMaxLength
    ) {
        errors.reason = "Lý do không được vượt quá 300 ký tự.";
    }
}

function validateLatitudeLongitude<T extends { latitude?: string; longitude?: string }>(
    latitude: string,
    longitude: string,
    errors: ValidationErrors<T>,
) {
    const hasLatitude = latitude.trim() !== "";
    const hasLongitude = longitude.trim() !== "";

    if (hasLatitude !== hasLongitude) {
        if (!hasLatitude) errors.latitude = "Vui lòng nhập latitude.";
        if (!hasLongitude) errors.longitude = "Vui lòng nhập longitude.";
        return;
    }

    if (hasLatitude && !isValidLatitude(latitude)) {
        errors.latitude = "Latitude phải nằm trong khoảng -90 đến 90.";
    }

    if (hasLongitude && !isValidLongitude(longitude)) {
        errors.longitude = "Longitude phải nằm trong khoảng -180 đến 180.";
    }
}

function isValidLatitude(value: string) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) && numberValue >= -90 && numberValue <= 90;
}

function isValidLongitude(value: string) {
    const numberValue = Number(value);
    return (
        Number.isFinite(numberValue) &&
        numberValue >= -180 &&
        numberValue <= 180
    );
}
