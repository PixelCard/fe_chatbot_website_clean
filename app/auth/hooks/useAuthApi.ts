"use client";

import { useCallback, useState } from "react";
import {
  authService,
  type GoogleLoginPayload,
  type LoginPayload,
  type LoginResponse,
  type RegisterPayload,
  type SetPasswordPayload,
  type UpdateProfilePayload,
  type UserProfileResponse,
  type ZaloLoginPayload,
} from "@/app/auth/services/auth.service";
import type { ApiError } from "@/app/services/apiClient";

type UseAuthApiState = {
  isSubmitting: boolean;
  error: ApiError | null;
};

export function useAuthApi() {
  const [state, setState] = useState<UseAuthApiState>({
    isSubmitting: false,
    error: null,
  });

  const run = useCallback(async <T,>(action: () => Promise<T>) => {
    setState({ isSubmitting: true, error: null });
    try {
      return await action();
    } catch (error) {
      setState({ isSubmitting: false, error: error as ApiError });
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, []);

  const login = useCallback((payload: LoginPayload): Promise<LoginResponse> => {
    return run(() => authService.login(payload));
  }, [run]);

  const loginWithGoogle = useCallback((payload: GoogleLoginPayload): Promise<LoginResponse> => {
    return run(() => authService.loginWithGoogle(payload));
  }, [run]);

  const loginWithZalo = useCallback((payload: ZaloLoginPayload): Promise<LoginResponse> => {
    return run(() => authService.loginWithZalo(payload));
  }, [run]);

  const setPassword = useCallback((payload: SetPasswordPayload) => {
    return run(() => authService.setPassword(payload));
  }, [run]);

  const register = useCallback((payload: RegisterPayload) => {
    return run(() => authService.register(payload));
  }, [run]);

  const getProfile = useCallback((accessToken?: string): Promise<UserProfileResponse> => {
    return run(() => authService.getProfile(accessToken));
  }, [run]);

  const updateProfile = useCallback((accessToken: string, payload: UpdateProfilePayload): Promise<UserProfileResponse> => {
    return run(() => authService.updateProfile(accessToken, payload));
  }, [run]);

  const requestResetOtp = useCallback((email: string) => {
    return run(() => authService.requestResetOtp({ email }));
  }, [run]);

  const verifyResetOtp = useCallback((email: string, otp: string) => {
    return run(() => authService.verifyResetOtp({ email, otp }));
  }, [run]);

  const resetPassword = useCallback((email: string, otp: string, newPassword: string) => {
    return run(() => authService.resetPassword({ email, otp, newPassword }));
  }, [run]);

  const requestEmailVerificationOtp = useCallback(() => {
    return run(() => authService.requestEmailVerificationOtp());
  }, [run]);

  const verifyEmailOtp = useCallback((otp: string) => {
    return run(() => authService.verifyEmailOtp({ otp }));
  }, [run]);

  return {
    ...state,
    clearError: () => setState((prev) => ({ ...prev, error: null })),
    login,
    loginWithGoogle,
    loginWithZalo,
    setPassword,
    getProfile,
    updateProfile,
    register,
    requestResetOtp,
    verifyResetOtp,
    resetPassword,
    requestEmailVerificationOtp,
    verifyEmailOtp,
  };
}


