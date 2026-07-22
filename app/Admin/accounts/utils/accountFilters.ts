import type {
    AccountSearchType,
    AccountItem,
    RoleFilter,
    StatusFilter,
    VerifiedFilter,
} from "../types/account.types";

type FilterParams = {
    searchTerm: string;
    searchType: AccountSearchType;
    roleFilter: RoleFilter;
    statusFilter: StatusFilter;
    verifiedFilter: VerifiedFilter;
};

export function filterAccounts(
    accounts: AccountItem[],
    filters: FilterParams,
) {
    const keyword = filters.searchTerm.trim().toLowerCase();

    return accounts.filter((account) => {
        const matchesSearch =
            !keyword ||
            matchesKeywordByType(account, keyword, filters.searchType);

        const matchesRole =
            filters.roleFilter === "ALL" || account.role === filters.roleFilter;

        const matchesStatus =
            filters.statusFilter === "ALL" ||
            (filters.statusFilter === "ACTIVE" && account.isActive) ||
            (filters.statusFilter === "LOCKED" && !account.isActive);

        const matchesVerified =
            filters.verifiedFilter === "ALL" ||
            (filters.verifiedFilter === "VERIFIED" && account.isVerified) ||
            (filters.verifiedFilter === "UNVERIFIED" && !account.isVerified);

        return (
            matchesSearch &&
            matchesRole &&
            matchesStatus &&
            matchesVerified
        );
    });
}

function matchesKeywordByType(
    account: AccountItem,
    keyword: string,
    searchType: AccountSearchType,
) {
    if (searchType === "ID") {
        return account.id.toLowerCase().includes(keyword);
    }

    if (searchType === "FULL_NAME") {
        return account.fullName.toLowerCase().includes(keyword);
    }

    if (searchType === "PHONE_NUMBER") {
        return account.phoneNumber.toLowerCase().includes(keyword);
    }

    if (searchType === "EMAIL") {
        return account.email.toLowerCase().includes(keyword);
    }

    return (
        account.id.toLowerCase().includes(keyword) ||
        account.fullName.toLowerCase().includes(keyword) ||
        account.phoneNumber.toLowerCase().includes(keyword) ||
        account.email.toLowerCase().includes(keyword)
    );
}
