"use client";

import { ArrowRight, Loader2, MapPin, Phone, Wrench } from "lucide-react";
import type { ApiError } from "@/app/services/apiClient";
import type {
  TechnicianBookingFormValues,
  TechnicianBookingSummary,
} from "./booking.types";

type TechnicianBookingFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  values: TechnicianBookingFormValues;
  onChange: (field: keyof TechnicianBookingFormValues, value: string) => void;
  onSubmit: () => void | Promise<void>;
  isSubmitting: boolean;
  error: ApiError | null;
  successMessage?: string | null;
  summary?: TechnicianBookingSummary[];
  className?: string;
};

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">
      {children}
    </label>
  );
}

export default function TechnicianBookingForm({
  title,
  description,
  submitLabel,
  values,
  onChange,
  onSubmit,
  isSubmitting,
  error,
  successMessage,
  summary,
  className,
}: TechnicianBookingFormProps) {
  return (
    <div
      className={[
        "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none sm:p-8",
        className ?? "",
      ].join(" ")}
    >
      <div className="mb-7">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/60">
          {description}
        </p>
      </div>

      {summary?.length ? (
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {summary.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-black/20"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-white/40">
                {item.title}
              </p>
              <p className="mt-2 break-words text-sm font-medium text-slate-700 dark:text-white/75">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Họ và tên</FieldLabel>
            <input
              type="text"
              value={values.contactName ?? ""}
              onChange={(event) => onChange("contactName", event.target.value)}
              placeholder="Nhập họ và tên"
              className="client-input-focus w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-white/35"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <FieldLabel>Số điện thoại</FieldLabel>
            <input
              type="tel"
              value={values.contactPhone ?? ""}
              onChange={(event) => onChange("contactPhone", event.target.value)}
              placeholder="0xxx xxx xxx"
              className="client-input-focus w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-white/35"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Loại thiết bị</FieldLabel>
            <div className="relative">
              <Wrench className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={values.deviceType}
                onChange={(event) => onChange("deviceType", event.target.value)}
                placeholder="Ví dụ: Máy lạnh, laptop, router..."
                className="client-input-focus w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-white/35"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Địa chỉ hỗ trợ</FieldLabel>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={values.address ?? ""}
                onChange={(event) => onChange("address", event.target.value)}
                placeholder="Nhập địa chỉ cần kỹ thuật viên hỗ trợ"
                className="client-input-focus w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-white/35"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div>
          <FieldLabel>Mô tả tình trạng lỗi</FieldLabel>
          <textarea
            rows={5}
            value={values.symptom}
            onChange={(event) => onChange("symptom", event.target.value)}
            placeholder="Ví dụ: Laptop bật không lên nguồn, máy có tiếng quạt nhưng màn hình không hiển thị..."
            className="client-input-focus w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-white/35"
            disabled={isSubmitting}
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error.message}
          </div>
        ) : null}

        {successMessage ? (
          <div className="client-accent-soft client-accent-border rounded-2xl border px-4 py-3 text-sm dark:bg-[#FF7A00]/15 dark:text-[#FFB366]">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="client-accent-gradient client-accent-shadow mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang gửi yêu cầu...
            </>
          ) : (
            <>
              {submitLabel}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          Thông tin sẽ được dùng để phát đơn cho kỹ thuật viên phù hợp.
        </div>
      </form>
    </div>
  );
}
