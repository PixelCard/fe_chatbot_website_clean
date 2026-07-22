import { StatusBadge } from "@/app/components/common/status-badge/StatusBadge";
import { getActiveBadge } from "../../utils/accountFormatters";

type Props = {
  active: boolean;
};

export default function AccountStatusBadge({ active }: Props) {
  return (
    <StatusBadge
      label={active ? "Hoat dong" : "Bi khoa"}
      size="md"
      toneClassName={getActiveBadge(active)}
    />
  );
}
