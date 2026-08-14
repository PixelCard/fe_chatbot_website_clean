"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Eye,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldAlert,
  ShieldCheck,
  User,
  VenusAndMars,
  X,
} from "lucide-react";

import { useAuthApi } from "@/app/auth/hooks/useAuthApi";
import type { UserProfileResponse } from "@/app/auth/services/auth.service";
import { APP_ROUTES } from "@/app/config/routes";
import { ClientHeader } from "@/app/components/client/header/navigation/ClientHeader";
import { useUploadApi } from "@/app/hooks/common/useUploadApi";
import AdminToastStack, {
  type AdminToast,
} from "@/app/components/admin/AdminToastStack";

type ProfileFormState = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER";
};

type CompletionFormState = {
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
};

const EMPTY_FORM: ProfileFormState = {
  fullName: "",
  phoneNumber: "",
  email: "",
  address: "",
  gender: "OTHER",
};

const EMPTY_COMPLETION_FORM: CompletionFormState = {
  phoneNumber: "",
  newPassword: "",
  confirmPassword: "",
};

function toFormState(profile: UserProfileResponse): ProfileFormState {
  return {
    fullName: profile.fullName ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    email: profile.email ?? "",
    address: profile.address ?? "",
    gender: profile.gender ?? "OTHER",
  };
}

function getAvatarInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials || "KH";
}

function normalizeAvatarUrl(value?: string | null) {
  return value?.trim() ?? "";
}

function hasTemporarySocialPhone(phoneNumber?: string | null) {
  return Boolean(
    phoneNumber &&
      (phoneNumber.startsWith("ZALO_") || phoneNumber.startsWith("GOOGLE_")),
  );
}

function FieldLabel({
  icon: Icon,
  children,
  required,
}: {
  icon: LucideIcon;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2.5 flex items-center gap-2 text-[17px] font-black text-slate-900 dark:text-slate-100">
      <Icon className="h-5 w-5 text-orange-500 dark:text-cyan-400" strokeWidth={2.3} />
      <span>{children}</span>
      {required ? <span className="font-bold text-rose-500">*</span> : null}
    </label>
  );
}

function FormMessage({
  type,
  children,
}: {
  type: "error" | "success";
  children: ReactNode;
}) {
  const isSuccess = type === "success";

  return (
    <div
      className={[
        "flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-sm transition-all",
        isSuccess
          ? "border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
      ].join(" ")}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
      )}

      <p className="text-sm font-bold leading-6">{children}</p>
    </div>
  );
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const {
    getProfile,
    updateProfile,
    setPassword,
    requestEmailVerificationOtp,
    verifyEmailOtp,
    isSubmitting,
    error,
    clearError,
  } = useAuthApi();
  const {
    uploadMedia,
    isSubmitting: isUploadingAvatar,
    error: uploadError,
    clearError: clearUploadError,
  } = useUploadApi();

  const [initialProfile, setInitialProfile] =
    useState<UserProfileResponse | null>(null);
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
  const [completionForm, setCompletionForm] = useState<CompletionFormState>(
    EMPTY_COMPLETION_FORM,
  );
  const [avatarUrl, setAvatarUrl] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpRequested, setEmailOtpRequested] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const pushToast = (type: AdminToast["type"], text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const token = window.localStorage.getItem("accessToken");

      if (!token) {
        router.replace(APP_ROUTES.Auth.LOGIN);
        return;
      }

      try {
        setIsLoadingProfile(true);
        setPageError(null);

        const profileData = await getProfile(token);

        if (!isMounted) return;

        setInitialProfile(profileData);
        setForm(toFormState(profileData));
        setAvatarUrl(normalizeAvatarUrl(profileData.avatarUrl));
      } catch (nextError) {
        if (!isMounted) return;

        const message =
          nextError instanceof Error
            ? nextError.message
            : "Không thể tải thông tin cá nhân. Vui lòng đăng nhập lại.";

        setPageError(message);
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [getProfile, router]);

  const avatarInitials = useMemo(
    () => getAvatarInitials(form.fullName || initialProfile?.fullName || "KH"),
    [form.fullName, initialProfile?.fullName],
  );

  const isCurrentEmailVerified = useMemo(() => {
    if (!initialProfile) return false;
    const sameEmail =
      form.email.trim().toLowerCase() ===
      (initialProfile.email ?? "").trim().toLowerCase();
    return Boolean(sameEmail && initialProfile.isVerified);
  }, [form.email, initialProfile]);

  const requiresAccountCompletion = useMemo(() => {
    return hasTemporarySocialPhone(initialProfile?.phoneNumber);
  }, [initialProfile?.phoneNumber]);

  const isDirty = useMemo(() => {
    if (!initialProfile) return false;

    const initialAvatar = normalizeAvatarUrl(initialProfile.avatarUrl);
    const hasAvatarChanged = avatarUrl !== initialAvatar;

    const isProfileDirty =
      form.fullName.trim() !== (initialProfile.fullName ?? "").trim() ||
      form.email.trim().toLowerCase() !==
        (initialProfile.email ?? "").trim().toLowerCase() ||
      form.address.trim() !== (initialProfile.address ?? "").trim() ||
      form.gender !== (initialProfile.gender ?? "OTHER");

    return isProfileDirty || hasAvatarChanged;
  }, [avatarUrl, form, initialProfile]);

  const isBusy = isSubmitting || isUploadingAvatar;

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (error) clearError();
    if (pageError) setPageError(null);
    if (successMessage) setSuccessMessage(null);

    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "email") {
      setEmailOtp("");
      setEmailOtpRequested(false);
    }
  };

  const handleCompletionChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (error) clearError();
    if (pageError) setPageError(null);
    if (successMessage) setSuccessMessage(null);

    const { name, value } = event.target;

    setCompletionForm((current) => ({
      ...current,
      [name]: name === "phoneNumber" ? value.replace(/\D/g, "") : value,
    }));
  };

  const validateForm = () => {
    if (!form.fullName.trim()) return "Vui lòng nhập họ tên.";
    if (!form.email.trim()) return "Vui lòng nhập email.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Email không đúng định dạng.";
    }

    return null;
  };

  const validateCompletionForm = () => {
    if (!requiresAccountCompletion) {
      return null;
    }

    if (!/^0\d{9}$/.test(completionForm.phoneNumber.trim())) {
      return "Số điện thoại phải có 10 số và bắt đầu bằng số 0.";
    }

    if (
      completionForm.newPassword.length < 6 ||
      completionForm.newPassword.length > 20
    ) {
      return "Mật khẩu phải từ 6 đến 20 ký tự.";
    }

    if (completionForm.newPassword !== completionForm.confirmPassword) {
      return "Xác nhận mật khẩu không khớp.";
    }

    return null;
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (error) clearError();
    if (uploadError) clearUploadError();
    if (pageError) setPageError(null);
    if (successMessage) setSuccessMessage(null);

    if (!file.type.startsWith("image/")) {
      const msg = "Vui lòng chọn file ảnh hợp lệ.";
      setPageError(msg);
      pushToast("error", msg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = "Ảnh đại diện phải nhỏ hơn hoặc bằng 5MB.";
      setPageError(msg);
      pushToast("error", msg);
      return;
    }

    try {
      const result = await uploadMedia(file);
      setAvatarUrl(normalizeAvatarUrl(result.url));
      pushToast("success", "Đã tải lên ảnh đại diện mới thành công!");
    } catch (err) {
      pushToast("error", "Tải lên ảnh đại diện thất bại.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = window.localStorage.getItem("accessToken");

    if (!token) {
      router.replace(APP_ROUTES.Auth.LOGIN);
      return;
    }

    const validationMessage = validateForm();

    if (validationMessage) {
      setPageError(validationMessage);
      pushToast("warning", validationMessage);
      return;
    }

    try {
      clearError();
      setPageError(null);
      setSuccessMessage(null);

      const updatedProfile = await updateProfile(token, {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        address: form.address.trim(),
        gender: form.gender,
        avatarUrl: avatarUrl || undefined,
      });

      setInitialProfile(updatedProfile);
      setForm(toFormState(updatedProfile));
      setAvatarUrl(normalizeAvatarUrl(updatedProfile.avatarUrl) || avatarUrl);

      window.localStorage.setItem(
        "user_profile",
        JSON.stringify({
          name: updatedProfile.fullName ?? form.fullName.trim(),
          email: updatedProfile.email ?? form.email.trim().toLowerCase(),
          avatarUrl:
            normalizeAvatarUrl(updatedProfile.avatarUrl) || avatarUrl || null,
        }),
      );

      setSuccessMessage("Cập nhật thông tin thành công.");
      pushToast("success", "Đã lưu và cập nhật thông tin cá nhân thành công!");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Cập nhật thông tin thất bại.";
      pushToast("error", msg);
    }
  };

  const handleRequestEmailOtp = async () => {
    const validationMessage = validateForm();

    if (validationMessage) {
      setPageError(validationMessage);
      return;
    }

    try {
      clearError();
      setPageError(null);
      setSuccessMessage(null);
      await requestEmailVerificationOtp();
      setEmailOtpRequested(true);
      setSuccessMessage("Mã OTP xác minh email đã được gửi.");
    } catch {
      // Error state is handled by useAuthApi.
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!/^\d{6}$/.test(emailOtp.trim())) {
      setPageError("OTP phải gồm 6 chữ số.");
      return;
    }

    try {
      clearError();
      setPageError(null);
      setSuccessMessage(null);
      await verifyEmailOtp(emailOtp.trim());
      setInitialProfile((current) =>
        current ? { ...current, isVerified: true } : current,
      );
      setEmailOtp("");
      setEmailOtpRequested(false);
      setSuccessMessage("Email đã được xác minh.");
    } catch {
      // Error state is handled by useAuthApi.
    }
  };

  return (
    <div className="auth-theme auth-page-shell min-h-screen bg-[#FFFBF7] font-sans text-slate-900 transition-colors dark:bg-[#070F1E] dark:text-slate-100">
      <div className="hidden md:block">
        <ClientHeader />
      </div>

      <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Header Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:bg-slate-800 dark:hover:text-cyan-400"
              aria-label="Quay lại trang chủ"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Hồ sơ cá nhân
              </h1>
              <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
                Quản lý thông tin tài khoản, địa chỉ nhận thiết bị và bảo mật
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={[
                "inline-flex items-center gap-2.5 rounded-full border px-4.5 py-2 text-xs font-black shadow-sm backdrop-blur-sm transition-all",
                isDirty
                  ? "border-orange-400/80 bg-orange-100/90 text-orange-950 shadow-orange-500/10 dark:border-amber-500/50 dark:bg-amber-500/20 dark:text-amber-200"
                  : "border-emerald-500/60 bg-emerald-100/90 text-emerald-900 shadow-emerald-500/10 dark:border-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-200",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full animate-pulse shrink-0",
                  isDirty ? "bg-orange-600 dark:bg-orange-400" : "bg-emerald-600 dark:bg-emerald-400",
                ].join(" ")}
              />
              {isDirty ? "Chưa lưu thay đổi" : "Đã đồng bộ hệ thống"}
            </span>
          </div>
        </div>

        {isLoadingProfile ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 dark:text-cyan-400" />
            <p className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white">
              Đang tải dữ liệu hồ sơ...
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Vui lòng chờ trong giây lát.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Avatar & Overview Card */}
            <div className="space-y-6 lg:col-span-4">
              <section className="relative overflow-hidden rounded-3xl border border-orange-200/90 bg-white shadow-[0_16px_40px_-8px_rgba(249,115,22,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                {/* Cover Banner Header */}
                <div className="h-24 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-600 dark:from-cyan-700 dark:via-blue-800 dark:to-indigo-900" />

                <div className="px-6 pb-6 pt-0">
                  <div className="flex flex-col items-center text-center">
                    {/* Overlapping Avatar Frame */}
                    <div className="group relative -mt-12 shrink-0">
                      {avatarUrl ? (
                        <div className="relative h-28 w-28 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl ring-4 ring-black/5 dark:border-[#0D1527] dark:bg-[#0D1527] dark:ring-white/10">
                          <img
                            src={avatarUrl}
                            alt="Ảnh đại diện"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                          />
                          <button
                            type="button"
                            onClick={() => setIsAvatarPreviewOpen(true)}
                            className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Xem ảnh đại diện"
                          >
                            <Eye className="h-6 w-6 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-orange-500 to-amber-600 text-3xl font-black text-white shadow-2xl ring-4 ring-black/5 dark:border-[#0D1527] dark:from-cyan-600 dark:to-blue-800 dark:ring-white/10">
                          {avatarInitials}
                        </div>
                      )}

                      <label
                        htmlFor="profile-avatar-upload"
                        className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-2xl border-2 border-white bg-orange-600 text-white shadow-lg transition hover:scale-105 hover:bg-orange-700 active:scale-95 dark:border-[#0D1527] dark:bg-cyan-500 dark:hover:bg-cyan-600"
                        title="Đổi ảnh đại diện"
                      >
                        {isUploadingAvatar ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </label>

                      <input
                        id="profile-avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        disabled={isBusy}
                      />
                    </div>

                    <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
                      {form.fullName || "Khách hàng"}
                    </h2>

                    <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                      {form.phoneNumber || "Chưa đăng ký SĐT"}
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1.5 text-sm font-black text-orange-800 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
                        Khách hàng
                      </span>

                      {isCurrentEmailVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-black text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <ShieldCheck className="h-4 w-4" />
                          Đã xác minh
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-sm font-black text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                          <ShieldAlert className="h-4 w-4" />
                          Chưa xác minh Email
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-slate-600 dark:text-slate-300">Mức độ hoàn thiện:</span>
                        <span className="text-base font-black text-orange-600 dark:text-cyan-400">
                          {form.address ? "100%" : "80%"}
                        </span>
                      </div>

                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 dark:from-cyan-500 dark:to-blue-600"
                          style={{ width: form.address ? "100%" : "80%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Update Form Card */}
            <div className="space-y-6 lg:col-span-8">
              <section className="rounded-3xl border border-orange-200/90 bg-white p-6 shadow-[0_16px_40px_-8px_rgba(249,115,22,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  Thông tin cá nhân & Liên hệ
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Cập nhật thông tin để nhận tư vấn kỹ thuật và giao nhận máy móc sửa chữa nhanh chóng.
                </p>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldLabel icon={User} required>
                        Họ và tên
                      </FieldLabel>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-base font-bold text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/15 dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:focus:border-cyan-500 dark:focus:bg-slate-950 dark:focus:ring-cyan-500/20"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <FieldLabel icon={Mail} required>
                        Địa chỉ Email
                      </FieldLabel>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-base font-bold text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/15 dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:focus:border-cyan-500 dark:focus:bg-slate-950 dark:focus:ring-cyan-500/20"
                        disabled={isSubmitting}
                      />

                      <div className="mt-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                        {isCurrentEmailVerified ? (
                          <div className="flex items-center gap-2 text-sm font-black text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-5 w-5" />
                            Email đã được xác minh thành công
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <button
                              type="button"
                              onClick={() => void handleRequestEmailOtp()}
                              disabled={isBusy || !form.email.trim()}
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-orange-300 bg-white px-4 text-sm font-black text-orange-700 shadow-sm transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-500/30 dark:bg-slate-900 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                            >
                              {emailOtpRequested ? "Gửi lại OTP" : "Gửi OTP xác minh"}
                            </button>

                            {emailOtpRequested ? (
                              <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={emailOtp}
                                  onChange={(event) =>
                                    setEmailOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                                  }
                                  placeholder="Nhập OTP 6 số"
                                  className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-center text-sm font-black tracking-[0.18em] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-500"
                                  disabled={isBusy}
                                />

                                <button
                                  type="button"
                                  onClick={() => void handleVerifyEmailOtp()}
                                  disabled={isBusy || emailOtp.length !== 6}
                                  className="inline-flex h-10 items-center justify-center rounded-xl bg-orange-600 px-5 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                                >
                                  Xác minh
                                </button>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <FieldLabel icon={VenusAndMars}>Giới tính</FieldLabel>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-base font-bold text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/15 dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:focus:border-cyan-500 dark:focus:bg-slate-950 dark:focus:ring-cyan-500/20"
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel icon={Phone}>Số điện thoại chính</FieldLabel>
                      <div className="relative">
                        <input
                          name="phoneNumber"
                          value={form.phoneNumber}
                          readOnly
                          className="h-[52px] w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100/70 px-4 pr-28 text-base font-bold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300"
                        />
                        <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          <LockKeyhole className="h-4 w-4 text-slate-500" />
                          Đã khóa
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Số điện thoại dùng làm định danh hệ thống và không thể sửa đổi trực tiếp.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel icon={MapPin}>
                        Địa chỉ nhận thiết bị / giao hàng
                      </FieldLabel>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-bold leading-7 text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/15 dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:focus:border-cyan-500 dark:focus:bg-slate-950 dark:focus:ring-cyan-500/20"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Form Messages */}
                  <div className="space-y-3">
                    {pageError ? (
                      <FormMessage type="error">{pageError}</FormMessage>
                    ) : null}

                    {error ? (
                      <FormMessage type="error">
                        {error.message || "Cập nhật thất bại. Vui lòng thử lại."}
                      </FormMessage>
                    ) : null}

                    {uploadError ? (
                      <FormMessage type="error">
                        {uploadError.message || "Tải ảnh đại diện thất bại. Vui lòng thử lại."}
                      </FormMessage>
                    ) : null}

                    {successMessage ? (
                      <FormMessage type="success">{successMessage}</FormMessage>
                    ) : null}
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 text-base font-black text-slate-800 transition hover:border-orange-300 hover:bg-orange-50/60 hover:text-orange-600 active:scale-95 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-cyan-500/40"
                      disabled={isBusy}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Hủy bỏ
                    </button>

                    <button
                      type="submit"
                      disabled={isBusy || !isDirty}
                      className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 text-base font-black text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/35 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none dark:from-cyan-600 dark:to-blue-700 dark:shadow-cyan-600/25"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Avatar Modal Preview */}
      {isAvatarPreviewOpen && avatarUrl ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsAvatarPreviewOpen(false)}
            className="absolute inset-0 cursor-default"
            aria-label="Đóng xem ảnh đại diện"
          />

          <div className="relative flex max-h-[90vh] max-w-[90vw] items-start justify-center">
            <img
              src={avatarUrl}
              alt="Ảnh đại diện cỡ lớn"
              className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={() => setIsAvatarPreviewOpen(false)}
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-black/80"
              aria-label="Đóng ảnh đại diện"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}

      <AdminToastStack
        toasts={toasts}
        onRemove={(id) =>
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </div>
  );
}
