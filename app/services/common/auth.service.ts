import { apiClient } from "@/app/services/apiClient";
import type { AuthMessageResponse, AuthProfile, LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "./types";

export const authService = {
  /** Gọi POST /auth/login để đăng nhập và nhận JWT từ backend. */
  login(payload: LoginPayload) {
    return apiClient.post<LoginResponse>("/api/auth/login", payload);
  },

  /** Gọi POST /auth/register để tạo tài khoản mới theo DTO của backend. */
  register(payload: RegisterPayload) {
    return apiClient.post<RegisterResponse>("/api/auth/register", payload);
  },

  /** Gọi GET /auth/profile để lấy hồ sơ của người dùng đang đăng nhập. */
  getProfile() {
    return apiClient.get<AuthProfile>("/api/auth/profile");
  },

  requestEmailVerificationOtp() {
    return apiClient.post<AuthMessageResponse>("/api/auth/email-verification/request-otp");
  },

  verifyEmailOtp(otp: string) {
    return apiClient.post<AuthMessageResponse>("/api/auth/email-verification/verify-otp", { otp });
  },
};
