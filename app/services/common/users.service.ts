import { apiClient } from "@/app/services/apiClient";
import type {
  ToggleOnlinePayload,
  UpdateProfilePayload,
  UserMutationResponse,
  UserProfile,
} from "./types";

export const usersService = {
  /** Gọi GET /users/profile để lấy đầy đủ hồ sơ của người dùng hiện tại. */
  getProfile() {
    return apiClient.get<UserProfile>("/api/users/profile");
  },

  /** Gọi PATCH /users/update-profile để cập nhật các trường hồ sơ cho phép chỉnh sửa. */
  updateProfile(payload: UpdateProfilePayload) {
    return apiClient.patch<UserMutationResponse>("/api/users/update-profile", payload);
  },

  /** Gọi PATCH /users/fcm-token để đăng ký hoặc làm mới FCM token của thiết bị hiện tại. */
  updateFcmToken(token: string) {
    return apiClient.patch<UserMutationResponse>("/api/users/fcm-token", { token });
  },

  /** Gọi PATCH /users/toggle-online để đổi trạng thái online và cập nhật tọa độ nếu có. */
  toggleOnline(payload: ToggleOnlinePayload) {
    return apiClient.patch<UserMutationResponse>("/api/users/toggle-online", payload);
  },
};
