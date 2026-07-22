"use client";

import { ShieldCheck } from "lucide-react";
import type {
  AccountRole,
  CreateAccountFormValues,
  ValidationErrors,
} from "../../types/account.types";
import { ACCOUNT_ROLE_OPTIONS } from "../../constants/account.constants";

type Props = {
  values: CreateAccountFormValues;
  errors?: ValidationErrors<CreateAccountFormValues>;
  onChange: <K extends keyof CreateAccountFormValues>(
    key: K,
    value: CreateAccountFormValues[K],
  ) => void;
};

export default function AccountRoleFields({
  values,
  errors = {},
  onChange,
}: Props) {
  return (
    <section className="rounded-3xl border border-[#1E2A3F] bg-[#101B2E] p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#22D3EE]">
          <ShieldCheck className="h-5 w-5" />
        </span>

        <div>
          <h2 className="text-lg font-semibold text-white">Vai trò và trạng thái</h2>
          <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">
            Thiết lập vai trò, trạng thái xác minh và trạng thái hoạt động ban đầu.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#D1D5DB]">
            Vai trò <span className="text-[#F87171]">*</span>
          </label>

          <select
            value={values.role}
            onChange={(event) => onChange("role", event.target.value as AccountRole)}
            className={[
              "h-11 w-full rounded-2xl border bg-[#07111F] px-3 text-base font-medium text-white outline-none transition",
              errors.role
                ? "border-[#EF4444]/60 focus:ring-[#EF4444]/30"
                : "border-[#1E2A3F] hover:border-[#334155] focus:border-[#06B6D4]/70 focus:ring-[#06B6D4]/25",
              "focus:ring-2",
            ].join(" ")}
          >
            {ACCOUNT_ROLE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {errors.role ? (
            <p className="text-sm font-medium text-[#F87171]">{errors.role}</p>
          ) : null}
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) => onChange("isActive", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#1E2A3F]"
          />
          <span>
            <span className="block text-base font-semibold text-white">
              Tài khoản hoạt động
            </span>
            <span className="mt-1 block text-sm leading-6 text-[#9CA3AF]">
              Nếu tắt, tài khoản sẽ bị khóa ngay sau khi tạo.
            </span>
          </span>
        </label>

        <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
          <input
            type="checkbox"
            checked={values.isVerified}
            onChange={(event) => onChange("isVerified", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#1E2A3F]"
          />
          <span>
            <span className="block text-base font-semibold text-white">
              Đánh dấu đã xác minh
            </span>
            <span className="mt-1 block text-sm leading-6 text-[#9CA3AF]">
              Chỉ bật khi thông tin tài khoản đã được kiểm tra.
            </span>
          </span>
        </label>
      </div>
    </section>
  );
}