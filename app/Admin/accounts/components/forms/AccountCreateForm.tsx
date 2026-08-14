"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  MapPin,
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";

import { useAccounts } from "../../hooks";
import {
  ACCOUNT_ROLE_OPTIONS,
  DEFAULT_CREATE_ACCOUNT_VALUES,
  GENDER_OPTIONS,
} from "../../constants/account.constants";
import {
  hasValidationErrors,
  validateCreateAccountForm,
} from "../../utils/accountValidation";

import AdminToastStack, {
  type AdminToast,
} from "@/app/components/admin/AdminToastStack";

import type {
  AccountRole,
  CreateAccountFormValues,
  CreateAccountPayload,
  Gender,
  ValidationErrors,
} from "../../types/account.types";

type CreateStep = 1 | 2;

const LOGIN_STEP_FIELDS: Array<keyof CreateAccountFormValues> = [
  "phoneNumber",
  "email",
  "password",
  "confirmPassword",
];

export default function AccountCreateForm() {
  const router = useRouter();
  const { createAccount, isMutating } = useAccounts();

  const [step, setStep] = useState<CreateStep>(1);
  const [completedStepOne, setCompletedStepOne] = useState(false);

  const [values, setValues] = useState<CreateAccountFormValues>(
    DEFAULT_CREATE_ACCOUNT_VALUES,
  );
  const [errors, setErrors] =
    useState<ValidationErrors<CreateAccountFormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gpsOpen, setGpsOpen] = useState(false);
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const pushToast = (type: AdminToast["type"], text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const isBusy = submitting || isMutating;

  const hasLocation =
    values.latitude.trim().length > 0 || values.longitude.trim().length > 0;

  const stepOneReady = useMemo(() => {
    return (
      values.phoneNumber.trim().length > 0 &&
      values.password.trim().length > 0 &&
      values.confirmPassword.trim().length > 0 &&
      values.password === values.confirmPassword
    );
  }, [values.confirmPassword, values.password, values.phoneNumber]);

  const canSubmit = step === 2 && completedStepOne && !isBusy;

  const updateField = <K extends keyof CreateAccountFormValues>(
    key: K,
    value: CreateAccountFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));

    setSubmitError(null);

    if (LOGIN_STEP_FIELDS.includes(key)) {
      setCompletedStepOne(false);
    }

    if ((key === "latitude" || key === "longitude") && !gpsOpen) {
      setGpsOpen(true);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCompletedStepOne(false);
    setValues(DEFAULT_CREATE_ACCOUNT_VALUES);
    setErrors({});
    setSubmitError(null);
    setGpsOpen(false);
  };

  const validateStepOne = () => {
    const nextErrors = validateCreateAccountForm(values);

    const loginErrors: ValidationErrors<CreateAccountFormValues> = {};

    LOGIN_STEP_FIELDS.forEach((field) => {
      if (nextErrors[field]) {
        loginErrors[field] = nextErrors[field];
      }
    });

    setErrors((current) => ({
      ...current,
      ...loginErrors,
    }));

    return !hasValidationErrors(loginErrors);
  };

  const handleNextStep = () => {
    setSubmitError(null);

    const valid = validateStepOne();

    if (!valid) return;

    setCompletedStepOne(true);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackStep = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step !== 2 || !completedStepOne) {
      setSubmitError("Bạn cần hoàn thành bước 1 trước khi tạo tài khoản.");
      return;
    }

    const nextErrors = validateCreateAccountForm(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (hasValidationErrors(nextErrors)) return;

    setSubmitting(true);

    try {
      const payload: CreateAccountPayload = {
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
        fullName: values.fullName.trim() || null,
        gender: values.gender,
        email: values.email.trim() || null,
        avatarUrl: values.avatarUrl.trim() || null,
        address: values.address.trim() || null,
        role: values.role,
        isVerified: values.isVerified,
        isActive: values.isActive,
        latitude: values.latitude.trim() ? Number(values.latitude) : null,
        longitude: values.longitude.trim() ? Number(values.longitude) : null,
      };

      const created = await createAccount(payload);
      pushToast(
        "success",
        `Tạo tài khoản "${values.fullName || values.phoneNumber}" thành công!`,
      );
      resetForm();
      router.push(`/admin/accounts/${created.id}/edit`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể tạo tài khoản.";
      setSubmitError(message);
      pushToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <header className="admin-card rounded-2xl px-5 py-5 sm:px-6 lg:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link
              href="/admin/accounts"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--admin-muted-text)] transition hover:text-[var(--admin-accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách tài khoản
            </Link>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
              Tạo tài khoản mới
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
              Hoàn thành 2 bước để tạo tài khoản và thiết lập vai trò ban đầu.
            </p>
          </div>

          <StepIndicator currentStep={step} completedStepOne={completedStepOne} />
        </div>
      </header>

      {step === 1 ? (
        <FormSection
          title="Bước 1: Thông tin đăng nhập"
          description="Nhập số điện thoại, email và mật khẩu đăng nhập. Hoàn thành bước này mới được qua bước tiếp theo."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField
              label="Số điện thoại"
              required
              error={errors.phoneNumber}
            >
              <input
                value={values.phoneNumber}
                onChange={(event) =>
                  updateField("phoneNumber", event.target.value)
                }
                placeholder="Ví dụ: 0901234567"
                className={inputClass(Boolean(errors.phoneNumber))}
              />
            </FormField>

            <FormField label="Email" error={errors.email}>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="name@example.com"
                className={inputClass(Boolean(errors.email))}
              />
            </FormField>

            <FormField label="Mật khẩu" required error={errors.password}>
              <input
                type="password"
                value={values.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                placeholder="Tối thiểu 8 ký tự"
                className={inputClass(Boolean(errors.password))}
              />
            </FormField>

            <FormField
              label="Nhập lại mật khẩu"
              required
              error={errors.confirmPassword}
            >
              <input
                type="password"
                value={values.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                placeholder="Nhập lại mật khẩu"
                className={inputClass(Boolean(errors.confirmPassword))}
              />
            </FormField>
          </div>

          {submitError ? (
            <ErrorBox message={submitError} />
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-semibold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)]"
            >
              <RotateCcw className="h-4 w-4" />
              Đặt lại
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={!stepOneReady}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[image:var(--admin-cta-bg)] px-5 text-sm font-semibold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tiếp tục
            </button>
          </div>
        </FormSection>
      ) : null}

      {step === 2 ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-5">
            <FormSection
              title="Bước 2: Thông tin cá nhân"
              description="Bổ sung thông tin hồ sơ, vai trò, vị trí GPS và trạng thái ban đầu."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Họ tên" error={errors.fullName}>
                  <input
                    value={values.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Nhập họ tên"
                    className={inputClass(Boolean(errors.fullName))}
                  />
                </FormField>

                <FormField label="Giới tính" required error={errors.gender}>
                  <select
                    value={values.gender}
                    onChange={(event) =>
                      updateField("gender", event.target.value as Gender)
                    }
                    className={inputClass(Boolean(errors.gender))}
                  >
                    {GENDER_OPTIONS.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                        className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]"
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Địa chỉ" error={errors.address}>
                    <textarea
                      value={values.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      rows={3}
                      placeholder="Nhập địa chỉ người dùng"
                      className={[
                        inputClass(Boolean(errors.address)),
                        "min-h-[96px] resize-none py-2.5",
                      ].join(" ")}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Avatar URL" error={errors.avatarUrl}>
                    <input
                      value={values.avatarUrl}
                      onChange={(event) =>
                        updateField("avatarUrl", event.target.value)
                      }
                      placeholder="https://example.com/avatar.jpg"
                      className={inputClass(Boolean(errors.avatarUrl))}
                    />
                  </FormField>
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Vai trò"
              description="Chọn đúng loại tài khoản để hệ thống áp dụng luồng quản trị phù hợp."
            >
              <div className="grid grid-cols-1 gap-4 md:max-w-sm">
                <FormField label="Vai trò" required error={errors.role}>
                  <select
                    value={values.role}
                    onChange={(event) =>
                      updateField("role", event.target.value as AccountRole)
                    }
                    className={inputClass(Boolean(errors.role))}
                  >
                    {ACCOUNT_ROLE_OPTIONS.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                        className="bg-[var(--admin-control-bg)] text-[var(--admin-strong-text)]"
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </FormSection>

            <section className="admin-card rounded-2xl p-5">
              <button
                type="button"
                onClick={() => setGpsOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-3 text-left"
                aria-expanded={gpsOpen || hasLocation}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309] dark:text-[#FBBF24]">
                    <MapPin className="h-4 w-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[var(--admin-strong-text)]">
                      Vị trí GPS
                    </span>

                    <span className="block text-sm text-[var(--admin-muted-text)]">
                      Tùy chọn. Chỉ nhập khi cần lưu vị trí gần đúng của tài khoản.
                    </span>
                  </span>
                </span>

                <ChevronDown
                  className={[
                    "h-4 w-4 shrink-0 text-[var(--admin-muted-text)] transition-transform",
                    gpsOpen || hasLocation ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              {gpsOpen || hasLocation ? (
                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[var(--admin-card-border)] pt-4 md:grid-cols-2">
                  <FormField label="Latitude" error={errors.latitude}>
                    <input
                      value={values.latitude}
                      onChange={(event) =>
                        updateField("latitude", event.target.value)
                      }
                      placeholder="Ví dụ: 10.755"
                      className={inputClass(Boolean(errors.latitude))}
                    />
                  </FormField>

                  <FormField label="Longitude" error={errors.longitude}>
                    <input
                      value={values.longitude}
                      onChange={(event) =>
                        updateField("longitude", event.target.value)
                      }
                      placeholder="Ví dụ: 106.668"
                      className={inputClass(Boolean(errors.longitude))}
                    />
                  </FormField>
                </div>
              ) : null}
            </section>
          </section>

          <aside className="xl:sticky xl:top-4 xl:self-start">
            <section className="admin-card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
                  <ShieldCheck className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[var(--admin-strong-text)]">
                    Trạng thái ban đầu
                  </h2>

                  <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
                    Thiết lập trạng thái kích hoạt và xác minh trước khi lưu.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <StatusOption
                  checked={values.isActive}
                  onChange={(checked) => updateField("isActive", checked)}
                  title="Tài khoản hoạt động"
                  description="Nếu tắt, tài khoản sẽ bị khóa ngay sau khi tạo."
                />

                <StatusOption
                  checked={values.isVerified}
                  onChange={(checked) => updateField("isVerified", checked)}
                  title="Đánh dấu đã xác minh"
                  description="Chỉ bật khi thông tin tài khoản đã được kiểm tra."
                />
              </div>

              {submitError ? (
                <ErrorBox message={submitError} />
              ) : null}

              <div className="mt-5 space-y-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--admin-cta-bg)] px-5 text-sm font-semibold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isBusy ? "Đang tạo..." : "Tạo tài khoản"}
                </button>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={handleBackStep}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-semibold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Quay lại bước 1
                </button>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={resetForm}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-control-bg)] px-4 text-sm font-semibold text-[var(--admin-muted-text)] transition hover:border-[var(--admin-control-hover-border)] hover:bg-[var(--admin-control-hover-bg)] hover:text-[var(--admin-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Đặt lại
                </button>
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      <AdminToastStack
        toasts={toasts}
        onRemove={(id) =>
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </form>
  );
}

function StepIndicator({
  currentStep,
  completedStepOne,
}: {
  currentStep: CreateStep;
  completedStepOne: boolean;
}) {
  return (
    <div className="grid min-w-[280px] grid-cols-2 overflow-hidden rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-1">
      <div
        className={[
          "rounded-xl px-3 py-2.5 transition",
          currentStep === 1
            ? "bg-[var(--admin-control-bg)] shadow-sm"
            : completedStepOne
              ? "bg-[#22C55E]/10"
              : "",
        ].join(" ")}
      >
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--admin-soft-text)]">
          Bước 1
        </p>
        <p className="mt-1 text-sm font-bold text-[var(--admin-strong-text)]">
          Đăng nhập
        </p>
      </div>

      <div
        className={[
          "rounded-xl px-3 py-2.5 transition",
          currentStep === 2 ? "bg-[#FF7A00]/10" : "",
        ].join(" ")}
      >
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--admin-soft-text)]">
          Bước 2
        </p>
        <p className="mt-1 text-sm font-bold text-[var(--admin-strong-text)]">
          Hồ sơ & vai trò
        </p>
      </div>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-card rounded-2xl p-5">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-[var(--admin-strong-text)]">
          {title}
        </h2>

        <p className="text-sm text-[var(--admin-muted-text)]">
          {description}
        </p>
      </div>

      <div className="mt-5">{children}</div>
    </section>
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
      <label className="text-sm font-semibold text-[var(--admin-strong-text)]">
        {label}
        {required ? (
          <span className="ml-1 text-[var(--admin-error)]">*</span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p className="text-sm font-medium text-[var(--admin-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StatusOption({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-[var(--admin-card-border)] accent-[#FF7A00]"
      />

      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[var(--admin-strong-text)]">
          {title}
        </span>

        <span className="mt-1 block text-sm text-[var(--admin-muted-text)]">
          {description}
        </span>
      </span>
    </label>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
      <p className="text-sm font-medium text-[var(--admin-error)]">
        {message}
      </p>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "h-10 w-full rounded-xl border bg-[var(--admin-control-bg)] px-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-soft-text)]",
    hasError
      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/25"
      : "border-[var(--admin-card-border)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-accent)] focus:ring-[var(--admin-focus-ring)]",
    "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
  ].join(" ");
}