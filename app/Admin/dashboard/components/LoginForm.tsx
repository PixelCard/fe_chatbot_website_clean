"use client";

import { FormEvent, useState } from "react";
import RoleTabs from "./RoleTabs";

type UserRole = "customer" | "technician";

export default function LoginForm() {
  const [role, setRole] = useState<UserRole>("customer");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!phone.trim() || !password.trim()) {
      setError("Vui long nhap day du so dien thoai va mat khau.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setError("Ban chua ket noi API dang nhap. Vui long cau hinh backend.");
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <RoleTabs activeRole={role} onRoleChange={setRole} disabled={isSubmitting} />

      <div className="space-y-4" id={`role-${role}`}>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-xs font-medium uppercase tracking-[0.12em] text-[#9CA3AF]">
            So dien thoai
          </label>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#1E2A3F] bg-[#101B2E] px-4 transition-colors duration-150 focus-within:border-[#06B6D4]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-[#22C55E]" fill="none">
              <path
                d="M21 15.5v2.5a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 2.2 2 2 0 0 1 3.08 0H5.6a2 2 0 0 1 2 1.72c.1.74.3 1.47.6 2.16a2 2 0 0 1-.45 2.11L6.67 7.07a16 16 0 0 0 6.26 6.26l1.08-1.08a2 2 0 0 1 2.1-.44c.7.29 1.43.49 2.17.59A2 2 0 0 1 21 15.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0xxx xxx xxx"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={isSubmitting}
              className="h-full w-full bg-transparent text-base text-white placeholder:text-[#9CA3AF] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.12em] text-[#9CA3AF]">
            Mat khau
          </label>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#1E2A3F] bg-[#101B2E] px-4 transition-colors duration-150 focus-within:border-[#06B6D4]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-[#22C55E]" fill="none">
              <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Nhap mat khau"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              className="h-full w-full bg-transparent text-base text-white placeholder:text-[#9CA3AF] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
              disabled={isSubmitting}
              className="rounded-lg p-1 text-[#9CA3AF] transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101B2E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.9 10.9 0 0 1 12 5c6 0 10 7 10 7a18.2 18.2 0 0 1-3.4 4.1M6.1 6.1A18.2 18.2 0 0 0 2 12s4 7 10 7c1.2 0 2.3-.2 3.3-.6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex justify-end">
            <a
              href="/auth/forgot-password"
              className="text-sm text-[#9CA3AF] underline-offset-4 transition-colors duration-150 hover:text-[#06B6D4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1728] rounded-sm"
            >
              Quen mat khau?
            </a>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-[#EF4444]/45 bg-[#EF4444]/10 px-3 py-2 text-sm text-[#FCA5A5]">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 w-full rounded-2xl bg-gradient-to-r from-[#22C55E] via-[#06B6D4] to-[#0EA5E9] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_-16px_rgba(6,182,212,0.95)] transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1728] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Dang dang nhap..." : "Dang nhap"}
      </button>

      <p className="text-center text-sm text-[#9CA3AF]">
        Chua co tai khoan?{" "}
        <a
          href="/auth/register"
          className="font-medium text-[#22C55E] underline-offset-4 transition-colors duration-150 hover:text-[#4ADE80] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1728] rounded-sm"
        >
          Dang ky ngay
        </a>
      </p>
    </form>
  );
}
