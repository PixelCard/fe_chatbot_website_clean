import type { AccountItem } from "../../types/account.types";
import AccountEmptyState from "./AccountEmptyState";
import AccountMobileList from "./AccountMobileList";
import AccountTableDesktop from "./AccountTableDesktop";

type Props = {
  rows: AccountItem[];
  onViewDetail: (account: AccountItem) => void;
};

export default function AccountTable({ rows, onViewDetail }: Props) {
  if (!rows.length) {
    return <AccountEmptyState />;
  }

  return (
    <section className="admin-card overflow-hidden rounded-2xl">
      <AccountTableDesktop rows={rows} onViewDetail={onViewDetail} />
      <AccountMobileList rows={rows} onViewDetail={onViewDetail} />
    </section>
  );
}
