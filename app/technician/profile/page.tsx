"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, LockKeyhole, Star, UserCircle, Wrench, XCircle } from "lucide-react";
import type { ApiError } from "@/app/services/apiClient";
import type { ChatSessionItem, ReviewItem, UserMutationResponse } from "@/app/services/common";
import { technicianService } from "../services/technician.service";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const EMPTY_PASSWORD_FORM: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getErrorMessage(error: unknown) {
  return (
    (error as ApiError | undefined)?.message ||
    (error instanceof Error ? error.message : "Không thể tải dữ liệu kỹ thuật viên.")
  );
}

export default function TechnicianProfilePage() {
  const [profile, setProfile] = useState<UserMutationResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [completedJobs, setCompletedJobs] = useState<ChatSessionItem[]>([]);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(EMPTY_PASSWORD_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTechnicianProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [nextProfile, nextReviews, nextCompletedJobs] = await Promise.all([
          technicianService.getProfile(),
          technicianService.getReviews(),
          technicianService.getCompletedJobs(),
        ]);

        if (!isMounted) return;

        setProfile(nextProfile);
        setReviews(nextReviews);
        setCompletedJobs(nextCompletedJobs);
      } catch (loadError) {
        if (isMounted) setError(getErrorMessage(loadError));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadTechnicianProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (passwordForm.newPassword.length < 6 || passwordForm.newPassword.length > 20) {
      setError("Mật khẩu mới phải từ 6 đến 20 ký tự.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }

    setIsSavingPassword(true);

    try {
      await technicianService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(EMPTY_PASSWORD_FORM);
      setSuccessMessage("Đổi mật khẩu thành công.");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-6 text-center text-sm text-[#94A3B8]">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#22D3EE]" />
        <p className="mt-3 font-semibold">Đang tải hồ sơ kỹ thuật viên...</p>
      </section>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#06B6D4]/10 text-[#22D3EE]">
              <UserCircle className="h-9 w-9" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22D3EE]">
                Hồ sơ kỹ thuật viên
              </p>
              <h2 className="mt-1 truncate text-2xl font-semibold text-white">
                {profile?.fullName || "Chưa cập nhật tên"}
              </h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                {profile?.phoneNumber || "Chưa có số điện thoại"}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="Đơn hoàn thành" value={completedJobs.length} />
            <Metric label="Đánh giá" value={reviews.length} />
            <Metric label="Điểm trung bình" value={profile?.averageRating?.toFixed(1) ?? "0.0"} />
          </div>
        </div>

        <div className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-5">
          <h3 className="text-lg font-semibold text-white">Đánh giá gần đây</h3>
          <div className="mt-4 space-y-3">
            {reviews.length ? (
              reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
                  <div className="flex items-center gap-1 text-amber-300">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#D1D5DB]">
                    {review.comment || "Khách hàng không để lại nhận xét."}
                  </p>
                  <p className="mt-2 text-xs font-medium text-[#64748B]">
                    {new Date(review.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-[#1E2A3F] bg-[#07111F]/70 p-4 text-sm text-[#94A3B8]">
                Chưa có đánh giá nào.
              </p>
            )}
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <section className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-5">
          <h3 className="text-lg font-semibold text-white">Thông tin liên hệ</h3>
          <div className="mt-4 space-y-3 text-sm text-[#D1D5DB]">
            <InfoRow label="Email" value={profile?.email || "Chưa cập nhật"} />
            <InfoRow label="Địa chỉ" value={profile?.address || "Chưa cập nhật"} />
            <InfoRow label="Trạng thái" value={profile?.isOnline ? "Đang online" : "Offline"} />
          </div>
        </section>

        <section className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <LockKeyhole className="h-5 w-5 text-[#22D3EE]" />
            Đổi mật khẩu
          </h3>

          <form className="mt-4 space-y-3" onSubmit={handleChangePassword}>
            <PasswordInput
              placeholder="Mật khẩu hiện tại"
              value={passwordForm.currentPassword}
              onChange={(value) =>
                setPasswordForm((current) => ({ ...current, currentPassword: value }))
              }
            />
            <PasswordInput
              placeholder="Mật khẩu mới"
              value={passwordForm.newPassword}
              onChange={(value) =>
                setPasswordForm((current) => ({ ...current, newPassword: value }))
              }
            />
            <PasswordInput
              placeholder="Nhập lại mật khẩu mới"
              value={passwordForm.confirmPassword}
              onChange={(value) =>
                setPasswordForm((current) => ({ ...current, confirmPassword: value }))
              }
            />

            {error ? <Message tone="error">{error}</Message> : null}
            {successMessage ? <Message tone="success">{successMessage}</Message> : null}

            <button
              type="submit"
              disabled={isSavingPassword}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#06B6D4] px-4 text-sm font-semibold text-[#07111F] transition hover:bg-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu mật khẩu"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-[#1E2A3F] bg-[#101B2E] p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Wrench className="h-5 w-5 text-[#22D3EE]" />
            Đơn hoàn thành
          </h3>
          <div className="mt-4 space-y-2">
            {completedJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="rounded-xl border border-[#1E2A3F] bg-[#07111F] px-3 py-2">
                <p className="text-sm font-semibold text-white">Đơn #{job.id}</p>
                <p className="mt-1 truncate text-xs text-[#94A3B8]">
                  {job.deviceType || job.symptom || "Thiết bị chưa cập nhật"}
                </p>
              </div>
            ))}
            {!completedJobs.length ? (
              <p className="text-sm text-[#94A3B8]">Chưa có đơn hoàn thành.</p>
            ) : null}
          </div>
        </section>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#1E2A3F] bg-[#07111F] px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
      <p className="mt-1 break-words font-medium text-[#D1D5DB]">{value}</p>
    </div>
  );
}

function PasswordInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="password"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-[#1E2A3F] bg-[#07111F] px-3 text-sm font-medium text-white outline-none placeholder:text-[#64748B] focus:border-[#22D3EE]/70 focus:ring-2 focus:ring-[#22D3EE]/20"
    />
  );
}

function Message({ tone, children }: { tone: "success" | "error"; children: string }) {
  const isSuccess = tone === "success";

  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
        isSuccess
          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
          : "border-red-400/30 bg-red-500/10 text-red-200"
      }`}
    >
      {isSuccess ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <XCircle className="mt-0.5 h-4 w-4" />}
      <span>{children}</span>
    </div>
  );
}
