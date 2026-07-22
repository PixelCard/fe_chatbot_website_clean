'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthApi } from "@/app/auth/hooks/useAuthApi";
import { ClientHeader } from "@/app/components/client/header/navigation/ClientHeader";
import logo from "@/app/image/logo6.webp";
import type { ApiError } from "@/app/services/apiClient";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestResetOtp, verifyResetOtp, resetPassword, isSubmitting } = useAuthApi();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getErrorMessage = (value: unknown) => {
    if (value && typeof value === "object" && "message" in value) {
      return ((value as ApiError).message || "Co loi xay ra. Vui long thu lai.").trim();
    }

    return "Co loi xay ra. Vui long thu lai.";
  };

  useEffect(() => {
    const checkTimeAndSetTheme = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 18 || currentHour < 6) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    checkTimeAndSetTheme();
    const interval = setInterval(checkTimeAndSetTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Vui long nhap email dang ky.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Dinh dang email khong hop le.");
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await requestResetOtp(normalizedEmail);

      setEmail(normalizedEmail);
      setSuccessMessage(response.message);
      setTimer(60);
      setStep(2);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await requestResetOtp(email);
      setSuccessMessage(response.message);
      setTimer(60);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otp || otp.length < 6) {
      setError("Vui long nhap day du ma OTP 6 so.");
      return;
    }

    try {
      const response = await verifyResetOtp(email, otp);
      setSuccessMessage(response.message);
      setStep(3);
    } catch (verifyError) {
      setError(getErrorMessage(verifyError));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!password) {
      setError("Vui long nhap mat khau moi.");
      return;
    }

    if (password.length < 6) {
      setError("Mat khau moi phai co toi thieu 6 ky tu.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mat khau xac nhan khong khop.");
      return;
    }

    try {
      const response = await resetPassword(email, otp, password);
      setSuccessMessage(`${response.message} Dang chuyen huong ve trang dang nhap...`);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (resetError) {
      setError(getErrorMessage(resetError));
    }
  };

  return (
    <div className="auth-theme auth-page-shell relative isolate flex min-h-screen flex-col overflow-hidden transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              "radial-gradient(circle at 50% 100%, rgba(255, 138, 31, 0.14) 0%, transparent 58%), radial-gradient(circle at 50% 100%, rgba(255, 191, 82, 0.1) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(255, 227, 176, 0.08) 0%, transparent 82%), linear-gradient(180deg, #ffffff 0%, #fffcf8 58%, #fff8ef 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              "radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%), #000000",
          }}
        />
        <div className="absolute left-[-12%] top-[-18%] h-80 w-80 rounded-full bg-orange-200/30 blur-3xl dark:bg-indigo-300/10" />
        <div className="absolute bottom-[-20%] right-[-10%] h-96 w-96 rounded-full bg-amber-200/30 blur-3xl dark:bg-indigo-100/10" />
      </div>

      <div className="hidden md:block">
        <ClientHeader />
      </div>

      <main className="flex flex-1 items-center justify-center px-4 py-8 md:px-6 md:py-10 lg:py-12">
        <section className="auth-card grid w-full max-w-5xl overflow-hidden rounded-[24px] backdrop-blur-xl transition-colors duration-500 md:min-h-[560px] md:grid-cols-[0.95fr_1fr]">
          <aside className="auth-hero-panel relative hidden overflow-hidden md:flex">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop')",
              }}
            />

            <div className="auth-hero-scrim absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/55 to-slate-950/92" />

            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8 text-center">
              <div className="flex flex-col items-center">
                <Image
                  src={logo}
                  alt="SMARTELEC Logo"
                  className="h-56 w-auto -mb-12 object-contain drop-shadow-2xl"
                  priority
                />

                <h1 className="auth-hero-title text-4xl font-extrabold tracking-[0.18em] text-white drop-shadow-xl">
                  SMARTELEC
                </h1>

                <div className="mt-4 rounded-xl border border-[var(--auth-primary-soft-border)] bg-[color-mix(in_srgb,var(--auth-primary)_10%,transparent)] px-5 py-2 shadow-[0_16px_34px_rgba(0,0,0,0.22)] backdrop-blur-md">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--auth-primary)]">
                    AI DIAGNOSTIC SYSTEM
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="auth-panel flex w-full flex-col justify-center px-5 py-8 transition-colors duration-500 sm:px-8 md:px-10 lg:px-12">
            <div className="mb-8 flex flex-col items-center justify-center md:hidden">
              <Image
                src={logo}
                alt="SMARTELEC Logo Mobile"
                className="h-52 w-auto -mb-10 object-contain drop-shadow-xl"
                priority
              />

              <div className="relative z-20 mt-2 flex flex-col items-center">
                <h1 className="auth-heading text-2xl font-extrabold tracking-[0.18em]">
                  SMARTELEC
                </h1>

                <div className="auth-accent-border mt-2 rounded-xl border bg-transparent px-3 py-1.5">
                  <p className="auth-accent-text text-[10px] font-bold uppercase tracking-[0.14em]">
                    AI DIAGNOSTIC SYSTEM
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-7">
              <div className="auth-success mb-4 inline-flex rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]">
                Khôi phục tài khoản
              </div>

              <h2 className="auth-heading text-[28px] font-semibold leading-tight tracking-[-0.03em] md:text-[32px]">
                {step === 1 && "Quên mật khẩu"}
                {step === 2 && "Xác minh OTP"}
                {step === 3 && "Đặt lại mật khẩu"}
              </h2>

              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[var(--auth-muted-text)]">
                {step === 1 && "Nhập email đã đăng ký để nhận mã xác thực OTP."}
                {step === 2 && `Chúng tôi đã gửi mã OTP 6 số đến email ${email}.`}
                {step === 3 && "Nhập mật khẩu mới và xác nhận lại để hoàn tất khôi phục tài khoản."}
              </p>
            </div>

            <div className="auth-soft-panel mb-6 grid grid-cols-3 gap-2 rounded-2xl border p-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={[
                    "rounded-xl px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] transition-colors",
                    step === item
                      ? "bg-[var(--auth-primary)] text-[var(--auth-cta-text)]"
                      : "text-[var(--auth-muted-text)]",
                  ].join(" ")}
                >
                  Bước {item}
                </div>
              ))}
            </div>

            {error && (
              <div className="auth-error mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="auth-success mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors">
                {successMessage}
              </div>
            )}

            {step === 1 && (
              <form className="flex flex-col gap-5" onSubmit={handleSendOtp}>
                <div>
                  <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                    Email
                  </label>

                  <div className="auth-input auth-input-focus flex h-11 items-center rounded-2xl border px-4 transition-all">
                    <svg
                      className="mr-3 h-5 w-5 shrink-0 text-[var(--auth-primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="smartelec@example.com"
                      required
                      className="h-full w-full bg-transparent text-sm font-medium text-[var(--auth-input-text)] outline-none placeholder:text-[var(--auth-subtle-text)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-accent-gradient auth-accent-shadow auth-cta-text mt-1 h-11 w-full rounded-2xl text-sm font-extrabold uppercase tracking-[0.08em] transition-all hover:-translate-y-px hover:opacity-95 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
                >
                  {isSubmitting ? "ĐANG GỬI..." : "GỬI MÃ OTP"}
                </button>

                <div className="mt-7 text-center text-sm font-semibold text-[var(--auth-muted-text)]">
                  Nhớ mật khẩu?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="auth-link cursor-pointer font-bold transition-colors hover:underline"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="flex flex-col gap-5" onSubmit={handleVerifyOtp}>
                <div>
                  <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                    Mã xác thực OTP
                  </label>

                  <div className="auth-input auth-input-focus flex h-11 items-center rounded-2xl border px-4 transition-all">
                    <svg
                      className="mr-3 h-5 w-5 shrink-0 text-[var(--auth-primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      disabled={isSubmitting}
                      placeholder="Nhập 6 số OTP"
                      required
                      maxLength={6}
                      className="h-full w-full bg-transparent text-center text-sm font-semibold tracking-[0.25em] text-[var(--auth-input-text)] outline-none placeholder:text-[var(--auth-subtle-text)] placeholder:tracking-normal"
                    />
                  </div>
                </div>

                <div className="flex justify-end text-xs font-semibold text-[var(--auth-muted-text)]">
                  {timer > 0 ? (
                    <span>
                      Gửi lại mã sau{" "}
                      <span className="font-bold text-[var(--auth-primary)]">
                        {timer}s
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                      className="auth-link font-bold hover:underline disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Gửi lại mã OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-accent-gradient auth-accent-shadow auth-cta-text mt-1 h-11 w-full rounded-2xl text-sm font-extrabold uppercase tracking-[0.08em] transition-all hover:-translate-y-px hover:opacity-95 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
                >
                  {isSubmitting ? "ĐANG XÁC MINH..." : "XÁC MINH OTP"}
                </button>

                <div className="mt-7 text-center text-sm font-semibold text-[var(--auth-muted-text)]">
                  Sai địa chỉ email?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="auth-link cursor-pointer font-bold transition-colors hover:underline"
                  >
                    Đổi email khác
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form className="flex flex-col gap-5" onSubmit={handleResetPassword}>
                <div>
                  <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                    Mật khẩu mới
                  </label>

                  <div className="auth-input auth-input-focus flex h-11 items-center rounded-2xl border px-4 transition-all">
                    <svg
                      className="mr-3 h-5 w-5 shrink-0 text-[var(--auth-primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Nhập mật khẩu mới"
                      required
                      className="h-full w-full bg-transparent text-sm font-medium text-[var(--auth-input-text)] outline-none placeholder:text-[var(--auth-subtle-text)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                    Nhập lại mật khẩu mới
                  </label>

                  <div className="auth-input auth-input-focus flex h-11 items-center rounded-2xl border px-4 transition-all">
                    <svg
                      className="mr-3 h-5 w-5 shrink-0 text-[var(--auth-primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      className="h-full w-full bg-transparent text-sm font-medium text-[var(--auth-input-text)] outline-none placeholder:text-[var(--auth-subtle-text)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-accent-gradient auth-accent-shadow auth-cta-text mt-1 h-11 w-full rounded-2xl text-sm font-extrabold uppercase tracking-[0.08em] transition-all hover:-translate-y-px hover:opacity-95 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
                >
                  {isSubmitting ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT MẬT KHẨU"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}