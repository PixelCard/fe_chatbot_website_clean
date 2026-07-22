"use client";

import { MapPin } from "lucide-react";
import type {
  CreateAccountFormValues,
  UpdateAccountFormValues,
  ValidationErrors,
} from "../../types/account.types";

type Props<T extends CreateAccountFormValues | UpdateAccountFormValues> = {
  values: T;
  errors?: ValidationErrors<T>;
  onChange: <K extends keyof T>(key: K, value: T[K]) => void;
};

export default function AccountLocationFields<
  T extends CreateAccountFormValues | UpdateAccountFormValues,
>({ values, errors = {}, onChange }: Props<T>) {
  const hasLocation =
    values.latitude.trim().length > 0 || values.longitude.trim().length > 0;

  return (
    <section className="rounded-3xl border border-[#1E2A3F] bg-[#101B2E] p-4 sm:p-5 xl:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#FBBF24]">
          <MapPin className="h-5 w-5" />
        </span>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-white">Vị trí GPS</h2>

          <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">
            Latitude và longitude là dữ liệu tùy chọn. Chỉ nhập khi nghiệp vụ cần lưu vị trí gần nhất của tài khoản.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <FormField
          label="Latitude"
          error={errors.latitude as string | undefined}
        >
          <input
            value={values.latitude}
            onChange={(event) =>
              onChange("latitude" as keyof T, event.target.value as T[keyof T])
            }
            placeholder="Ví dụ: 10.755"
            className={inputClass(Boolean(errors.latitude))}
          />
        </FormField>

        <FormField
          label="Longitude"
          error={errors.longitude as string | undefined}
        >
          <input
            value={values.longitude}
            onChange={(event) =>
              onChange("longitude" as keyof T, event.target.value as T[keyof T])
            }
            placeholder="Ví dụ: 106.668"
            className={inputClass(Boolean(errors.longitude))}
          />
        </FormField>
      </div>

      {hasLocation ? (
        <div className="mt-4 rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 p-3">
          <p className="text-sm font-semibold text-[#FBBF24]">
            Đã nhập thông tin vị trí
          </p>

          <p className="mt-1 text-sm leading-6 text-[#D1D5DB]">
            Hệ thống chỉ lưu vị trí nếu cả latitude và longitude hợp lệ.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#D1D5DB]">{label}</label>
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
