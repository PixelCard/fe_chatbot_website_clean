import { AdminStatusPill } from "@/app/Admin/_shared/components/AdminStatusPill";

type Props = {
  verified: boolean;
};

export default function AccountVerifiedBadge({ verified }: Props) {
  return (
    <AdminStatusPill
      tone={verified ? "info" : "warning"}
      className="max-w-full px-3 py-1.5 text-sm"
    >
      <span className="truncate">
        {verified ? "Đã xác minh" : "Chưa xác minh"}
      </span>
    </AdminStatusPill>
  );
}
