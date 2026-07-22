"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { clearClientSession } from "@/app/auth/utils/session";

type AdminLogoutButtonProps = {
  collapsed: boolean;
};

export default function AdminLogoutButton({
  collapsed,
}: AdminLogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearClientSession();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      title={collapsed ? "Đăng xuất" : undefined}
      className={[
        "flex w-full items-center gap-3 rounded-2xl border border-[var(--admin-sidebar-border)] bg-[var(--admin-control-bg)] px-3 py-2.5 text-sm font-medium text-[#FCA5A5] transition",
        "hover:border-[#EF4444]/45 hover:bg-[#EF4444]/10 hover:text-[#F87171]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)]",
        collapsed ? "justify-center" : "",
      ].join(" ")}
      aria-label="Đăng xuất khỏi trang quản trị"
    >
      <LogOut className="h-4.5 w-4.5 shrink-0" />
      {!collapsed ? <span>Đăng xuất</span> : null}
    </button>
  );
}
