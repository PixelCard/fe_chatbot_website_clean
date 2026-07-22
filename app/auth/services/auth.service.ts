import { apiClient } from "@/app/services/apiClient";

export type LoginPayload = {
  phoneNumber: string;
  password: string;
};

export type LoginResponse = {
  message?: string;
  userId?: number;
  role?: string;
  access_token?: string;
  token?: string;
  isNewUser?: boolean;
  needsPassword?: boolean;
  loginMethod?: "GOOGLE" | "ZALO";
  user?: {
    id?: number | string;
    role?: string;
  };
};

export type GoogleLoginPayload = {
  idToken: string;
};

export type ZaloLoginPayload = {
  code: string;
  codeVerifier: string;
  redirectUri?: string;
  state?: string;
  platform?: "WEB" | "ANDROID" | "IOS";
};

export type UserProfileResponse = {
  id: number | string;
  phoneNumber?: string;
  fullName?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  address?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  needsPassword?: boolean;
  isVerified?: boolean;
};

export type UpdateProfilePayload = {
  fullName?: string;
  email?: string;
  address?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  avatarUrl?: string;
};

export type RegisterPayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  password: string;
};

export type RequestResetOtpPayload = {
  email: string;
};

export type VerifyResetOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export type SetPasswordPayload = {
  phoneNumber: string;
  newPassword: string;
};

export type AuthMessageResponse = {
  message: string;
  verified?: boolean;
};

export type VerifyEmailOtpPayload = {
  otp: string;
};

export const authService = {
  login(payload: LoginPayload) {
    return apiClient.post<LoginResponse>("/api/auth/login", payload);
  },
  loginWithGoogle(payload: GoogleLoginPayload) {
    return apiClient.post<LoginResponse>("/api/auth/google-login", payload);
  },
  loginWithZalo(payload: ZaloLoginPayload) {
    return apiClient.post<LoginResponse>("/api/auth/zalo-login", payload);
  },
  setPassword(payload: SetPasswordPayload) {
    return apiClient.post<AuthMessageResponse>("/api/auth/set-password", payload);
  },
  register(payload: RegisterPayload) {
    return apiClient.post<unknown>("/api/auth/register", payload);
  },
  getProfile(accessToken?: string) {
    return apiClient.get<UserProfileResponse>(
      "/api/auth/profile",
      undefined,
      accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : undefined,
    );
  },
  updateProfile(accessToken: string, payload: UpdateProfilePayload) {
    return apiClient.patch<UserProfileResponse>("/api/users/update-profile", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  requestResetOtp(payload: RequestResetOtpPayload) {
    return apiClient.post<AuthMessageResponse>("/api/auth/forgot-password/request-otp", payload);
  },
  verifyResetOtp(payload: VerifyResetOtpPayload) {
    return apiClient.post<AuthMessageResponse>("/api/auth/forgot-password/verify-otp", payload);
  },
  resetPassword(payload: ResetPasswordPayload) {
    return apiClient.post<AuthMessageResponse>("/api/auth/forgot-password/reset", payload);
  },
  requestEmailVerificationOtp() {
    return apiClient.post<AuthMessageResponse>("/api/auth/email-verification/request-otp");
  },
  verifyEmailOtp(payload: VerifyEmailOtpPayload) {
    return apiClient.post<AuthMessageResponse>("/api/auth/email-verification/verify-otp", payload);
  },
};
