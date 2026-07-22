"use client";

import { useCallback, useMemo, useState } from "react";
import { useAsyncAction } from "@/app/hooks/common/useAsyncAction";
import { aiService, chatsService, type ChatSessionItem } from "@/app/services/common";
import type { TechnicianBookingFormValues } from "@/app/components/client/booking/booking.types";

type UseCustomerBookingOptions = {
  initialSessionId?: number | null;
};

type CustomerProfileDefaults = {
  contactName: string;
  contactPhone: string;
  address: string;
};

function readLocalUserProfile(): CustomerProfileDefaults {
  if (typeof window === "undefined") {
    return { contactName: "", contactPhone: "", address: "" };
  }

  const rawProfile = window.localStorage.getItem("user_profile");
  if (!rawProfile) {
    return { contactName: "", contactPhone: "", address: "" };
  }

  try {
    const profile = JSON.parse(rawProfile) as {
      name?: string;
      phoneNumber?: string;
      address?: string;
    };

    return {
      contactName: profile.name?.trim() || "",
      contactPhone: profile.phoneNumber?.trim() || "",
      address: profile.address?.trim() || "",
    };
  } catch {
    return { contactName: "", contactPhone: "", address: "" };
  }
}

function buildBootstrapMessage(values: TechnicianBookingFormValues) {
  const device = values.deviceType.trim();
  const symptom = values.symptom.trim();

  return `Tôi cần đặt thợ sửa chữa. Thiết bị: ${device}. Tình trạng lỗi: ${symptom}.`;
}

export function useCustomerBooking(options?: UseCustomerBookingOptions) {
  const defaults = useMemo(() => readLocalUserProfile(), []);
  const [sessionId, setSessionId] = useState<number | null>(options?.initialSessionId ?? null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastBookedSession, setLastBookedSession] = useState<ChatSessionItem | null>(null);
  const { run, clearError, ...state } = useAsyncAction();

  const createInitialValues = useCallback(
    (seed?: Partial<TechnicianBookingFormValues>): TechnicianBookingFormValues => ({
      contactName: seed?.contactName ?? defaults.contactName,
      contactPhone: seed?.contactPhone ?? defaults.contactPhone,
      address: seed?.address ?? defaults.address,
      deviceType: seed?.deviceType ?? "",
      symptom: seed?.symptom ?? "",
    }),
    [defaults.address, defaults.contactName, defaults.contactPhone],
  );

  const submitBooking = useCallback(
    async (values: TechnicianBookingFormValues, currentSessionId?: number | null) =>
      run(async () => {
        setSuccessMessage(null);

        const normalizedSessionId = currentSessionId ?? sessionId;
        let resolvedSessionId = normalizedSessionId ?? null;

        if (!values.deviceType.trim() || !values.symptom.trim()) {
          throw { message: "Cần nhập loại thiết bị và mô tả lỗi trước khi đặt thợ." };
        }

        if (!resolvedSessionId) {
          const aiResponse = await aiService.chat({
            message: buildBootstrapMessage(values),
            history: [],
          });

          resolvedSessionId = aiResponse.sessionId ?? null;
        }

        if (!resolvedSessionId) {
          throw { message: "Không thể tạo phiên sửa chữa để đặt thợ. Vui lòng thử lại." };
        }

        const result = await chatsService.bookTechnician(resolvedSessionId, {
          contactName: values.contactName?.trim(),
          contactPhone: values.contactPhone?.trim(),
          address: values.address?.trim(),
        });

        setSessionId(result.data.id);
        setLastBookedSession(result.data);
        setSuccessMessage("Yêu cầu đã được tiếp nhận và đang tìm kỹ thuật viên phù hợp.");

        return result.data;
      }),
    [run, sessionId],
  );

  return {
    ...state,
    clearError,
    sessionId,
    setSessionId,
    successMessage,
    lastBookedSession,
    createInitialValues,
    submitBooking,
  };
}
