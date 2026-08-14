"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Layers, LogOut, User } from "lucide-react";

import { clearClientSession, getClientTokenFromDocument } from "@/app/auth/utils/session";
import { authService } from "@/app/auth/services/auth.service";
import { apiClient } from "@/app/services/apiClient";
import { APP_ROUTES } from "@/app/config/routes";

import { AdminRippleThemeToggle } from "../Theme/AdminRippleTheme";

type RouteMeta = {
  root: string;
  current: string;
  description: string;
};

const routeMeta: Array<{ prefix: string; meta: RouteMeta }> = [
  {
    prefix: "/admin/dashboard",
    meta: {
      root: "Tổng quan",
      current: "Bảng điều khiển",
      description:
        "Theo dõi nhanh tình trạng vận hành và các khu vực cần chú ý.",
    },
  },
  {
    prefix: "/admin/reports",
    meta: {
      root: "Tổng quan",
      current: "Thống kê doanh thu",
      description:
        "Theo dõi doanh thu, số đơn và báo giá đã chấp nhận theo khoảng thời gian.",
    },
  },
  {
    prefix: "/admin/repair-sessions",
    meta: {
      root: "Vận hành",
      current: "Ca sửa chữa",
      description:
        "Quản lý danh sách ca, trạng thái xử lý và điều phối hiện tại.",
    },
  },
  {
    prefix: "/admin/dispatch",
    meta: {
      root: "Vận hành",
      current: "Điều phối",
      description:
        "Theo dõi đơn hàng, gán thợ phù hợp và quản lý quá trình điều phối.",
    },
  },
  {
    prefix: "/admin/technicians",
    meta: {
      root: "Vận hành",
      current: "Thợ sửa chữa",
      description: "Xem trạng thái đội ngũ kỹ thuật viên và năng lực phục vụ.",
    },
  },
  {
    prefix: "/admin/quotes",
    meta: {
      root: "Vận hành",
      current: "Báo giá",
      description:
        "Kiểm tra báo giá, chênh lệch và các trường hợp cần xử lý.",
    },
  },
  {
    prefix: "/admin/Devices",
    meta: {
      root: "Vận hành",
      current: "Thiết bị",
      description:
        "Theo dõi danh mục thiết bị và trạng thái bảo hành, bảo trì.",
    },
  },
  {
    prefix: "/admin/accounts/create",
    meta: {
      root: "Người dùng",
      current: "Tạo tài khoản",
      description:
        "Tạo tài khoản mới cho khách hàng, kỹ thuật viên hoặc quản trị viên.",
    },
  },
  {
    prefix: "/admin/accounts",
    meta: {
      root: "Người dùng",
      current: "Tài khoản",
      description:
        "Quản lý tài khoản hệ thống, vai trò và trạng thái xác minh.",
    },
  },
  {
    prefix: "/admin/chats",
    meta: {
      root: "Người dùng",
      current: "Phiên chat",
      description:
        "Giám sát hội thoại, tranh chấp và các tín hiệu cần can thiệp.",
    },
  },
  {
    prefix: "/admin/Reviews",
    meta: {
      root: "Người dùng",
      current: "Đánh giá dịch vụ",
      description:
        "Tổng hợp phản hồi khách hàng để phát hiện vấn đề chất lượng.",
    },
  },
  {
    prefix: "/admin/ai-consulting",
    meta: {
      root: "AI & tri thức",
      current: "AI tư vấn",
      description:
        "Theo dõi các phiên AI đang tư vấn trước khi tạo ca sửa chữa.",
    },
  },
  {
    prefix: "/admin/ai-reasoning-logs",
    meta: {
      root: "AI & tri thức",
      current: "Log suy luận AI",
      description:
        "Kiểm tra chất lượng lập luận và các trường hợp AI cần rà soát.",
    },
  },
  {
    prefix: "/admin/rag-knowledge/create",
    meta: {
      root: "AI & tri thức",
      current: "Nạp tài liệu RAG",
      description:
        "Bổ sung tài liệu kỹ thuật mới để phục vụ truy xuất tri thức cho AI.",
    },
  },
  {
    prefix: "/admin/rag-knowledge",
    meta: {
      root: "AI & tri thức",
      current: "Kho tri thức RAG",
      description:
        "Quản lý nguồn tri thức đang phục vụ các tác vụ AI trong hệ thống.",
    },
  },
  {
    prefix: "/admin/technical-documents",
    meta: {
      root: "AI & tri thức",
      current: "Tài liệu kỹ thuật",
      description:
        "Quản lý tài liệu kỹ thuật, nội dung sửa chữa và trạng thái đồng bộ tri thức.",
    },
  },
  {
    prefix: "/admin/moderation",
    meta: {
      root: "AI & tri thức",
      current: "Kiểm duyệt",
      description:
        "Rà soát báo cáo, tín hiệu rủi ro và các trường hợp cần xử lý.",
    },
  },
];

const defaultMeta: RouteMeta = {
  root: "Tổng quan",
  current: "Bảng điều khiển",
  description: "Theo dõi nhanh tình trạng vận hành và các khu vực cần chú ý.",
};

type AdminProfileState = {
  name: string;
  email: string;
  avatarUrl?: string;
};

const DEFAULT_ADMIN_PROFILE: AdminProfileState = {
  name: "Nguyễn Trường Quý",
  email: "quy1chatgpt@gmail.com",
};

function getRouteMeta(pathname: string): RouteMeta {
  const matched = routeMeta
    .filter(
      (item) =>
        pathname === item.prefix || pathname.startsWith(`${item.prefix}/`),
    )
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];

  return matched?.meta ?? defaultMeta;
}

function getInitials(name: string) {
  const safeName = name.trim();

  if (!safeName) return "AD";

  const words = safeName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function readAdminProfile(): AdminProfileState {
  try {
    const rawProfile = window.localStorage.getItem("user_profile");

    if (!rawProfile) {
      return DEFAULT_ADMIN_PROFILE;
    }

    const parsed = JSON.parse(rawProfile) as {
      name?: string;
      fullName?: string;
      email?: string;
      avatarUrl?: string;
      avatar_url?: string;
      avatar?: string;
    };

    return {
      name: parsed.fullName?.trim() || parsed.name?.trim() || DEFAULT_ADMIN_PROFILE.name,
      email: parsed.email?.trim() || DEFAULT_ADMIN_PROFILE.email,
      avatarUrl: (parsed.avatarUrl || parsed.avatar_url || parsed.avatar)?.trim(),
    };
  } catch {
    return DEFAULT_ADMIN_PROFILE;
  }
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const meta = getRouteMeta(pathname);

  const [profile, setProfile] = useState<AdminProfileState>(
    DEFAULT_ADMIN_PROFILE,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const localProfile = readAdminProfile();
    setProfile(localProfile);

    const token = getClientTokenFromDocument();
    if (token) {
      authService
        .getProfile(token)
        .then((res) => {
          if (res && typeof res === "object") {
            const name = res.fullName?.trim() || localProfile.name;
            const email = res.email?.trim() || localProfile.email;
            const avatarUrl = res.avatarUrl?.trim() || localProfile.avatarUrl;
            const updated: AdminProfileState = { name, email, avatarUrl };
            setProfile(updated);
            try {
              window.localStorage.setItem("user_profile", JSON.stringify(updated));
            } catch {}
          }
        })
        .catch(() => {});
    }
  }, []);

  const displayProfile = mounted ? profile : DEFAULT_ADMIN_PROFILE;

  const handleLogout = () => {
    clearClientSession();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <header className="admin-card relative z-20 overflow-visible rounded-2xl px-6 py-5 sm:px-7 sm:py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--admin-accent)]/30 to-transparent"
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-[var(--admin-theme-text)]">
            <Layers className="h-4 w-4 shrink-0 text-[var(--admin-accent)]" />

            <span className="truncate">{meta.root}</span>

            <span className="text-[var(--admin-divider-text)]">/</span>

            <span className="truncate text-[var(--admin-strong-text)]">
              {meta.current}
            </span>
          </div>

          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-[var(--admin-theme-text)] sm:truncate sm:text-[15px]">
            {meta.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 self-start xl:self-center">
          <AdminRippleThemeToggle />

          <div className="group relative shrink-0 py-1">
            <button
              type="button"
              className="admin-profile-button min-w-0 max-w-[400px] !py-2.5 !px-4 hover:scale-[1.01] transition-transform"
              aria-label="Mở menu quản trị viên"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[var(--admin-accent)]/40 bg-[image:var(--admin-cta-bg)] text-xl font-black text-white shadow-lg shadow-[#06B6D4]/15">
                {displayProfile.avatarUrl ? (
                  <img
                    src={displayProfile.avatarUrl}
                    alt={displayProfile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(displayProfile.name)
                )}
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-base font-black text-[var(--admin-strong-text)]">
                  {displayProfile.name}
                </p>

                <p className="truncate text-xs font-semibold text-[var(--admin-muted-text)] mt-0.5">
                  Phiên quản trị đang hoạt động
                </p>
              </div>

              <ChevronDown className="hidden h-5 w-5 shrink-0 text-[var(--admin-theme-text)] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180 sm:block" />
            </button>

            <div className="invisible absolute right-0 top-full z-[100] mt-2 w-[min(280px,calc(100vw-24px))] translate-y-2 rounded-2xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.4)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0B1424]">
              <div className="rounded-xl border-b border-slate-100 bg-slate-50 px-4 py-3 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0F192B]">
                <p className="truncate text-sm font-bold text-slate-900 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
                  {displayProfile.name}
                </p>

                <p className="mt-0.5 truncate text-xs font-semibold text-slate-500 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#CBD5E1]">
                  {displayProfile.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href={APP_ROUTES.Auth.UPDATE_PROFILE}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-orange-600 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:bg-[#132039] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:text-[#22D3EE]"
                >
                  <User className="h-4 w-4 shrink-0 text-slate-400 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#94A3B8]" aria-hidden="true" />
                  Thông tin cá nhân
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl border-t border-slate-100 px-4 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#1E2A3F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5] [.admin-ripple-theme-shell[data-admin-theme=dark]_&:hover]:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
