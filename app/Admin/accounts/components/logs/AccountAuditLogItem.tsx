import {
  KeyRound,
  Lock,
  Pencil,
  ShieldCheck,
  ShieldX,
  Unlock,
  UserPlus,
  UserRoundCog,
} from "lucide-react";
import type { AccountAuditLogItem as AuditLog } from "../../types/account.types";

type Props = {
  item: AuditLog;
};

const actionMeta = {
  CREATE: { label: "Tạo tài khoản", icon: UserPlus, tone: "text-[#22D3EE]" },
  UPDATE_PROFILE: { label: "Cập nhật hồ sơ", icon: Pencil, tone: "text-[#22D3EE]" },
  LOCK: { label: "Khóa tài khoản", icon: Lock, tone: "text-[#F87171]" },
  UNLOCK: { label: "Mở khóa tài khoản", icon: Unlock, tone: "text-[#4ADE80]" },
  VERIFY: { label: "Xác minh", icon: ShieldCheck, tone: "text-[#4ADE80]" },
  UNVERIFY: { label: "Hủy xác minh", icon: ShieldX, tone: "text-[#FBBF24]" },
  CHANGE_ROLE: { label: "Đổi vai trò", icon: UserRoundCog, tone: "text-[#C084FC]" },
  RESET_PASSWORD: { label: "Reset mật khẩu", icon: KeyRound, tone: "text-[#FBBF24]" },
} as const;

export default function AccountAuditLogItem({ item }: Props) {
  const meta = actionMeta[item.action];
  const Icon = meta.icon;

  return (
    <article className="rounded-3xl border border-[#1E2A3F] bg-[#101B2E] p-4 transition hover:border-[#334155] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#1E2A3F] bg-[#07111F]">
          <Icon className={["h-5 w-5", meta.tone].join(" ")} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white">{meta.label}</h3>
              <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">
                Thực hiện bởi{" "}
                <span className="font-semibold text-[#D1D5DB]">{item.actorName}</span>
              </p>
            </div>

            <time className="shrink-0 text-sm font-medium text-[#64748B]">
              {item.createdAt}
            </time>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <InfoBox label="Tài khoản" value={`${item.targetAccountName} · #${item.targetAccountId}`} />
            <InfoBox label="Lý do" value={item.reason} />

            {item.oldValue || item.newValue ? (
              <div className="md:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoBox label="Giá trị cũ" value={item.oldValue || "Không có"} muted />
                <InfoBox label="Giá trị mới" value={item.newValue || "Không có"} />
              </div>
            ) : null}

            {item.ipAddress ? (
              <InfoBox label="IP" value={item.ipAddress} muted />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoBox({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#1E2A3F] bg-[#07111F] p-3">
      <p className="text-xs font-medium text-[#64748B]">{label}</p>
      <p
        title={value}
        className={[
          "mt-1 line-clamp-2 text-sm font-semibold leading-6",
          muted ? "text-[#9CA3AF]" : "text-[#D1D5DB]",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}