import type { AccountItem } from "../types/account.types";

export function getAccountSummary(accounts: AccountItem[]) {
    return {
        total: accounts.length,
        active: accounts.filter((item) => item.isActive).length,
        locked: accounts.filter((item) => !item.isActive).length,
        verified: accounts.filter((item) => item.isVerified).length,
        unverified: accounts.filter((item) => !item.isVerified).length,
        online: accounts.filter((item) => item.isOnline).length,
        customers: accounts.filter((item) => item.role === "USER").length,
        technicians: accounts.filter((item) => item.role === "TECHNICIAN").length,
        admins: accounts.filter((item) => item.role === "ADMIN").length,
    };
}

export function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(-2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

export function getRoleLabel(role: AccountItem["role"]) {
    if (role === "USER") return "Khách hàng";
    if (role === "TECHNICIAN") return "Thợ sửa chữa";
    return "Admin";
}

export function getRoleBadge(role: AccountItem["role"]) {
    if (role === "ADMIN") {
        return "border-[#A855F7]/30 bg-[#A855F7]/10 text-[#C084FC]";
    }

    if (role === "TECHNICIAN") {
        return "border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#22D3EE]";
    }

    return "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#4ADE80]";
}

export function getActiveBadge(isActive: boolean) {
    return isActive
        ? "border-[#22C55E]/55 bg-[#DCFCE7] text-[#166534] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#22C55E]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#22C55E]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none"
        : "border-[#EF4444]/50 bg-[#FEE2E2] text-[#991B1B] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#EF4444]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#EF4444]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-none";
}

export function hasAccountLocation(account: AccountItem) {
    return account.latitude != null && account.longitude != null;
}

export function isSuspiciousCustomer(account: AccountItem) {
    return account.role === "USER" && account.repairJobsCount >= 15;
}
