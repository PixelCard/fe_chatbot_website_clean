"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useAuthApi } from "@/app/auth/hooks/useAuthApi";
import {
  getClientRoleFromDocument,
  getClientTokenFromDocument,
  getRouteByRole,
  setClientSession,
  syncStoredSessionToCookie,
} from "@/app/auth/utils/session";
import {
  consumeSocialCallback,
  startGoogleLogin,
  startZaloLogin,
} from "@/app/auth/utils/socialAuth";
import { ClientHeader } from "@/app/components/client/header/navigation/ClientHeader";
import { APP_ROUTES } from "@/app/config/routes";
import type { UserRole } from "@/app/services/common/types";
import type { LoginResponse } from "@/app/auth/services/auth.service";

type AuthMode = "login" | "register";
type ThemeMode = "dark" | "light";

const LOGIN_LOTTIE_SRC = "/animations/Robot Futuristic Ai animated.lottie";
const REGISTER_LOTTIE_SRC = "/animations/Man_robot_sitting_together.lottie";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function resolveAuthTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  const rootTheme = document.documentElement.dataset.theme;
  if (rootTheme === "dark" || rootTheme === "light") return rootTheme;

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function toUserRole(value: unknown): UserRole | null {
  return value === "ADMIN" || value === "TECHNICIAN" || value === "USER"
    ? value
    : null;
}

function normalizePhoneNumber(rawPhone: string) {
  const digitsOnly = rawPhone.replace(/\D/g, "");

  if (digitsOnly.length === 9 && !digitsOnly.startsWith("0")) {
    return `0${digitsOnly}`;
  }

  return digitsOnly;
}

function hasTemporarySocialPhone(phoneNumber?: string | null) {
  return Boolean(
    phoneNumber &&
    (phoneNumber.startsWith("ZALO_") || phoneNumber.startsWith("GOOGLE_")),
  );
}

function replaceModeInAddressBar(mode: AuthMode) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  if (mode === "register") {
    url.searchParams.set("mode", "register");
  } else {
    url.searchParams.delete("mode");
  }

  window.history.replaceState(
    null,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function ZaloLogo() {
  return (
    <span
      aria-hidden="true"
      className="grid h-5 w-5 place-items-center rounded-[7px] bg-[#0068ff] text-[10px] font-black leading-none text-white"
    >
      Z
    </span>
  );
}

function SocialLoginButtons({
  disabled,
  onGoogle,
  onZalo,
}: {
  disabled: boolean;
  onGoogle: () => void;
  onZalo: () => void;
}) {
  const buttonClass =
    "group flex h-12 flex-1 items-center justify-center gap-2 rounded-[16px] border bg-white/90 px-3 text-sm font-black text-slate-700 shadow-[0_12px_26px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-800";

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        Hoặc tiếp tục với
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className={buttonClass}
          onClick={onGoogle}
          disabled={disabled}
        >
          <GoogleLogo />
          Google
        </button>

        <button
          type="button"
          className={buttonClass}
          onClick={onZalo}
          disabled={disabled}
        >
          <ZaloLogo />
          Zalo
        </button>
      </div>
    </div>
  );
}

function LoginPageContent() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [notice, setNotice] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [authMode, setAuthMode] = useState<AuthMode>(() =>
    searchParams.get("mode") === "register" ? "register" : "login",
  );

  const {
    login,
    loginWithGoogle,
    loginWithZalo,
    register,
    getProfile,
    isSubmitting,
    error,
    clearError,
  } = useAuthApi();

  const isRegister = authMode === "register";
  const isDark = theme === "dark";

  useEffect(() => {
    const nextMode: AuthMode =
      searchParams.get("mode") === "register" ? "register" : "login";

    setAuthMode(nextMode);
  }, [searchParams]);

  useEffect(() => {
    setTheme(resolveAuthTheme());

    const observer = new MutationObserver(() => {
      setTheme(resolveAuthTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const handleStorage = () => setTheme(resolveAuthTheme());
    window.addEventListener("storage", handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const { token, role } = syncStoredSessionToCookie();
    const resolvedToken = token ?? getClientTokenFromDocument();

    if (!resolvedToken) return;

    router.replace(getRouteByRole(role ?? getClientRoleFromDocument()));
  }, [router]);

  const switchMode = (mode: AuthMode) => {
    if (mode === authMode) return;

    clearError();
    setFormError(null);
    setNotice(null);

    setAuthMode(mode);
    replaceModeInAddressBar(mode);
  };

  const completeAuthSession = async (response: LoginResponse) => {
    const rawResponse = response as unknown as Record<string, unknown>;
    const responseUser =
      rawResponse.user && typeof rawResponse.user === "object"
        ? (rawResponse.user as Record<string, unknown>)
        : null;
    const token =
      response.access_token ??
      (typeof rawResponse.token === "string" ? rawResponse.token : undefined);
    let resolvedRole =
      toUserRole(response.role) ?? toUserRole(responseUser?.role);

    if (!token) {
      throw new Error(
        "Đăng nhập thành công nhưng không nhận được token từ backend.",
      );
    }

    setClientSession(token, resolvedRole);

    let profileName = "Khách hàng";
    let profileEmail = "";

    try {
      const profile = await getProfile();

      if (profile?.fullName) profileName = profile.fullName;
      if (profile?.email) profileEmail = profile.email;

      if (profile?.needsPassword || hasTemporarySocialPhone(profile?.phoneNumber)) {
        localStorage.setItem(
          "user_profile",
          JSON.stringify({ name: profileName, email: profileEmail }),
        );
        router.push(APP_ROUTES.Auth.UPDATE_PROFILE);
        return;
      }

      resolvedRole = toUserRole(profile?.role) ?? resolvedRole;
    } catch {
      profileName =
        typeof responseUser?.fullName === "string"
          ? responseUser.fullName
          : typeof responseUser?.name === "string"
            ? responseUser.name
            : "Khách hàng";

      profileEmail =
        typeof responseUser?.email === "string" ? responseUser.email : "";
    }

    setClientSession(token, resolvedRole);

    localStorage.setItem(
      "user_profile",
      JSON.stringify({ name: profileName, email: profileEmail }),
    );

    router.push(getRouteByRole(resolvedRole));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      clearError();
      setNotice(null);

      const response = await login({ phoneNumber, password });
      const rawResponse = response as unknown as Record<string, unknown>;

      const responseUser =
        rawResponse.user && typeof rawResponse.user === "object"
          ? (rawResponse.user as Record<string, unknown>)
          : null;

      const token =
        response.access_token ??
        (typeof rawResponse.token === "string" ? rawResponse.token : undefined);

      let resolvedRole =
        toUserRole(response.role) ?? toUserRole(responseUser?.role);

      if (!token) {
        throw new Error(
          "Đăng nhập thành công nhưng không nhận được token từ backend.",
        );
      }

      setClientSession(token, resolvedRole);

      let profileName = "Khách hàng";
      let profileEmail = "";

      try {
        const profile = await getProfile();

        if (profile?.fullName) profileName = profile.fullName;
        if (profile?.email) profileEmail = profile.email;

        resolvedRole = toUserRole(profile?.role) ?? resolvedRole;
      } catch {
        profileName =
          typeof responseUser?.fullName === "string"
            ? responseUser.fullName
            : typeof responseUser?.name === "string"
              ? responseUser.name
              : "Khách hàng";

        profileEmail =
          typeof responseUser?.email === "string" ? responseUser.email : "";
      }

      setClientSession(token, resolvedRole);

      localStorage.setItem(
        "user_profile",
        JSON.stringify({ name: profileName, email: profileEmail }),
      );

      router.push(getRouteByRole(resolvedRole));
    } catch {
      // useAuthApi tự xử lý error state.
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) clearError();
    if (formError) setFormError(null);
    if (notice) setNotice(null);

    const { name, type, checked, value } = e.target;

    const nextValue =
      type === "checkbox"
        ? checked
        : name === "phone"
          ? value.replace(/\D/g, "")
          : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleRegisterPhoneBlur = () => {
    const normalizedPhone = normalizePhoneNumber(formData.phone);

    if (normalizedPhone !== formData.phone) {
      setFormData((prev) => ({ ...prev, phone: normalizedPhone }));
    }
  };

  const validateRegisterForm = () => {
    const fullName = `${formData.lastName} ${formData.firstName}`.trim();
    const phone = normalizePhoneNumber(formData.phone.trim());
    const email = formData.email.trim();
    const registerPassword = formData.password;

    if (!fullName || !phone || !email || !registerPassword) {
      return "Vui lòng nhập đầy đủ thông tin đăng ký.";
    }

    if (!/^0\d{9}$/.test(phone)) {
      return "Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx).";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Email không đúng định dạng.";
    }

    if (registerPassword.length < 6 || registerPassword.length > 20) {
      return "Mật khẩu phải từ 6 đến 20 ký tự.";
    }

    if (!formData.agreeTerms) {
      return "Bạn cần đồng ý điều khoản trước khi đăng ký.";
    }

    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateRegisterForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      clearError();
      setFormError(null);

      const normalizedPhone = normalizePhoneNumber(formData.phone.trim());

      await register({
        fullName: `${formData.lastName} ${formData.firstName}`.trim(),
        phoneNumber: normalizedPhone,
        email: formData.email.trim().toLowerCase(),
        gender: "OTHER",
        password: formData.password,
      });

      setPhoneNumber(normalizedPhone);
      setPassword("");
      setAuthMode("login");
      replaceModeInAddressBar("login");
      setNotice("Tạo tài khoản thành công. Bạn có thể đăng nhập ngay.");
    } catch {
      // useAuthApi tự xử lý error state.
    }
  };

  const handleGoogleLogin = () => {
    try {
      clearError();
      setFormError(null);
      setNotice(null);
      startGoogleLogin();
    } catch (error) {
      const message = (error as Error).message;
      setNotice(message);
      setFormError(message);
    }
  };

  const handleZaloLogin = async () => {
    try {
      clearError();
      setFormError(null);
      setNotice(null);
      await startZaloLogin();
    } catch (error) {
      const message = (error as Error).message;
      setNotice(message);
      setFormError(message);
    }
  };

  useEffect(() => {
    let callback: ReturnType<typeof consumeSocialCallback>;

    try {
      callback = consumeSocialCallback();
    } catch (error) {
      setAuthMode("login");
      setNotice((error as Error).message);
      return;
    }

    if (!callback) return;

    setAuthMode("login");
    setNotice("Đang hoàn tất đăng nhập...");

    const finish = async () => {
      try {
        clearError();

        const response =
          callback.provider === "google"
            ? await loginWithGoogle({ idToken: callback.idToken })
            : await loginWithZalo({
              code: callback.code,
              codeVerifier: callback.codeVerifier,
              redirectUri: callback.redirectUri,
              state: callback.state,
              platform: "WEB",
            });

        await completeAuthSession(response);
      } catch (error) {
        setNotice((error as Error).message);
      }
    };

    void finish();
  }, []);

  const loginMessage =
    error && authMode === "login"
      ? error.message || "Đăng nhập thất bại. Vui lòng thử lại."
      : notice && authMode === "login"
        ? notice
        : "";

  const registerMessage =
    error && authMode === "register"
      ? error.message || "Đăng ký thất bại. Vui lòng thử lại."
      : formError || "";

  const pageBackground = isDark
    ? "bg-[radial-gradient(circle_at_8%_16%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(148,163,184,0.10),transparent_28%),linear-gradient(135deg,#020617_0%,#07111f_46%,#0f172a_100%)] text-slate-50"
    : "bg-[radial-gradient(circle_at_12%_18%,rgba(255,138,31,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(255,191,82,0.12),transparent_30%),linear-gradient(135deg,#fffdf9_0%,#fff8ef_48%,#ffffff_100%)] text-slate-900";

  const panelBackground = isDark
    ? "before:bg-[linear-gradient(135deg,#07111f_0%,#0f2747_48%,#2563eb_100%)] before:shadow-[0_42px_110px_rgba(0,0,0,0.46)]"
    : "before:bg-[linear-gradient(135deg,#ff7a00_0%,#ff9f1a_58%,#ffc043_100%)] before:shadow-[0_42px_110px_rgba(255,138,31,0.22)]";

  const panelRegisterBackground = isDark
    ? "before:bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_52%,#3b82f6_100%)]"
    : "before:bg-[linear-gradient(135deg,#ff8a1f_0%,#ff9f1a_52%,#ffd08a_100%)]";

  return (
    <>
      <ClientHeader />

      <main
        id="authScene"
        data-theme={theme}
        className={cx(
          "auth-scene relative isolate min-h-[calc(100vh-72px)] overflow-hidden transition-colors duration-300",
          pageBackground,
          "before:pointer-events-none before:absolute before:hidden before:h-[2100px] before:w-[2100px] before:rounded-full before:content-[''] lg:before:block",
          "before:z-[1] before:right-[48%] before:top-[-18%] before:-translate-y-1/2",
          "before:transition-[transform,right,background,box-shadow] before:duration-[1250ms] before:ease-[cubic-bezier(0.22,1,0.36,1)]",
          panelBackground,
          isRegister &&
          cx(
            "sign-up-mode before:right-[48%] before:translate-x-full before:-translate-y-1/2",
            panelRegisterBackground,
          ),
        )}
      >
        <div
          className="ambient pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <span
            className={cx(
              "orb one absolute left-[7vw] top-[78vh] h-[180px] w-[180px] rounded-full opacity-30 blur-[3px]",
              isDark ? "bg-blue-500/20" : "bg-orange-500/20",
            )}
          />
          <span
            className={cx(
              "orb two absolute right-[8vw] top-[12vh] h-[240px] w-[240px] rounded-full opacity-30 blur-[3px]",
              isDark ? "bg-slate-500/15" : "bg-blue-500/15",
            )}
          />
          <span
            className={cx(
              "orb three absolute bottom-[8vh] right-[18vw] h-[160px] w-[160px] rounded-full opacity-30 blur-[3px]",
              isDark ? "bg-blue-400/15" : "bg-slate-400/15",
            )}
          />
        </div>

        <div className="forms-container pointer-events-none relative inset-0 z-[30] px-4 py-24 lg:absolute lg:px-0 lg:py-0">
          <div
            className={cx(
              "signin-signup relative mx-auto grid w-full max-w-[620px] grid-cols-1 lg:absolute lg:top-1/2 lg:min-h-[620px] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2",
              "lg:transition-[left,width] lg:duration-[900ms] lg:ease-[cubic-bezier(0.22,1,0.36,1)]",
              isRegister ? "lg:left-[25%] lg:w-[54%]" : "lg:left-[75%] lg:w-1/2",
            )}
          >
            <form
              id="loginForm"
              noValidate
              onSubmit={handleLogin}
              className={cx(
                "auth-form sign-in-form col-start-1 row-start-1 self-center justify-self-center overflow-hidden rounded-[34px] border p-[clamp(26px,3vw,38px)] backdrop-blur-[22px]",
                "w-[min(520px,calc(100vw-44px))] transition-[opacity,transform,background,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isDark
                  ? "border-slate-700/80 bg-slate-900/95 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.60)]"
                  : "border-orange-200/90 bg-white/95 shadow-[0_32px_80px_-12px_rgba(249,115,22,0.22),0_12px_24px_-8px_rgba(0,0,0,0.08)]",
                isRegister
                  ? "pointer-events-none z-[1] -translate-x-8 scale-[0.985] opacity-0"
                  : "pointer-events-auto z-[2] translate-x-0 scale-100 opacity-100",
              )}
            >
              <h1 className="mb-3 text-[clamp(34px,4vw,48px)] font-black leading-none tracking-[-0.075em] text-slate-950 dark:text-slate-50">
                Đăng nhập
              </h1>

              <p className="lead mb-6 text-[15.5px] font-medium leading-7 text-slate-600 dark:text-slate-300">
                Theo dõi yêu cầu sửa chữa, báo giá và trạng thái xử lý thiết bị
                của bạn trong cùng một không gian rõ ràng hơn.
              </p>

              <label className="input-field mb-3.5 grid h-[58px] grid-cols-[48px_1fr_48px] items-center rounded-[18px] border border-orange-200/70 bg-[#fff9f2]/90 text-slate-400 transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-800/90 dark:focus-within:border-blue-600 dark:focus-within:bg-slate-800 dark:focus-within:ring-blue-900/40">
                <span className="input-icon grid place-items-center text-lg">☎</span>
                <input
                  id="loginPhone"
                  type="tel"
                  placeholder="Số điện thoại"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    if (error) clearError();
                    if (notice) setNotice(null);
                    setPhoneNumber(e.target.value);
                  }}
                  disabled={isSubmitting}
                  className="h-full w-full bg-transparent pr-2 text-[15px] font-semibold tracking-[0.05em] [font-variant-numeric:tabular-nums] text-slate-950 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-50 [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff9f2_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] dark:[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#1e293b_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f8fafc]"
                />
                <span aria-hidden="true" />
              </label>

              <label className="input-field mb-3.5 grid h-[58px] grid-cols-[48px_1fr_48px] items-center rounded-[18px] border border-orange-200/70 bg-[#fff9f2]/90 text-slate-400 transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-800/90 dark:focus-within:border-blue-600 dark:focus-within:bg-slate-800 dark:focus-within:ring-blue-900/40">
                <span className="input-icon grid place-items-center text-lg">🔒</span>
                <input
                  id="loginPassword"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    if (error) clearError();
                    if (notice) setNotice(null);
                    setPassword(e.target.value);
                  }}
                  disabled={isSubmitting}
                  className="h-full w-full bg-transparent pr-2 text-[15px] font-semibold tracking-[0.05em] [font-variant-numeric:tabular-nums] text-slate-950 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-50 [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff9f2_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] dark:[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#1e293b_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f8fafc]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showLoginPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="grid h-full w-full place-items-center text-slate-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 transition-transform duration-200 active:scale-90 hover:text-orange-600 dark:hover:text-cyan-400"
                >
                  {showLoginPassword ? (
                    <EyeOff className="h-5 w-5 transition-all duration-300 hover:scale-110" />
                  ) : (
                    <Eye className="h-5 w-5 transition-all duration-300 hover:scale-110" />
                  )}
                </button>
              </label>

              <div className="form-options mb-4 mt-1 flex items-center justify-between gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <label className="remember inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-orange-500 dark:accent-blue-700"
                  />
                  Ghi nhớ đăng nhập
                </label>

                <button
                  className="link-btn border-0 bg-transparent text-sm font-black text-orange-600 dark:text-blue-400"
                  type="button"
                  onClick={() => router.push(APP_ROUTES.Auth.FORGOT_PASSWORD)}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <p
                className={cx(
                  "message mb-3 min-h-[22px] text-[13.5px] font-extrabold",
                  notice && authMode === "login"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-red-500",
                )}
                id="loginMessage"
              >
                {loginMessage}
              </p>

              <button
                className="submit-btn h-[54px] w-full rounded-[18px] border-0 bg-orange-500 text-sm font-black tracking-[0.06em] text-white shadow-[0_18px_38px_rgba(255,138,31,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-700 dark:shadow-[0_18px_38px_rgba(37,99,235,0.22)] dark:hover:bg-blue-800"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
              </button>

              <SocialLoginButtons
                disabled={isSubmitting}
                onGoogle={handleGoogleLogin}
                onZalo={handleZaloLogin}
              />

              <div className="mt-5 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-black text-orange-600 hover:underline dark:text-blue-400"
                >
                  Đăng ký ngay
                </button>
              </div>

              <p className="helper mt-3 text-center text-[13px] font-semibold leading-6 text-slate-400">
                Dành cho khách hàng, kỹ thuật viên và quản trị viên SmartElec.
              </p>
            </form>

            <form
              id="registerForm"
              noValidate
              onSubmit={handleRegister}
              className={cx(
                "auth-form sign-up-form col-start-1 row-start-1 self-center justify-self-center overflow-hidden rounded-[34px] border p-[clamp(26px,3vw,38px)] backdrop-blur-[22px]",
                "w-[min(600px,calc(100vw-44px))] transition-[opacity,transform,background,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isDark
                  ? "border-slate-700/80 bg-slate-900/95 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.60)]"
                  : "border-orange-200/90 bg-white/95 shadow-[0_32px_80px_-12px_rgba(249,115,22,0.22),0_12px_24px_-8px_rgba(0,0,0,0.08)]",
                isRegister
                  ? "pointer-events-auto z-[2] translate-x-0 scale-100 opacity-100"
                  : "pointer-events-none z-[1] translate-x-8 scale-[0.985] opacity-0",
              )}
            >
              <h1 className="mb-3 text-[clamp(34px,4vw,48px)] font-black leading-none tracking-[-0.075em] text-slate-950 dark:text-slate-50">
                Đăng ký
              </h1>

              <p className="lead mb-6 text-[15.5px] font-medium leading-7 text-slate-600 dark:text-slate-300">
                Gửi yêu cầu sửa chữa, nhận tư vấn lỗi thiết bị và theo dõi tiến
                độ xử lý theo thời gian thực.
              </p>

              <div className="field-grid grid grid-cols-2 gap-3 max-sm:grid-cols-1 max-sm:gap-0">
                <label className="input-field mb-3.5 grid h-[58px] grid-cols-[48px_1fr_48px] items-center rounded-[18px] border border-orange-200/70 bg-[#fff9f2]/90 text-slate-400 transition focus-within:-translate-y-px focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-800/90 dark:focus-within:border-blue-600 dark:focus-within:bg-slate-800 dark:focus-within:ring-blue-900/40">
                  <span className="input-icon grid place-items-center text-lg">👤</span>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Họ"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleRegisterChange}
                    disabled={isSubmitting}
                    className="h-full w-full bg-transparent pr-2 text-[15px] font-semibold tracking-[0.05em] [font-variant-numeric:tabular-nums] text-slate-950 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-50 [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff9f2_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] dark:[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#1e293b_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f8fafc]"
                  />
                  <span aria-hidden="true" />
                </label>

                <label className="input-field mb-3.5 grid h-[58px] grid-cols-[48px_1fr_48px] items-center rounded-[18px] border border-orange-200/70 bg-[#fff9f2]/90 text-slate-400 transition focus-within:-translate-y-px focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-800/90 dark:focus-within:border-blue-600 dark:focus-within:bg-slate-800 dark:focus-within:ring-blue-900/40">
                  <span className="input-icon grid place-items-center text-lg">✦</span>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Tên"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleRegisterChange}
                    disabled={isSubmitting}
                    className="h-full w-full bg-transparent pr-2 text-[15px] font-semibold tracking-[0.05em] [font-variant-numeric:tabular-nums] text-slate-950 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-50 [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff9f2_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] dark:[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#1e293b_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f8fafc]"
                  />
                  <span aria-hidden="true" />
                </label>
              </div>

              <label className="input-field mb-3.5 grid h-[58px] grid-cols-[48px_1fr_48px] items-center rounded-[18px] border border-orange-200/70 bg-[#fff9f2]/90 text-slate-400 transition focus-within:-translate-y-px focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-800/90 dark:focus-within:border-blue-600 dark:focus-within:bg-slate-800 dark:focus-within:ring-blue-900/40">
                <span className="input-icon grid place-items-center text-lg">☎</span>
                <input
                  id="registerPhone"
                  name="phone"
                  type="tel"
                  placeholder="Số điện thoại"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterPhoneBlur}
                  disabled={isSubmitting}
                  className="h-full w-full bg-transparent pr-2 text-[15px] font-semibold tracking-[0.05em] [font-variant-numeric:tabular-nums] text-slate-950 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-50 [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff9f2_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] dark:[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#1e293b_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f8fafc]"
                />
                <span aria-hidden="true" />
              </label>

              <label className="input-field mb-3.5 grid h-[58px] grid-cols-[48px_1fr_48px] items-center rounded-[18px] border border-orange-200/70 bg-[#fff9f2]/90 text-slate-400 transition focus-within:-translate-y-px focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-800/90 dark:focus-within:border-blue-600 dark:focus-within:bg-slate-800 dark:focus-within:ring-blue-900/40">
                <span className="input-icon grid place-items-center text-lg">✉</span>
                <input
                  id="registerEmail"
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleRegisterChange}
                  disabled={isSubmitting}
                  className="h-full w-full bg-transparent pr-2 text-[15px] font-semibold tracking-[0.05em] [font-variant-numeric:tabular-nums] text-slate-950 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-50 [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff9f2_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] dark:[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#1e293b_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f8fafc]"
                />
                <span aria-hidden="true" />
              </label>

              <label className="input-field mb-3.5 grid h-[58px] grid-cols-[48px_1fr_48px] items-center rounded-[18px] border border-orange-200/70 bg-[#fff9f2]/90 text-slate-400 transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-800/90 dark:focus-within:border-blue-600 dark:focus-within:bg-slate-800 dark:focus-within:ring-blue-900/40">
                <span className="input-icon grid place-items-center text-lg">🔒</span>
                <input
                  id="registerPassword"
                  name="password"
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleRegisterChange}
                  disabled={isSubmitting}
                  className="h-full w-full bg-transparent pr-2 text-[15px] font-semibold tracking-[0.05em] [font-variant-numeric:tabular-nums] text-slate-950 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-50 [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff9f2_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] dark:[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#1e293b_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f8fafc]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showRegisterPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="grid h-full w-full place-items-center text-slate-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 transition-transform duration-200 active:scale-90 hover:text-orange-600 dark:hover:text-cyan-400"
                >
                  {showRegisterPassword ? (
                    <EyeOff className="h-5 w-5 transition-all duration-300 hover:scale-110" />
                  ) : (
                    <Eye className="h-5 w-5 transition-all duration-300 hover:scale-110" />
                  )}
                </button>
              </label>

              <label className="terms mb-3.5 flex items-start gap-3 rounded-[16px] border border-orange-100 bg-[#fff9f2]/90 p-3 text-[13px] font-semibold leading-5 text-slate-600 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleRegisterChange}
                  disabled={isSubmitting}
                  className="mt-1 accent-orange-500 dark:accent-blue-700"
                />

                <span>
                  Tôi đồng ý với{" "}
                  <strong className="font-black text-orange-600 dark:text-blue-400">
                    Điều khoản dịch vụ
                  </strong>{" "}
                  và{" "}
                  <strong className="font-black text-orange-600 dark:text-blue-400">
                    Chính sách bảo mật
                  </strong>{" "}
                  của SmartElec.
                </span>
              </label>

              <p
                className="message mb-3 min-h-[22px] text-[13.5px] font-extrabold text-red-500"
                id="registerMessage"
              >
                {registerMessage}
              </p>

              <button
                className="submit-btn h-[54px] w-full rounded-[18px] border-0 bg-orange-500 text-sm font-black tracking-[0.06em] text-white shadow-[0_18px_38px_rgba(255,138,31,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-700 dark:shadow-[0_18px_38px_rgba(37,99,235,0.22)] dark:hover:bg-blue-800"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ TÀI KHOẢN"}
              </button>

              <SocialLoginButtons
                disabled={isSubmitting}
                onGoogle={handleGoogleLogin}
                onZalo={handleZaloLogin}
              />

              <div className="mt-5 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-black text-orange-600 hover:underline dark:text-blue-400"
                >
                  Đăng nhập ngay
                </button>
              </div>

              <p className="helper mt-3 text-center text-[13px] font-semibold leading-6 text-slate-400">
                Tạo tài khoản để xem tiến độ sửa chữa và lịch sử hỗ trợ tập
                trung hơn.
              </p>
            </form>
          </div>
        </div>

        <section
          className="panels-container pointer-events-none absolute inset-0 z-[20] hidden grid-cols-2 lg:grid"
          aria-label="SmartElec hero panels"
        >
          <div
            className={cx(
              "panel left-panel relative flex min-w-0 items-center justify-center overflow-hidden p-[clamp(30px,5vw,74px)] text-left text-white",
              isRegister ? "pointer-events-none" : "pointer-events-auto",
            )}
          >
            <div
              className={cx(
                "panel-content relative z-[25] w-[min(580px,100%)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                isRegister
                  ? "-translate-x-[820px] opacity-0"
                  : "translate-x-0 opacity-100",
              )}
            >
              <div className="panel-eyebrow relative z-[35] mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-xs font-black uppercase tracking-[0.1em] text-white/90 backdrop-blur before:h-[9px] before:w-[9px] before:rounded-full before:bg-white before:shadow-[0_0_0_6px_rgba(255,255,255,0.16)] before:content-['']">
                Smart Service Flow
              </div>

              <h2 className="relative z-[35] mb-5 text-[clamp(40px,5vw,76px)] font-black leading-[0.96] tracking-[-0.08em] text-white drop-shadow-[0_20px_46px_rgba(0,0,0,0.16)]">
                Thiết bị lỗi? Có SmartElec xử lý.
              </h2>

              <p className="relative z-[35] mb-6 max-w-[510px] text-[17px] font-semibold leading-8 text-white/80">
                Đăng nhập để theo dõi yêu cầu, báo giá và tiến độ sửa chữa
                laptop, PC, điện thoại, màn hình với trải nghiệm rõ ràng hơn.
              </p>

              <button
                className="transparent-btn relative z-[35] cursor-pointer pointer-events-auto h-12 rounded-full border border-white/55 bg-white/20 px-6 text-[13px] font-black tracking-[0.08em] text-white shadow-[0_14px_30px_rgba(5,11,24,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/30 active:scale-95"
                type="button"
                id="signUpBtn"
                onClick={() => switchMode("register")}
              >
                ĐĂNG KÝ NGAY →
              </button>

              <div
                className="visual-zone relative z-[40] mt-4 h-[370px] w-[min(520px,86%)]"
                data-parallax
              >
                <div className="asset-halo absolute inset-[10%_8%] z-[1] rounded-[32px] bg-white/20 blur-[20px]" />

                <div className="auth-lottie-wrap absolute inset-[24px_24px_78px] z-[20] flex items-center justify-center overflow-hidden rounded-[32px] border border-white/20 bg-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <DotLottieReact
                    className="auth-lottie-player block h-full w-full"
                    src={LOGIN_LOTTIE_SRC}
                    loop
                    autoplay={!isRegister}
                    renderConfig={{ autoResize: true }}
                  />
                </div>

                <div className="stat-chip absolute bottom-0 left-0 z-[50] inline-flex max-w-[320px] items-center gap-3.5 rounded-[22px] border border-white/25 bg-white/15 p-4 text-white shadow-[0_20px_38px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <div className="chip-icon grid h-11 w-11 place-items-center rounded-[14px] bg-white/15 text-[22px]">
                    📍
                  </div>
                  <div>
                    <div className="chip-title text-sm font-black tracking-[-0.02em]">
                      Theo dõi tiến độ
                    </div>
                    <div className="chip-sub mt-1 text-xs font-semibold leading-5 text-white/75">
                      Cập nhật trạng thái theo thời gian thực
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cx(
              "panel right-panel relative flex min-w-0 items-center justify-center overflow-hidden p-[clamp(30px,5vw,74px)] text-right text-white",
              isRegister ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
            <div
              className={cx(
                "panel-content relative z-[25] w-[min(580px,100%)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                isRegister
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[820px] opacity-0",
              )}
            >
              <div className="panel-eyebrow relative z-[35] mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-xs font-black uppercase tracking-[0.1em] text-white/90 backdrop-blur before:h-[9px] before:w-[9px] before:rounded-full before:bg-white before:shadow-[0_0_0_6px_rgba(255,255,255,0.16)] before:content-['']">
                Tài khoản mới
              </div>

              <h2 className="relative z-[35] mb-5 text-[clamp(40px,5vw,76px)] font-black leading-[0.96] tracking-[-0.08em] text-white drop-shadow-[0_20px_46px_rgba(0,0,0,0.16)]">
                Khởi tạo nhanh. Theo dõi dễ.
              </h2>

              <p className="relative z-[35] mb-6 ml-auto max-w-[510px] text-[17px] font-semibold leading-8 text-white/80">
                Đăng ký một lần để gửi yêu cầu sửa chữa, nhận tư vấn AI chẩn
                đoán và quản lý các phiên hỗ trợ trong cùng một luồng.
              </p>

              <button
                className="transparent-btn relative z-[35] cursor-pointer pointer-events-auto h-12 rounded-full border border-white/55 bg-white/20 px-6 text-[13px] font-black tracking-[0.08em] text-white shadow-[0_14px_30px_rgba(5,11,24,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/30 active:scale-95"
                type="button"
                id="signInBtn"
                onClick={() => switchMode("login")}
              >
                ĐĂNG NHẬP NGAY →
              </button>

              <div
                className="visual-zone relative z-[40] ml-auto mt-4 h-[370px] w-[min(520px,86%)]"
                data-parallax
              >
                <div className="asset-halo secondary absolute inset-[10%_8%] z-[1] rounded-[32px] bg-blue-400/20 blur-[20px]" />

                <div className="auth-lottie-wrap secondary absolute inset-[24px_24px_78px] z-[20] flex items-center justify-center overflow-hidden rounded-[32px] border border-white/20 bg-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <DotLottieReact
                    key={`register-lottie-${isRegister ? "active" : "hidden"}`}
                    className="auth-lottie-player block h-full w-full"
                    src={REGISTER_LOTTIE_SRC}
                    loop
                    autoplay
                    renderConfig={{ autoResize: true }}
                  />
                </div>

                <div className="stat-chip secondary absolute bottom-0 right-0 z-[50] inline-flex max-w-[320px] items-center gap-3.5 rounded-[22px] border border-white/25 bg-white/15 p-4 text-white shadow-[0_20px_38px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <div className="chip-icon grid h-11 w-11 place-items-center rounded-[14px] bg-white/15 text-[22px]">
                    🛠
                  </div>
                  <div>
                    <div className="chip-title text-sm font-black tracking-[-0.02em]">
                      Tạo yêu cầu nhanh
                    </div>
                    <div className="chip-sub mt-1 text-xs font-semibold leading-5 text-white/75">
                      Kết nối kỹ thuật viên và trạng thái sửa chữa
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
