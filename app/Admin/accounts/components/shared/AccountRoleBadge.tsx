import type { AccountRole } from "../../types/account.types";
import { getRoleBadge, getRoleLabel } from "../../utils/accountFormatters";

type Props = {
  role: AccountRole;
};

export default function AccountRoleBadge({ role }: Props) {
  return (
    <span
      className={[
        "inline-flex max-w-full rounded-full border px-3 py-1.5 text-sm font-semibold",
        getRoleBadge(role),
      ].join(" ")}
    >
      <span className="truncate">{getRoleLabel(role)}</span>
    </span>
  );
}