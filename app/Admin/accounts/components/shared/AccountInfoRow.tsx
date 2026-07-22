import type { ComponentType } from "react";

type Props = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "info" | "success" | "warning" | "danger" | "neutral";
  multiline?: boolean;
};

const toneClass = {
  info: "text-[#22D3EE]",
  success: "text-[#4ADE80]",
  warning: "text-[#FBBF24]",
  danger: "text-[#F87171]",
  neutral: "text-[#9CA3AF]",
};

export default function AccountInfoRow({
  icon: Icon,
  label,
  value,
  tone = "info",
  multiline,
}: Props) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#1E2A3F] bg-[#07111F] px-3 py-3">
      <Icon className={["mt-0.5 h-4 w-4 shrink-0", toneClass[tone]].join(" ")} />
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#64748B]">{label}</p>
        <p
          title={value}
          className={[
            "text-base font-semibold text-[#D1D5DB]",
            multiline ? "line-clamp-2" : "truncate",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </div>
  );
}