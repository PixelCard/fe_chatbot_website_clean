import type { ComponentType } from "react";
import {
  CalendarDays,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import type { AccountItem } from "../../types/account.types";
import {
  getInitials,
  getRoleLabel,
  hasAccountLocation,
} from "../../utils/accountFormatters";

type InfoRowProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "info" | "success";
};

export default function AccountProfileCard({
  account,
}: {
  account: AccountItem;
}) {
  const hasLocation = hasAccountLocation(account);

  return (
    <section className="border-b border-[#1E2A3F] p-4 sm:p-5 xl:border-b-0 xl:border-r xl:border-[#1E2A3F]">
      <div className="rounded-3xl border border-[#1E2A3F] bg-[#07111F] p-5 sm:p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#F59E0B] via-[#FF8A1F] to-[#0EA5E9] text-4xl font-bold text-white shadow-[0_24px_60px_-35px_rgba(6,182,212,0.95)]">
            {account.avatarUrl ? (
              <img
                src={account.avatarUrl}
                alt={account.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(account.fullName)
            )}

            <span
              className={[
                "absolute bottom-2 right-2 h-5 w-5 rounded-full border-[3px] border-[#0D1728]",
                account.isOnline ? "bg-[#22C55E]" : "bg-[#64748B]",
              ].join(" ")}
            />
          </div>

          <div className="mt-5 min-w-0">
            <p
              title={`#${account.id}`}
              className="font-mono text-base font-bold text-[#94A3B8]"
            >
              #{account.id}
            </p>

            <h3
              title={account.fullName}
              className="mt-2 text-2xl font-bold leading-tight text-white"
            >
              {account.fullName}
            </h3>

            <p className="mt-2 text-lg font-semibold text-[#9CA3AF]">
              {getRoleLabel(account.role)}
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-3">
          <InfoRow
            icon={Phone}
            label="Số điện thoại"
            value={account.phoneNumber}
          />

          <InfoRow icon={Mail} label="Email" value={account.email} />

          <InfoRow icon={MapPin} label="Địa chỉ" value={account.address} />

          <InfoRow
            icon={CalendarDays}
            label="Ngày tạo"
            value={account.createdAt}
          />

          {hasLocation ? (
            <GpsRow latitude={account.latitude} longitude={account.longitude} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  tone = "info",
}: InfoRowProps) {
  const iconClass = tone === "success" ? "text-[#4ADE80]" : "text-[#22D3EE]";

  return (
    <div className="rounded-2xl border border-[#1E2A3F] bg-[#0D1728] p-4">
      <div className="flex items-start gap-3">
        <span
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-[#07111F]",
            tone === "success"
              ? "border-[#22C55E]/25"
              : "border-[#06B6D4]/25",
          ].join(" ")}
        >
          <Icon className={["h-5 w-5", iconClass].join(" ")} />
        </span>

        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#64748B]">
            {label}
          </p>

          <p
            title={value}
            className="mt-1 line-clamp-2 text-lg font-bold leading-7 text-[#D1D5DB]"
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function GpsRow({
  latitude,
  longitude,
}: {
  latitude?: number | null;
  longitude?: number | null;
}) {
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const value = `${latitude}, ${longitude}`;

  return (
    <div className="rounded-2xl border border-[#FF8A1F]/25 bg-[#FF8A1F]/10 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF8A1F]/25 bg-[#07111F] text-[#FDBA74]">
            <MapPin className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#FDBA74]">
              Vị trí GPS
            </p>

            <p
              title={value}
              className="mt-0.5 truncate text-base font-bold leading-6 text-[#D1D5DB]"
            >
              {value}
            </p>
          </div>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#FF8A1F]/25 bg-[#07111F] px-3 text-sm font-bold text-[#FDBA74] transition hover:border-[#FF8A1F]/50 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">Mở Maps</span>
          <span className="sm:hidden">Maps</span>
        </a>
      </div>
    </div>
  );
}
