"use client";

import { useState, type ChangeEvent } from "react";
import {
  Camera,
  ChevronDown,
  Loader2,
  MapPin,
  RotateCcw,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";

import { GENDER_OPTIONS } from "../../constants/account.constants";
import { useAccounts } from "../../hooks";
import { useUploadApi } from "@/app/hooks/common/useUploadApi";

import type {
  AccountItem,
  Gender,
  UpdateAccountFormValues,
  ValidationErrors,
} from "../../types/account.types";
import {
  hasValidationErrors,
  validateUpdateAccountForm,
} from "../../utils/accountValidation";

type Props = {
  account: AccountItem;
};

function toUpdateValues(account: AccountItem): UpdateAccountFormValues {
  return {
    fullName: account.fullName ?? "",
    gender: account.gender ?? "OTHER",
    email: account.email ?? "",
    avatarUrl: account.avatarUrl ?? "",
    address: account.address ?? "",
    isVerified: account.isVerified,
    isActive: account.isActive,
    latitude: account.latitude != null ? String(account.latitude) : "",
    longitude: account.longitude != null ? String(account.longitude) : "",
  };
}

export default function AccountUpdateForm({ account }: Props) {
  const { updateAccount, isMutating } = useAccounts();
  const {
    uploadMedia,
    isSubmitting: isUploadingAvatar,
    error: uploadError,
    clearError: clearUploadError,
  } = useUploadApi();
  const [values, setValues] = useState<UpdateAccountFormValues>(
    toUpdateValues(account),
  );
  const [errors, setErrors] = useState<ValidationErrors<UpdateAccountFormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const isBusy = submitting || isMutating || isUploadingAvatar;
  const hasLocation =
    values.latitude.trim().length > 0 || values.longitude.trim().length > 0;

  const updateField = <K extends keyof UpdateAccountFormValues>(
    key: K,
    value: UpdateAccountFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  };

  const resetForm = () => {
    setValues(toUpdateValues(account));
    setErrors({});
    setAvatarUploadError(null);
    setSubmitError(null);
    setSavedMessage(null);
    clearUploadError();
  };

  const handleAvatarFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setAvatarUploadError(null);
    setSubmitError(null);
    setSavedMessage(null);
    clearUploadError();

    if (!file.type.startsWith("image/")) {
      setAvatarUploadError("Vui lòng chọn file ảnh hợp lệ.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarUploadError("Ảnh đại diện phải nhỏ hơn hoặc bằng 5MB.");
      return;
    }

    try {
      const result = await uploadMedia(file);
      updateField("avatarUrl", result.url.trim());
    } catch {
      // Upload error state is handled by useUploadApi.
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateUpdateAccountForm(values);
    setErrors(nextErrors);
    setSubmitError(null);
    setSavedMessage(null);

    if (hasValidationErrors(nextErrors)) return;

    setSubmitting(true);

    try {
      await updateAccount(account.id, {
        fullName: values.fullName.trim() || null,
        gender: values.gender,
        email: values.email.trim() || null,
        avatarUrl: values.avatarUrl.trim() || null,
        address: values.address.trim() || null,
        isVerified: values.isVerified,
        isActive: values.isActive,
        latitude: values.latitude.trim() ? Number(values.latitude) : null,
        longitude: values.longitude.trim() ? Number(values.longitude) : null,
      });

      setSavedMessage("Đã lưu thay đổi tài khoản.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể cập nhật tài khoản.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] shadow-[0_18px_60px_-45px_rgba(15,23,42,0.35)]">
          <div className="border-b border-[var(--admin-soft-panel-border)] bg-[linear-gradient(135deg,rgba(255,247,237,0.92),rgba(236,254,255,0.72))] p-5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(8,47,73,0.42))]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] text-lg font-black text-[var(--admin-strong-text)] shadow-sm">
                  {values.avatarUrl ? (
                    <img
                      src={values.avatarUrl}
                      alt="Ảnh đại diện"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(values.fullName || account.fullName)
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
                    Cập nhật tài khoản
                  </p>
                  <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-[var(--admin-strong-text)]">
                    {values.fullName.trim() || account.fullName || `Tài khoản #${account.id}`}
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[var(--admin-muted-text)]">
                    #{account.id} · {getRoleLabel(account.role)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusPill active={values.isActive} label={values.isActive ? "Hoạt động" : "Bị khóa"} />
                <StatusPill active={values.isVerified} label={values.isVerified ? "Đã xác minh" : "Chưa xác minh"} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <FormField label="Họ tên" error={errors.fullName}>
                <input
                  value={values.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  placeholder="Nhập họ tên"
                  className={inputClass(Boolean(errors.fullName))}
                />
              </FormField>
            </div>

            <div className="xl:col-span-4">
              <FormField label="Giới tính" required error={errors.gender}>
                <select
                  value={values.gender}
                  onChange={(event) =>
                    updateField("gender", event.target.value as Gender)
                  }
                  className={inputClass(Boolean(errors.gender))}
                >
                  {GENDER_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="xl:col-span-4">
              <FormField label="Email" error={errors.email}>
                <input
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="name@example.com"
                  className={inputClass(Boolean(errors.email))}
                />
              </FormField>
            </div>

            <div className="xl:col-span-8">
              <FormField
                label="Ảnh đại diện"
                error={
                  errors.avatarUrl ||
                  avatarUploadError ||
                  uploadError?.message
                }
              >
                <div className="flex flex-col gap-4 rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-4 sm:flex-row sm:items-center">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] text-xl font-bold text-[var(--admin-strong-text)] shadow-sm">
                    {values.avatarUrl ? (
                      <img
                        src={values.avatarUrl}
                        alt="Ảnh đại diện"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(values.fullName || account.fullName)
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--admin-strong-text)]">
                      {values.avatarUrl ? "Đã chọn ảnh đại diện" : "Chưa có ảnh đại diện"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--admin-muted-text)]">
                      Chọn file ảnh từ máy. Hỗ trợ ảnh tối đa 5MB.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-3 text-sm font-bold text-[#B45309] transition hover:border-[#F59E0B]/60 hover:bg-[#F59E0B]/15 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
                        {isUploadingAvatar ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                        {isUploadingAvatar ? "Đang tải..." : "Chọn ảnh"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          disabled={isBusy}
                          className="hidden"
                        />
                      </label>

                      {values.avatarUrl ? (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => updateField("avatarUrl", "")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-bold text-[var(--admin-muted-text)] transition hover:border-red-400/50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          Xóa ảnh
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </FormField>
            </div>

            <div className="xl:col-span-12">
              <FormField label="Địa chỉ" error={errors.address}>
                <textarea
                  value={values.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  rows={3}
                  placeholder="Nhập địa chỉ người dùng"
                  className={[
                    inputClass(Boolean(errors.address)),
                    "min-h-24 resize-none py-3",
                  ].join(" ")}
                />
              </FormField>
            </div>
          </div>

          <details className="mx-4 mb-4 rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] sm:mx-5 sm:mb-5" open={hasLocation}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#FBBF24]">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[var(--admin-strong-text)]">
                    Vị trí GPS
                  </span>
                  <span className="block text-xs text-[var(--admin-muted-text)]">
                    Không bắt buộc. Chỉ nhập khi cần lưu vị trí gần nhất.
                  </span>
                </span>
              </span>

              <ChevronDown className="h-4 w-4 text-[var(--admin-muted-text)]" />
            </summary>

            <div className="grid grid-cols-1 gap-4 border-t border-[var(--admin-soft-panel-border)] px-4 py-4 xl:grid-cols-2">
              <FormField label="Latitude" error={errors.latitude}>
                <input
                  value={values.latitude}
                  onChange={(event) => updateField("latitude", event.target.value)}
                  placeholder="Ví dụ: 10.755"
                  className={inputClass(Boolean(errors.latitude))}
                />
              </FormField>

              <FormField label="Longitude" error={errors.longitude}>
                <input
                  value={values.longitude}
                  onChange={(event) => updateField("longitude", event.target.value)}
                  placeholder="Ví dụ: 106.668"
                  className={inputClass(Boolean(errors.longitude))}
                />
              </FormField>
            </div>
          </details>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] p-4 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.35)] sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#22D3EE]">
                <ShieldCheck className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-lg font-semibold text-[var(--admin-strong-text)]">
                  Trạng thái tài khoản
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--admin-muted-text)]">
                  Điều chỉnh nhanh trạng thái hoạt động và xác minh.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="flex items-start gap-3 rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-3.5">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(event) => updateField("isActive", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[var(--admin-soft-panel-border)] accent-[#FF8A1F]"
                />

                <span>
                  <span className="block text-base font-semibold text-[var(--admin-strong-text)]">
                    Tài khoản hoạt động
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--admin-muted-text)]">
                    Nếu tắt, tài khoản sẽ được xem là đang bị khóa.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] p-3.5">
                <input
                  type="checkbox"
                  checked={values.isVerified}
                  onChange={(event) => updateField("isVerified", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[var(--admin-soft-panel-border)] accent-[#FF8A1F]"
                />

                <span>
                  <span className="block text-base font-semibold text-[var(--admin-strong-text)]">
                    Đã xác minh
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--admin-muted-text)]">
                    Chỉ bật khi thông tin tài khoản đã được kiểm tra đầy đủ.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {submitError ? (
            <section className="rounded-2xl border border-red-500/30 bg-red-50 p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-red-500/10">
              <p className="text-sm font-medium text-red-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-red-100">{submitError}</p>
            </section>
          ) : null}

          {savedMessage ? (
            <section className="rounded-2xl border border-[#0EA5E9]/30 bg-cyan-50 p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0EA5E9]/10">
              <p className="text-sm font-medium text-cyan-800 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#E0F2FE]">{savedMessage}</p>
            </section>
          ) : null}

          <section className="rounded-2xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] p-3 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-4">
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold text-[var(--admin-cta-text)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "var(--admin-cta-bg)",
                  boxShadow: "var(--admin-cta-shadow)",
                }}
              >
                <Save className="h-4 w-4" />
                {isBusy ? "Đang lưu..." : "Lưu thay đổi"}
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={resetForm}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-soft-panel)] px-4 text-base font-semibold text-[var(--admin-strong-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Hoàn tác
              </button>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[var(--admin-theme-text)]">
        {label}
        {required ? <span className="ml-1 text-[#F87171]">*</span> : null}
      </label>

      {children}

      {error ? <p className="text-sm font-medium text-[#F87171]">{error}</p> : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "h-11 w-full rounded-2xl border bg-[var(--admin-control-bg)] px-3 text-base font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-subtle-text)]",
    hasError
      ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
      : "border-[var(--admin-soft-panel-border)] hover:border-[var(--admin-control-hover-border)] focus:border-[#06B6D4]/70 focus:ring-[#06B6D4]/25",
    "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
  ].join(" ");
}

function StatusPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={[
        "inline-flex h-8 items-center rounded-full border px-3 text-xs font-bold",
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-emerald-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-emerald-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-emerald-300"
          : "border-amber-300 bg-amber-50 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-amber-400/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-amber-400/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-amber-300",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function getRoleLabel(role: AccountItem["role"]) {
  if (role === "USER") return "Khách hàng";
  if (role === "TECHNICIAN") return "Kỹ thuật viên";
  return "Quản trị viên";
}

function getInitials(value?: string | null) {
  const parts = (value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return "A";

  return parts.map((part) => part[0]?.toUpperCase()).join("");
}
