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
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  VenusAndMars,
  X,
} from "lucide-react";

import { useAuthApi } from "@/app/auth/hooks/useAuthApi";
import type { UserProfileResponse } from "@/app/auth/services/auth.service";
import { APP_ROUTES } from "@/app/config/routes";
import { ClientHeader } from "@/app/components/client/header/navigation/ClientHeader";
import { useUploadApi } from "@/app/hooks/common/useUploadApi";

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
    <label className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-slate-700 dark:text-slate-200">
      <Icon className="h-4 w-4 text-orange-500 dark:text-blue-300" />
      <span>{children}</span>
      {required ? <span className="font-bold text-red-500">*</span> : null}
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
        "flex items-start gap-3 rounded-2xl border px-4 py-3",
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
      ].join(" ")}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      )}

      <p className="text-[14px] font-semibold leading-6">{children}</p>
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

  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
  const [completionForm, setCompletionForm] = useState<CompletionFormState>(
    EMPTY_COMPLETION_FORM,
  );
  const [initialProfile, setInitialProfile] =
    useState<UserProfileResponse | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpRequested, setEmailOtpRequested] = useState(false);
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("accessToken");

    if (!token) {
      router.replace(APP_ROUTES.Auth.LOGIN);
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setPageError(null);

      try {
        const profile = await getProfile(token);

        if (!isMounted) return;

        setInitialProfile(profile);
        setForm(toFormState(profile));
        setCompletionForm({
          phoneNumber: hasTemporarySocialPhone(profile.phoneNumber)
            ? ""
            : profile.phoneNumber ?? "",
          newPassword: "",
          confirmPassword: "",
        });
        setAvatarUrl(normalizeAvatarUrl(profile.avatarUrl));
      } catch (loadError) {
        if (!isMounted) return;

        const message =
          loadError instanceof Error
            ? loadError.message
            : "Không tải được thông tin tài khoản.";

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

  const isDirty = useMemo(() => {
    if (!initialProfile) return false;

    const initialForm = toFormState(initialProfile);
    return (
      JSON.stringify(form) !== JSON.stringify(initialForm) ||
      normalizeAvatarUrl(initialProfile.avatarUrl) !== avatarUrl
    );
  }, [avatarUrl, form, initialProfile]);

  const avatarInitials = getAvatarInitials(form.fullName);
  const isBusy = isSubmitting || isUploadingAvatar;
  const requiresAccountCompletion = Boolean(
    initialProfile?.needsPassword || hasTemporarySocialPhone(initialProfile?.phoneNumber),
  );
  const isCurrentEmailVerified = Boolean(
    initialProfile?.isVerified &&
      initialProfile.email?.trim().toLowerCase() === form.email.trim().toLowerCase(),
  );

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
      setPageError("Vui lòng chọn file ảnh hợp lệ.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPageError("Ảnh đại diện phải nhỏ hơn hoặc bằng 5MB.");
      return;
    }

    try {
      const result = await uploadMedia(file);
      setAvatarUrl(normalizeAvatarUrl(result.url));
    } catch {
      // Upload error state is handled by useUploadApi.
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
    } catch {
      // Error state is handled by useAuthApi.
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
    <div className="auth-theme auth-page-shell min-h-screen overflow-x-hidden font-sans transition-colors">
      <div className="hidden md:block">
        <ClientHeader />
      </div>

      <main className="mx-auto w-full max-w-[780px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:text-orange-600 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/40"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-[clamp(22px,2.6vw,30px)] font-bold leading-tight tracking-[-0.035em] text-slate-950 dark:text-white">
                Thông tin cá nhân
              </h1>

              {/* <p className="mt-1 max-w-2xl text-[14px] font-medium leading-6 text-slate-500 dark:text-slate-400">
                Cập nhật thông tin liên hệ để việc tư vấn và tiếp nhận sửa chữa
                thuận tiện hơn.
              </p> */}
            </div>
          </div>

          {/* <div
            className={[
              "inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold",
              isDirty
                ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
            ].join(" ")}
          >
            <span
              className={[
                "h-2 w-2 rounded-full",
                isDirty ? "bg-orange-500" : "bg-emerald-500",
              ].join(" ")}
            />
            {isDirty ? "Chưa lưu" : "Đã cập nhật"}
          </div> */}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-4 border-b border-slate-200/80 bg-gradient-to-r from-orange-50/80 via-amber-50/40 to-transparent px-5 py-5 dark:border-slate-700/60 dark:from-blue-950/40 dark:via-slate-900/20 dark:to-transparent sm:px-6">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <button
                  type="button"
                  onClick={() => setIsAvatarPreviewOpen(true)}
                  className="block rounded-2xl shadow-md ring-2 ring-white/60 transition hover:scale-[1.04] hover:shadow-lg dark:ring-slate-800/60"
                  aria-label="Xem ảnh đại diện cỡ lớn"
                >
                  <img
                    src={avatarUrl}
                    alt="Ảnh đại diện"
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-orange-200/50 dark:ring-blue-500/30"
                  />
                </button>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md ring-2 ring-orange-200/50 dark:from-blue-600 dark:to-blue-800 dark:ring-blue-500/30">
                  <span className="text-xl font-bold tracking-[-0.04em] text-white">
                    {avatarInitials}
                  </span>
                </div>
              )}

              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-white bg-emerald-500 dark:border-slate-900">
                <CheckCircle2
                  className="h-3.5 w-3.5 text-white"
                  strokeWidth={3}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[18px] font-bold leading-6 text-slate-950 dark:text-white">
                {form.fullName || "Chưa cập nhật tên"}
              </h2>

              <p className="mt-0.5 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {form.phoneNumber || "Chưa có SĐT"}
              </p>
            </div>

            <label
              htmlFor="profile-avatar-upload"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl border border-orange-200/70 bg-gradient-to-b from-white to-orange-50/60 px-4 py-2.5 text-[13px] font-semibold text-orange-700 shadow-sm transition hover:border-orange-300 hover:shadow-md active:scale-[0.97] dark:border-blue-500/25 dark:from-slate-800 dark:to-blue-950/40 dark:text-blue-200 dark:hover:border-blue-400/40"
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {isUploadingAvatar ? "Đang tải..." : "Đổi ảnh"}
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

          {isLoadingProfile ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500 dark:text-blue-300" />

              <p className="mt-5 text-[18px] font-bold text-slate-950 dark:text-white">
                Đang tải thông tin...
              </p>

              <p className="mt-2 text-[15px] font-medium text-slate-500 dark:text-slate-400">
                Vui lòng chờ trong giây lát.
              </p>
            </div>
          ) : (
            <form className="px-5 py-5 sm:px-6" onSubmit={handleSubmit}>
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
                        className="h-[50px] w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 text-[15px] font-medium text-slate-900 outline-none transition hover:border-slate-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/15 dark:border-slate-700/80 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950/80 dark:focus:ring-blue-500/20"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <FieldLabel icon={Mail} required>
                        Email
                      </FieldLabel>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="h-[50px] w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 text-[15px] font-medium text-slate-900 outline-none transition hover:border-slate-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/15 dark:border-slate-700/80 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950/80 dark:focus:ring-blue-500/20"
                        disabled={isSubmitting}
                      />

                      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40">
                        {isCurrentEmailVerified ? (
                          <div className="flex items-center gap-2 text-[13px] font-bold text-emerald-600 dark:text-emerald-300">
                            <CheckCircle2 className="h-4 w-4" />
                            Email đã xác minh
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <button
                              type="button"
                              onClick={() => void handleRequestEmailOtp()}
                              disabled={isBusy || !form.email.trim()}
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-orange-200 bg-white px-4 text-[13px] font-bold text-orange-700 transition hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-500/30 dark:bg-slate-900 dark:text-blue-200 dark:hover:bg-blue-500/10"
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
                                  className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-center text-[14px] font-bold tracking-[0.18em] text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                                  disabled={isBusy}
                                />

                                <button
                                  type="button"
                                  onClick={() => void handleVerifyEmailOtp()}
                                  disabled={isBusy || emailOtp.length !== 6}
                                  className="inline-flex h-10 items-center justify-center rounded-xl bg-orange-500 px-4 text-[13px] font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
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
                        className="h-[50px] w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 text-[15px] font-medium text-slate-900 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/15 dark:border-slate-700/80 dark:bg-slate-950/50 dark:text-white dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950/80 dark:focus:ring-blue-500/20"
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel icon={Phone}>Số điện thoại</FieldLabel>

                      <div className="relative">
                        <input
                          name="phoneNumber"
                          value={form.phoneNumber}
                          readOnly
                          className="h-[50px] w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 pr-24 text-[15px] font-medium text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300"
                        />

                        <span className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                          <LockKeyhole className="h-3.5 w-3.5" />
                          Khóa
                        </span>
                      </div>

                      <p className="mt-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                        Số điện thoại đăng ký không thể thay đổi.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel icon={MapPin}>
                        Địa chỉ nhận thiết bị / liên hệ
                      </FieldLabel>

                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP..."
                        className="w-full resize-none rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[15px] font-medium leading-7 text-slate-900 outline-none transition hover:border-slate-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/15 dark:border-slate-700/80 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950/80 dark:focus:ring-blue-500/20"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {pageError ? (
                      <FormMessage type="error">{pageError}</FormMessage>
                    ) : null}

                    {error ? (
                      <FormMessage type="error">
                        {error.message ||
                          "Cập nhật thất bại. Vui lòng thử lại."}
                      </FormMessage>
                    ) : null}

                    {uploadError ? (
                      <FormMessage type="error">
                        {uploadError.message ||
                          "Tải ảnh đại diện thất bại. Vui lòng thử lại."}
                      </FormMessage>
                    ) : null}

                    {successMessage ? (
                      <FormMessage type="success">{successMessage}</FormMessage>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="inline-flex h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-[15px] font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:border-blue-500/40"
                      disabled={isBusy}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Quay lại
                    </button>

                    <button
                      type="submit"
                      disabled={isBusy || !isDirty}
                      className="inline-flex h-[48px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(255,138,31,0.3)] transition hover:from-orange-600 hover:to-orange-700 hover:shadow-[0_12px_32px_rgba(255,138,31,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none dark:from-blue-600 dark:to-blue-800 dark:shadow-[0_8px_24px_rgba(37,99,235,0.3)] dark:hover:from-blue-700 dark:hover:to-blue-900"
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
              )}
        </div>
      </main>

      {isAvatarPreviewOpen && avatarUrl ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/82 px-4 py-6 backdrop-blur-sm">
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
              className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
            />

            <button
              type="button"
              onClick={() => setIsAvatarPreviewOpen(false)}
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition hover:bg-black/75"
              aria-label="Đóng ảnh đại diện"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
