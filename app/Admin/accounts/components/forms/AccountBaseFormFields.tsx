"use client";

import type { ReactNode } from "react";
import type {
  AccountRole,
  CreateAccountFormValues,
  Gender,
  UpdateAccountFormValues,
  ValidationErrors,
} from "../../types/account.types";
import {
  ACCOUNT_ROLE_OPTIONS,
  GENDER_OPTIONS,
} from "../../constants/account.constants";

type CreateProps = {
  mode: "create";
  values: CreateAccountFormValues;
  errors?: ValidationErrors<CreateAccountFormValues>;
  onChange: <K extends keyof CreateAccountFormValues>(
    key: K,
    value: CreateAccountFormValues[K],
  ) => void;
};

type UpdateProps = {
  mode: "update";
  values: UpdateAccountFormValues;
  errors?: ValidationErrors<UpdateAccountFormValues>;
  onChange: <K extends keyof UpdateAccountFormValues>(
    key: K,
    value: UpdateAccountFormValues[K],
  ) => void;
};

type Props = CreateProps | UpdateProps;

export default function AccountBaseFormFields(props: Props) {
  const { mode } = props;

  return (
    <section className="rounded-3xl border border-[#1E2A3F] bg-[#101B2E] p-4 sm:p-5 xl:p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">
          Thông tin tài khoản
        </h2>

        <p className="text-sm leading-6 text-[#9CA3AF]">
          Nhập thông tin cơ bản của người dùng. Số điện thoại dùng làm định danh chính khi tạo tài khoản.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {mode === "create" ? <CreateOnlyFields props={props} /> : null}
        <CommonFields props={props} />
      </div>
    </section>
  );
}

function CreateOnlyFields({ props }: { props: CreateProps }) {
  const { values, errors = {}, onChange } = props;

  return (
    <>
      <div className="xl:col-span-4">
        <FormField
          label="Số điện thoại"
          required
          error={errors.phoneNumber}
        >
          <input
            value={values.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            placeholder="Ví dụ: 0901234567"
            className={inputClass(Boolean(errors.phoneNumber))}
          />
        </FormField>
      </div>

      <div className="xl:col-span-4">
        <FormField label="Vai trò" required error={errors.role}>
          <select
            value={values.role}
            onChange={(event) =>
              onChange("role", event.target.value as AccountRole)
            }
            className={inputClass(Boolean(errors.role))}
          >
            {ACCOUNT_ROLE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </>
  );
}

function CommonFields({ props }: { props: Props }) {
  const { values, errors = {} } = props;

  const updateField = (
    key: keyof UpdateAccountFormValues,
    value: string | Gender,
  ) => {
    if (props.mode === "create") {
      props.onChange(
        key as keyof CreateAccountFormValues,
        value as CreateAccountFormValues[keyof CreateAccountFormValues],
      );
      return;
    }

    props.onChange(
      key,
      value as UpdateAccountFormValues[keyof UpdateAccountFormValues],
    );
  };

  return (
    <>
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

      <div className="xl:col-span-6">
        <FormField label="Email" error={errors.email}>
          <input
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="name@example.com"
            className={inputClass(Boolean(errors.email))}
          />
        </FormField>
      </div>

      <div className="xl:col-span-6">
        <FormField label="Avatar URL" error={errors.avatarUrl}>
          <input
            value={values.avatarUrl}
            onChange={(event) => updateField("avatarUrl", event.target.value)}
            placeholder="https://..."
            className={inputClass(Boolean(errors.avatarUrl))}
          />
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
    </>
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
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#D1D5DB]">
        {label}
        {required ? <span className="ml-1 text-[#F87171]">*</span> : null}
      </label>

      {children}

      {error ? (
        <p className="text-sm font-medium text-[#F87171]">{error}</p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "h-11 w-full rounded-2xl border bg-[#07111F] px-3 text-base font-medium text-white outline-none transition placeholder:text-[#64748B]",
    hasError
      ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
      : "border-[#1E2A3F] hover:border-[#334155] focus:border-[#06B6D4]/70 focus:ring-[#06B6D4]/25",
    "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
  ].join(" ");
}
