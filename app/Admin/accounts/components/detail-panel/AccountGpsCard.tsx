import { ExternalLink, MapPin } from "lucide-react";

import type { AccountItem } from "../../types/account.types";
import { hasAccountLocation } from "../../utils/accountFormatters";

export default function AccountGpsCard({ account }: { account: AccountItem }) {
  const hasLocation = hasAccountLocation(account);

  if (!hasLocation) return null;

  const mapsUrl = `https://www.google.com/maps?q=${account.latitude},${account.longitude}`;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#FF8A1F]/20 bg-[#FF8A1F]/8 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#FF8A1F]/20 bg-[#FF8A1F]/10 text-[#FDBA74]">
        <MapPin className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#FDBA74]">
          Vị trí GPS
        </p>
        <p className="mt-0.5 text-xs font-medium text-[#D1D5DB]">
          {account.latitude}, {account.longitude}
        </p>
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg border border-[#FF8A1F]/25 bg-[#0D1728] px-2.5 text-xs font-semibold text-[#FDBA74] transition hover:border-[#FF8A1F]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A1F]/40"
      >
        <ExternalLink className="h-3 w-3" />
        Maps
      </a>
    </div>
  );
}
