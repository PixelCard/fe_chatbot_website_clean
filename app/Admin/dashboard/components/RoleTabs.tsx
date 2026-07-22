"use client";

type UserRole = "customer" | "technician";

type RoleTabsProps = {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
};

const roles: Array<{ id: UserRole; label: string }> = [
  { id: "customer", label: "KHACH HANG" },
  { id: "technician", label: "KY THUAT VIEN" },
];

export default function RoleTabs({ activeRole, onRoleChange, disabled = false }: RoleTabsProps) {
  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-1"
      role="tablist"
      aria-label="Chon vai tro dang nhap"
    >
      {roles.map((role) => {
        const isActive = activeRole === role.id;
        return (
          <button
            key={role.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`role-${role.id}`}
            disabled={disabled}
            onClick={() => onRoleChange(role.id)}
            className={[
              "min-h-12 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.13em] transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1728]",
              disabled ? "cursor-not-allowed opacity-55" : "",
              isActive
                ? "bg-gradient-to-r from-[#22C55E] via-[#06B6D4] to-[#0EA5E9] text-white shadow-[0_8px_24px_-12px_rgba(6,182,212,0.9)]"
                : "bg-transparent text-[#9CA3AF] hover:text-white",
            ].join(" ")}
          >
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
