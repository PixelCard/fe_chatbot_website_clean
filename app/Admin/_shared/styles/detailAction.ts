type DetailActionClassOptions = {
  active?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

export function getAdminDetailActionClass({
  active = false,
  fullWidth = false,
  size = "sm",
}: DetailActionClassOptions = {}) {
  const sizeClass =
    size === "lg"
      ? "h-11 px-4"
      : size === "md"
        ? "h-10 px-4"
        : "h-9 px-3.5";
  const stateClass = active
    ? [
        "border-[#FF7A00] bg-[#FF7A00] text-white shadow-[0_10px_22px_rgba(255,122,0,0.18)]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#2563EB]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#1D4ED8]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:shadow-[0_10px_24px_rgba(37,99,235,0.32)]",
      ].join(" ")
    : [
        "border-[#FF7A00]/35 bg-[#FF7A00]/10 text-[#C2410C]",
        "hover:-translate-y-0.5 hover:border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white hover:shadow-[0_10px_22px_rgba(255,122,0,0.18)]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:border-[#2563EB]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:bg-[#1D4ED8]",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:text-white",
        "[.admin-ripple-theme-shell[data-admin-theme=dark]_&]:hover:shadow-[0_10px_24px_rgba(37,99,235,0.32)]",
      ].join(" ");

  return [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-bold transition-all duration-200 ease-out active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/45 focus-visible:ring-offset-2 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus-visible:ring-[#2563EB]/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:focus-visible:ring-offset-[#0D1728]",
    sizeClass,
    fullWidth ? "w-full" : "",
    stateClass,
  ]
    .filter(Boolean)
    .join(" ");
}
