'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '@/app/image/logo6.webp';
import { useAuthApi } from '@/app/auth/hooks/useAuthApi';
import { AuthLottieShowcase } from '@/app/components/AuthLottieShowcase';
import { ClientHeader } from '@/app/components/client/header/navigation/ClientHeader';

function normalizePhoneNumber(rawPhone: string) {
  const digitsOnly = rawPhone.replace(/\D/g, '');

  if (digitsOnly.length === 9 && !digitsOnly.startsWith('0')) {
    return `0${digitsOnly}`;
  }

  return digitsOnly;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isSubmitting, error, clearError } = useAuthApi();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const checkTimeAndSetTheme = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 18 || currentHour < 6) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    checkTimeAndSetTheme();
    const interval = setInterval(checkTimeAndSetTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) clearError();
    if (formError) setFormError(null);

    const nextValue =
      e.target.name === 'phone'
        ? e.target.value.replace(/\D/g, '')
        : e.target.value;

    setFormData((prev) => ({ ...prev, [e.target.name]: nextValue }));
  };

  const handlePhoneBlur = () => {
    const normalizedPhone = normalizePhoneNumber(formData.phone);
    if (normalizedPhone !== formData.phone) {
      setFormData((prev) => ({ ...prev, phone: normalizedPhone }));
    }
  };

  // Kiểm tra dữ liệu đầu vào trước khi gọi API để chặn request rác từ phía client.
  const validateRegisterForm = () => {
    const fullName = `${formData.lastName} ${formData.firstName}`.trim();
    const phone = normalizePhoneNumber(formData.phone.trim());
    const email = formData.email.trim();
    const password = formData.password;

    if (!fullName || !phone || !email || !password) {
      return 'Vui lòng nhập đầy đủ thông tin đăng ký.';
    }

    if (!/^0\d{9}$/.test(phone)) {
      return 'Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx).';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Email không đúng định dạng.';
    }

    if (password.length < 6 || password.length > 20) {
      return 'Mật khẩu phải từ 6 đến 20 ký tự.';
    }

    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateRegisterForm();

    if (validationError) {
      // Dừng submit ngay khi dữ liệu không hợp lệ.
      setFormError(validationError);
      return;
    }

    try {
      clearError();
      setFormError(null);

      const normalizedPhone = normalizePhoneNumber(formData.phone.trim());
      setFormData((prev) => ({ ...prev, phone: normalizedPhone }));

      // Chuẩn hóa dữ liệu trước khi gửi để tránh lỗi do khoảng trắng/chữ hoa chữ thường.
      const payload = {
        fullName: `${formData.lastName} ${formData.firstName}`.trim(),
        phoneNumber: normalizedPhone,
        email: formData.email.trim().toLowerCase(),
        gender: 'OTHER' as const,
        password: formData.password,
      };

      await register(payload);

      console.log('Register thành công', {
        phoneNumber: payload.phoneNumber,
        email: payload.email,
      });

      router.push('/auth/login');
    } catch {
      // Error is handled by useAuthApi state
    }
  };

  return (
    <div className="auth-theme auth-page-shell relative isolate flex min-h-screen flex-col overflow-hidden transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              'radial-gradient(circle at 50% 100%, rgba(255, 138, 31, 0.14) 0%, transparent 58%), radial-gradient(circle at 50% 100%, rgba(255, 191, 82, 0.1) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(255, 227, 176, 0.08) 0%, transparent 82%), linear-gradient(180deg, #ffffff 0%, #fffcf8 58%, #fff8ef 100%)',
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              'radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%), radial-gradient(circle at 50% 100, rgba(99, 102, 241, 0.4) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%), #000000',
          }}
        />
        <div className="absolute left-[-12%] top-[-18%] h-80 w-80 rounded-full bg-orange-200/30 blur-3xl dark:bg-indigo-300/10" />
        <div className="absolute bottom-[-20%] right-[-10%] h-96 w-96 rounded-full bg-amber-200/30 blur-3xl dark:bg-indigo-100/10" />
      </div>

      <div className="hidden md:block">
        <ClientHeader />
      </div>

      <main className="flex flex-1 items-center justify-center px-4 py-8 md:px-6 md:py-10 lg:py-12">
        <section className="auth-card grid w-full max-w-6xl overflow-hidden rounded-[24px] backdrop-blur-xl transition-colors duration-500 md:grid-cols-[0.92fr_1fr]">
          <aside className="auth-hero-panel relative hidden min-h-[620px] overflow-hidden md:flex">
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
                  className="h-56 w-auto object-contain drop-shadow-2xl -mb-12"
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

              <AuthLottieShowcase
                title="Tạo tài khoản với chuyển động trực quan"
                subtitle="Khối minh họa Lottie mới được thêm vào để đồng bộ trải nghiệm giữa đăng ký và đăng nhập."
                badge="REGISTER MOTION"
                className="mt-8 w-full max-w-sm"
                compact
              />
            </div>
          </aside>

          <div className="auth-panel flex w-full flex-col justify-center px-5 py-8 transition-colors duration-500 sm:px-8 md:px-10 lg:px-12">
            <div className="mb-8 flex flex-col items-center justify-center md:hidden">
              <Image
                src={logo}
                alt="SMARTELEC Logo Mobile"
                className="h-36 w-auto object-contain drop-shadow-xl"
                priority
              />

              <div className="mt-2 flex flex-col items-center">
                <h1 className="auth-heading text-2xl font-extrabold tracking-[0.18em]">
                  SMARTELEC
                </h1>

                <div className="auth-accent-border mt-2 rounded-xl border bg-transparent px-3 py-1.5">
                  <p className="auth-accent-text text-[10px] font-bold uppercase tracking-[0.14em]">
                    AI diagnostic system
                  </p>
                </div>
              </div>

              <AuthLottieShowcase
                title="Khởi tạo tài khoản mới"
                subtitle="Animation Lottie được đưa vào giao diện đăng ký."
                badge="REGISTER MOTION"
                className="mt-6 w-full max-w-sm"
                compact
              />
            </div>

            <div className="mb-7">
              <div className="auth-success mb-4 inline-flex rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]">
                Tài khoản khách hàng
              </div>

              <h2 className="auth-heading text-[28px] font-semibold leading-tight tracking-[-0.03em] md:text-[32px]">
                Tạo tài khoản mới
              </h2>

              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[var(--auth-muted-text)]">
                Điền thông tin cơ bản để sử dụng AI chat, lưu lịch sử yêu cầu
                và theo dõi trạng thái sửa chữa.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                    Họ của bạn
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="VD: Nguyễn"
                    className="auth-input auth-input-focus h-11 w-full rounded-2xl border px-4 text-sm font-medium outline-none transition-all placeholder:font-medium"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                    Tên của bạn
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="VD: Trường Quý"
                    className="auth-input auth-input-focus h-11 w-full rounded-2xl border px-4 text-sm font-medium outline-none transition-all placeholder:font-medium"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handlePhoneBlur}
                  inputMode="numeric"
                  placeholder="VD: 912345678 hoặc 0912345678"
                  className="auth-input auth-input-focus h-11 w-full rounded-2xl border px-4 text-sm font-medium outline-none transition-all placeholder:font-medium"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="smartelec@example.com"
                  className="auth-input auth-input-focus h-11 w-full rounded-2xl border px-4 text-sm font-medium outline-none transition-all placeholder:font-medium"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="auth-label mb-2 block text-xs font-bold uppercase tracking-[0.11em]">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tạo mật khẩu an toàn"
                  className="auth-input auth-input-focus h-11 w-full rounded-2xl border px-4 text-sm font-medium outline-none transition-all placeholder:font-medium"
                  disabled={isSubmitting}
                />
              </div>

              {formError ? (
                <p className="auth-error rounded-2xl border px-4 py-3 text-sm font-semibold">
                  {formError}
                </p>
              ) : null}

              {error ? (
                <p className="auth-error rounded-2xl border px-4 py-3 text-sm font-semibold">
                  {error.message || 'Đăng ký thất bại. Vui lòng thử lại.'}
                </p>
              ) : null}

              <div className="auth-soft-panel mt-1 flex items-start gap-3 rounded-2xl border px-4 py-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--auth-input-border)] text-[var(--auth-primary)] focus:ring-[var(--auth-primary)]"
                />

                <label
                  htmlFor="terms"
                  className="text-xs font-medium leading-6 text-[var(--auth-muted-text)]"
                >
                  Tôi đồng ý với các{' '}
                  <a href="#" className="auth-link font-bold hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="auth-link font-bold hover:underline">
                    Chính sách bảo mật
                  </a>{' '}
                  của SMARTELEC.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="auth-accent-gradient auth-accent-shadow auth-cta-text mt-1 h-11 w-full rounded-2xl text-sm font-extrabold uppercase tracking-[0.08em] transition-all hover:-translate-y-px hover:opacity-95 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
              >
                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ TÀI KHOẢN'}
              </button>
            </form>

            <div className="mt-7 text-center text-sm font-semibold text-[var(--auth-muted-text)]">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="auth-link cursor-pointer font-bold transition-colors hover:underline"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
