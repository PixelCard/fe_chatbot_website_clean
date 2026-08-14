"use client";

import { useMemo, useState } from "react";

import AdminShell from "../../dashboard/components/Action/AdminShell";

import { useAiConsultingApi } from "../hooks";
import type { AiQualitySessionItem } from "../types";
import AiConsultingHeader from "./AiConsultingHeader";
import AiConsultingLoadingCard from "./AiConsultingLoadingCard";
import AiConsultingPagination from "./AiConsultingPagination";
import AiKpiDashboard from "./AiKpiDashboard";
import AiQualityInsightPanel from "./AiQualityInsightPanel";
import AiQualityReviewTable from "./AiQualityReviewTable";
import AdminToastStack, {
  type AdminToast,
} from "@/app/components/admin/AdminToastStack";

type AiConsultingContentProps = {
    title: string;
    description?: string;
};

const PAGE_SIZE = 5;

export default function AiConsultingContent({
    title,
    description,
}: AiConsultingContentProps) {
    const [page, setPage] = useState(1);
    const [selectedSession, setSelectedSession] =
        useState<AiQualitySessionItem | null>(null);
    const [toasts, setToasts] = useState<AdminToast[]>([]);

    const pushToast = (type: AdminToast["type"], text: string) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { id, type, text }]);
    };

    const { items, isLoading, error, refetch } = useAiConsultingApi();

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const pagedItems = useMemo(() => {
        return items.slice(
            (currentPage - 1) * PAGE_SIZE,
            currentPage * PAGE_SIZE,
        );
    }, [items, currentPage]);

    const goToPage = (nextPage: number) => {
        setPage(Math.min(Math.max(nextPage, 1), totalPages));
    };

    return (
        <AdminShell>
            <div className="space-y-5">
                <AiConsultingHeader
                    title={title}
                    description={description}
                    total={items.length}
                    error={error}
                    isRefreshing={isLoading}
                    onRefresh={refetch}
                />

                {isLoading ? (
                    <AiConsultingLoadingCard />
                ) : (
                    <>
                        <AiKpiDashboard items={items} />

                        <AiQualityReviewTable
                            items={pagedItems}
                            onAnalyze={setSelectedSession}
                        />

                        {items.length > 0 ? (
                            <AiConsultingPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={PAGE_SIZE}
                                total={items.length}
                                onPageChange={goToPage}
                            />
                        ) : null}
                    </>
                )}
            </div>

            <AiQualityInsightPanel
                session={selectedSession}
                onClose={() => setSelectedSession(null)}
            />

            <AdminToastStack
                toasts={toasts}
                onRemove={(id) =>
                    setToasts((prev) => prev.filter((item) => item.id !== id))
                }
            />
        </AdminShell>
    );
}
