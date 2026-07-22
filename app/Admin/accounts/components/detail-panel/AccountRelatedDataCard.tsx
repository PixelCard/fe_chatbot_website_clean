import { Cpu, Star, Wrench } from "lucide-react";
import type { AccountItem } from "../../types/account.types";

export default function AccountRelatedDataCard({
  account,
}: {
  account: AccountItem;
}) {
  return (
    <div className="rounded-xl border border-[#1E2A3F] bg-[#07111F] p-3">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
        Dữ liệu liên quan
      </p>

      <div className="grid grid-cols-3 gap-2">
        <MetricBox
          icon={Cpu}
          label="Thiết bị"
          value={account.devicesCount}
          iconClass="text-[#22D3EE]"
        />
        <MetricBox
          icon={Wrench}
          label="Ca sửa"
          value={account.repairJobsCount}
          iconClass="text-[#FBBF24]"
        />
        <MetricBox
          icon={Star}
          label="Đánh giá"
          value={account.reviewsCount}
          iconClass="text-[#F59E0B]"
        />
      </div>
    </div>
  );
}

function MetricBox({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  iconClass: string;
}) {
  return (
    <div className="rounded-lg border border-[#1E2A3F] bg-[#0D1728] p-2.5">
      <Icon className={["h-3.5 w-3.5", iconClass].join(" ")} />
      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-[#64748B]">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold text-white">{value}</p>
    </div>
  );
}
