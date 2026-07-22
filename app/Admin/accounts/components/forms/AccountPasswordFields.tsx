"use client";

import type {
  CreateAccountFormValues,
  ResetPasswordFormValues,
  ValidationErrors,
} from "../../types/account.types";

type PasswordValues = CreateAccountFormValues | ResetPasswordFormValues;

type Props<T extends PasswordValues> = {
  values: T;
  errors?: ValidationErrors<T>;
  onChange: <K extends keyof T>(key: K, value: T[K]) => void;
  title?: string;
  description?: string;
};

export default function AccountPasswordFields<T extends PasswordValues>({
  values,
  errors = {},
  onChange,
  title = "Mật khẩu đăng nhập",
  description = "Mật khẩu tối thiểu 8 ký tự, có cả chữ và số.",
}: Props<T>) {
  return (
    <section className="rounded-3xl border border-[#1E2A3F] bg-[#101B2E] p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">{description}</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Mật khẩu" required error={errors.password as string | undefined}>
          <input
            type="password"
            value={values.password}
            onChange={(event) =>
              onChange("password" as keyof T, event.target.value as T[keyof T])
            }
            placeholder="Tối thiểu 8 ký tự"
            className={inputClass(Boolean(errors.password))}
          />
        </FormField>

        <FormField
          label="Nhập lại mật khẩu"
          required
          error={errors.confirmPassword as string | undefined}
        >
          <input
            type="password"
            value={values.confirmPassword}
            onChange={(event) =>
              onChange("confirmPassword" as keyof T, event.target.value as T[keyof T])
            }
            placeholder="Nhập lại mật khẩu"
            className={inputClass(Boolean(errors.confirmPassword))}
          />
        </FormField>

        {"requireChangePassword" in values ? (
          <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
            <input
              type="checkbox"
              checked={values.requireChangePassword}
              onChange={(event) =>
                onChange(
                  "requireChangePassword" as keyof T,
                  event.target.checked as T[keyof T],
                )
              }
              className="mt-1 h-4 w-4 rounded border-[#1E2A3F]"
            />
            <span>
              <span className="block text-base font-semibold text-white">
                Yêu cầu đổi mật khẩu sau khi đăng nhập
              </span>
              <span className="mt-1 block text-sm leading-6 text-[#9CA3AF]">
                Nên bật khi admin reset mật khẩu tạm.
              </span>
            </span>
          </label>
        ) : null}
      </div>
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
      <label className="text-sm font-semibold text-[#D1D5DB]">
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
    "h-11 w-full rounded-2xl border bg-[#07111F] px-3 text-base font-medium text-white outline-none transition placeholder:text-[#64748B]",
    hasError
      ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
      : "border-[#1E2A3F] hover:border-[#334155] focus:border-[#06B6D4]/70 focus:ring-[#06B6D4]/25",
    "focus:ring-2",
  ].join(" ");
}