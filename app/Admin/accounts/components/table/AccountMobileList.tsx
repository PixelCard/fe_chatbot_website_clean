import type { AccountItem } from "../../types/account.types";
import AccountMobileCard from "./AccountMobileCard";

type Props = {
    rows: AccountItem[];
    onViewDetail: (account: AccountItem) => void;
};

export default function AccountMobileList({ rows, onViewDetail }: Props) {
    return (
        <div className="space-y-3 p-3 xl:hidden">
            {rows.map((row) => (
                <AccountMobileCard
                    key={row.id}
                    row={row}
                    onViewDetail={onViewDetail}
                />
            ))}
        </div>
    );
}