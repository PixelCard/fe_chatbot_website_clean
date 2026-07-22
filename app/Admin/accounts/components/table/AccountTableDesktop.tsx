import type { AccountItem } from "../../types/account.types";
import AccountDesktopRow from "./AccountDesktopRow";

type Props = {
  rows: AccountItem[];
  onViewDetail: (account: AccountItem) => void;
};

export default function AccountTableDesktop({ rows, onViewDetail }: Props) {
  return (
    <div className="hidden xl:block">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[8%]" />
            <col className="w-[22%]" />
            <col className="w-[26%]" />
            <col className="w-[16%]" />
            <col className="w-[13%]" />
            <col className="w-[15%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-[var(--admin-soft-panel-border)] bg-[var(--admin-table-header-bg)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--admin-subtle-text)]">
              <th className="px-5 py-3.5 whitespace-nowrap">{"ID"}</th>
              <th className="px-5 py-3.5">{"T\u00ean t\u00e0i kho\u1ea3n"}</th>
              <th className="px-5 py-3.5">{"Email"}</th>
              <th className="px-5 py-3.5 whitespace-nowrap">{"Vai tr\u00f2"}</th>
              <th className="px-5 py-3.5 whitespace-nowrap">{"Tr\u1ea1ng th\u00e1i"}</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">{"Thao t\u00e1c"}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <AccountDesktopRow
                key={row.id}
                row={row}
                onViewDetail={onViewDetail}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
