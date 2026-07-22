"use client";

import { useCallback } from "react";
import { usersService, type ToggleOnlinePayload, type UpdateProfilePayload } from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useUsersApi() {
  const { run, ...state } = useAsyncAction();

  /** Lấy hồ sơ người dùng hiện tại từ module users. */
  const getProfile = useCallback(() => run(() => usersService.getProfile()), [run]);

  /** Cập nhật các trường hồ sơ cho phép chỉnh sửa. */
  const updateProfile = useCallback((payload: UpdateProfilePayload) => run(() => usersService.updateProfile(payload)), [run]);

  /** Đăng ký hoặc làm mới FCM token của người dùng hiện tại. */
  const updateFcmToken = useCallback((token: string) => run(() => usersService.updateFcmToken(token)), [run]);

  /** Đổi trạng thái online và tọa độ tùy chọn cho người dùng hiện tại. */
  const toggleOnline = useCallback((payload: ToggleOnlinePayload) => run(() => usersService.toggleOnline(payload)), [run]);

  return {
    ...state,
    getProfile,
    updateProfile,
    updateFcmToken,
    toggleOnline,
  };
}
