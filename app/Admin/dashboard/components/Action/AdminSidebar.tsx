"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  BarChart3,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cpu,
  FileText,
  FolderKanban,
  House,
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRoundCog,
  Users,
  Wrench,
} from "lucide-react";

import AdminLogoutButton from "./AdminLogoutButton";

type AdminSidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "Tổng quan",
    items: [
      {
        label: "Bảng điều khiển",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Thống kê doanh thu",
        href: "/admin/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Vận hành",
    items: [
      {
        label: "Ca sửa chữa",
        href: "/admin/repair-sessions",
        icon: Wrench,
      },
      {
        label: "Điều phối thợ",
        href: "/admin/dispatch",
        icon: UserCheck,
      },
      {
        label: "Thợ sửa chữa",
        href: "/admin/technicians",
        icon: UserRoundCog,
      },
      {
        label: "Báo giá",
        href: "/admin/quotes",
        icon: ReceiptText,
      },
      {
        label: "Thiết bị",
        href: "/admin/Devices",
        icon: Cpu,
      },
    ],
  },
  {
    title: "Người dùng",
    items: [
      {
        label: "Tài khoản",
        href: "/admin/accounts",
        icon: Users,
      },
      {
        label: "Phiên chat",
        href: "/admin/chats",
        icon: MessageSquare,
      },
      {
        label: "Đánh giá",
        href: "/admin/Reviews",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "AI & tri thức",
    items: [
      {
        label: "AI tư vấn",
        href: "/admin/ai-consulting",
        icon: BrainCircuit,
      },
      {
        label: "Log suy luận AI",
        href: "/admin/ai-reasoning-logs",
        icon: ClipboardList,
      },
      {
        label: "Kho tri thức RAG",
        href: "/admin/rag-knowledge",
        icon: FolderKanban,
      },
      {
        label: "Tài liệu kỹ thuật",
        href: "/admin/technical-documents",
        icon: FileText,
      },
      {
        label: "Kiểm duyệt",
        href: "/admin/moderation",
        icon: ShieldAlert,
      },
    ],
  },
];

const SIDEBAR_SCROLL_STORAGE_KEY = "admin-sidebar-scroll-top";

function isNavItemActive(pathname: string, href: string) {
  const currentPath = pathname.toLowerCase();
  const targetPath = href.toLowerCase();

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

export default function AdminSidebar({
  collapsed,
  onCollapsedChange,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedScrollTop = sessionStorage.getItem(SIDEBAR_SCROLL_STORAGE_KEY);

    if (!savedScrollTop || !scrollContainerRef.current) {
      return;
    }

    const nextScrollTop = Number(savedScrollTop);

    if (Number.isNaN(nextScrollTop)) {
      return;
    }

    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = nextScrollTop;
      }
    });
  }, [pathname, collapsed]);

  const handleSidebarScroll = () => {
    if (!scrollContainerRef.current) {
      return;
    }

    sessionStorage.setItem(
      SIDEBAR_SCROLL_STORAGE_KEY,
      String(scrollContainerRef.current.scrollTop),
    );
  };

  return (
    <aside
      className={[
        "fixed left-0 top-0 z-40 hidden h-screen shrink-0 border-r backdrop-blur-xl",
        "border-[var(--admin-sidebar-border)] bg-[var(--admin-sidebar-bg)] text-[var(--admin-strong-text)]",
        "transition-all duration-300 ease-out lg:flex lg:flex-col",
        collapsed ? "w-[76px]" : "w-[250px]",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--admin-sidebar-decor-bg)" }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex h-[76px] items-center justify-between border-b border-[var(--admin-sidebar-border)] px-4">
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-3"
            aria-label="Đi tới bảng điều khiển"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--admin-sidebar-brand-icon-border)] bg-[var(--admin-sidebar-brand-icon-bg)] text-[var(--admin-sidebar-brand-icon-text)]">
              <ShieldCheck className="h-5 w-5" />
            </div>

            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--admin-sidebar-brand-title)]">
                  SMARTELEC
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-[var(--admin-sidebar-brand-subtitle)]">
                  Bảng quản trị
                </p>
              </div>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-sidebar-icon-border)] bg-[var(--admin-sidebar-icon-bg)] text-[var(--admin-sidebar-item-text)] transition-colors duration-150 hover:border-[var(--admin-sidebar-active-icon-border)] hover:text-[var(--admin-sidebar-active-icon-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]"
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleSidebarScroll}
          className="scrollbar-hidden flex-1 overflow-y-auto overscroll-contain px-3 py-4"
        >
          <nav className="space-y-4" aria-label="Điều hướng quản trị">
            {sections.map((section) => (
              <div key={section.title} className="space-y-1.5">
                {!collapsed ? (
                  <p className="px-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--admin-sidebar-title)]">
                    {section.title}
                  </p>
                ) : null}

                <div className="space-y-1.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = isNavItemActive(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        aria-current={isActive ? "page" : undefined}
                        style={
                          isActive
                            ? {
                              background: "var(--admin-sidebar-active-bg)",
                              borderColor:
                                "var(--admin-sidebar-active-border)",
                              color: "var(--admin-sidebar-active-text)",
                              boxShadow:
                                "inset 0 0 0 1px var(--admin-sidebar-active-inner-border), 0 12px 28px var(--admin-sidebar-active-shadow)",
                            }
                            : undefined
                        }
                        className={[
                          "group relative flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-extrabold transition-colors duration-150",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]",
                          collapsed ? "justify-center" : "",
                          isActive
                            ? ""
                            : "border-transparent text-[var(--admin-sidebar-item-text)] hover:border-[var(--admin-sidebar-icon-border)] hover:bg-[var(--admin-sidebar-item-hover-bg)] hover:text-[var(--admin-sidebar-item-hover-text)]",
                        ].join(" ")}
                      >
                        {isActive ? (
                          <>
                            <span className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-[var(--admin-sidebar-active-rail)]" />
                            <span className="pointer-events-none absolute inset-y-2 left-2 w-10 rounded-2xl bg-[var(--admin-sidebar-active-glow)] blur-xl" />
                          </>
                        ) : null}

                        <span
                          className={[
                            "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-150",
                            isActive
                              ? "border-[var(--admin-sidebar-active-icon-border)] bg-[var(--admin-sidebar-active-icon-bg)] text-[var(--admin-sidebar-active-icon-text)]"
                              : "border-[var(--admin-sidebar-icon-border)] bg-[var(--admin-sidebar-icon-bg)] text-[var(--admin-sidebar-icon-text)] group-hover:border-[var(--admin-sidebar-active-icon-border)] group-hover:text-[var(--admin-sidebar-active-icon-text)]",
                          ].join(" ")}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>

                        {!collapsed ? (
                          <span
                            className={[
                              "relative z-10 min-w-0 flex-1 truncate",
                              isActive
                                ? "text-[var(--admin-sidebar-active-text)]"
                                : "",
                            ].join(" ")}
                          >
                            {item.label}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-2 border-t border-[var(--admin-sidebar-border)] p-3">
          <Link
            href="/"
            title={collapsed ? "Về trang khách hàng" : undefined}
            className={[
              "group flex w-full items-center gap-3 rounded-2xl border border-[var(--admin-sidebar-border)] bg-[var(--admin-control-bg)] px-3 py-2.5 text-sm font-medium text-[var(--admin-sidebar-item-text)] transition",
              "hover:border-[var(--admin-sidebar-active-icon-border)] hover:bg-[var(--admin-sidebar-item-hover-bg)] hover:text-[var(--admin-sidebar-item-hover-text)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]",
              collapsed ? "justify-center" : "",
            ].join(" ")}
            aria-label="Về trang khách hàng"
          >
            <House className="h-4.5 w-4.5 shrink-0" />
            {!collapsed ? <span>Về trang khách hàng</span> : null}
          </Link>

          <AdminLogoutButton collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}
