"use client";

import { X } from "lucide-react";

import TechnicianBookingForm from "@/app/components/client/booking/TechnicianBookingForm";
import type { TechnicianBookingFormValues } from "@/app/components/client/booking/booking.types";
import type { ApiError } from "@/app/services/apiClient";

type BookingModalProps = {
  open: boolean;
  bookingValues: TechnicianBookingFormValues;
  isSubmitting: boolean;
  error: ApiError | null;
  successMessage: string | null;
  onClose: () => void;
  onChange: (field: keyof TechnicianBookingFormValues, value: string) => void;
  onSubmit: () => Promise<void>;
};

export function BookingModal({
  open,
  bookingValues,
  isSubmitting,
  error,
  successMessage,
  onClose,
  onChange,
  onSubmit,
}: BookingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-[28px]">
        <button
          type="button"
          aria-label="Đóng form đặt thợ"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--client-card-border)] bg-[var(--client-card-bg)] text-[var(--client-text-secondary)] transition hover:bg-[var(--client-control-hover-bg)] hover:text-[var(--client-text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>

        <TechnicianBookingForm
          title="Gọi thợ khẩn từ kết quả AI"
          description="AI đang đánh giá tình huống này có mức rủi ro cao. Tạm thời đừng tự thao tác thiết bị, hãy xác nhận thông tin để hệ thống phát đơn cho kỹ thuật viên."
          submitLabel="Gửi yêu cầu thợ"
          values={bookingValues}
          onChange={onChange}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          error={error}
          successMessage={successMessage}
          summary={[
            {
              title: "Thiết bị",
              value: bookingValues.deviceType || "Chưa đủ dữ liệu từ AI",
            },
            {
              title: "Tình trạng",
              value: bookingValues.symptom || "Khách cần mô tả thêm",
            },
          ]}
          className="p-5 sm:p-6"
        />
      </div>
    </div>
  );
}