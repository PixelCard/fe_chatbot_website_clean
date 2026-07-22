import { AlertTriangle, ShieldAlert, Star, UserRoundX } from "lucide-react";
import type { ComponentType } from "react";
import type { AccountItem } from "../../types/account.types";
import { isSuspiciousCustomer } from "../../utils/accountFormatters";

type WarningItem = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  tone: "warning" | "danger" | "info";
};

export default function AccountWarningCard({
  account,
}: {
  account: AccountItem;
}) {
  const warnings = getAccountWarnings(account);

  if (!warnings.length) return null;

  return (
    <section className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-sm [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-amber-100 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#0D1728] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]">
          <AlertTriangle className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          {warnings.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={[
                  "rounded-lg border px-3 py-2.5",
                  getWarningToneClass(item.tone),
                ].join(" ")}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" />

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-950 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">{item.title}</h4>
                    <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#D1D5DB]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getAccountWarnings(account: AccountItem): WarningItem[] {
  const warnings: WarningItem[] = [];

  if (isSuspiciousCustomer(account)) {
    warnings.push({
      title: "Kh\u00e1ch h\u00e0ng t\u1ea1o nhi\u1ec1u ca s\u1eeda",
      description: `T\u00e0i kho\u1ea3n \u0111\u00e3 t\u1ea1o ${account.repairJobsCount} ca s\u1eeda, c\u1ea7n ki\u1ec3m tra b\u1ea5t th\u01b0\u1eddng.`,
      icon: UserRoundX,
      tone: "warning",
    });
  }

  if (!account.isVerified && account.isActive) {
    warnings.push({
      title: "T\u00e0i kho\u1ea3n ho\u1ea1t \u0111\u1ed9ng nh\u01b0ng ch\u01b0a x\u00e1c minh",
      description: "N\u00ean x\u00e1c minh th\u00f4ng tin \u0111\u1ec3 \u0111\u1ea3m b\u1ea3o an to\u00e0n v\u1eadn h\u00e0nh.",
      icon: ShieldAlert,
      tone: "danger",
    });
  }

  if (account.role === "TECHNICIAN" && account.reviewsCount > 0) {
    warnings.push({
      title: "C\u1ea7n theo d\u00f5i ch\u1ea5t l\u01b0\u1ee3ng th\u1ee3",
      description: "Ki\u1ec3m tra \u0111\u00e1nh gi\u00e1 v\u00e0 ph\u1ea3n h\u1ed3i g\u1ea7n \u0111\u00e2y c\u1ee7a kh\u00e1ch h\u00e0ng.",
      icon: Star,
      tone: "info",
    });
  }

  return warnings;
}

function getWarningToneClass(tone: WarningItem["tone"]) {
  if (tone === "danger") {
    return "border-rose-300 bg-rose-50 text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#EF4444]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#EF4444]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#F87171]";
  }

  if (tone === "info") {
    return "border-cyan-300 bg-cyan-50 text-cyan-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#06B6D4]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#06B6D4]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]";
  }

  return "border-amber-300 bg-amber-50 text-amber-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#F59E0B]/25 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#F59E0B]/10 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]";
}
