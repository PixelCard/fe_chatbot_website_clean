import { AdminStatusPill } from "@/app/Admin/_shared/components/AdminStatusPill";

type Props = {
  active: boolean;
};

export default function AccountStatusBadge({ active }: Props) {
  return (
    <AdminStatusPill tone={active ? "success" : "cancel"}>
      {active ? "Hoạt động" : "Bị khóa"}
    </AdminStatusPill>
  );
}
