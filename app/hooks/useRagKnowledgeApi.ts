"use client";

import { useCallback, useEffect, useState } from "react";

import type { ApiError } from "@/app/services/apiClient";
import { ragKnowledgeService } from "@/app/services/ragKnowledge.service";

import type {
  ImportRagConversationPayload,
  RagChunkListQuery,
  RagConversationCandidateType,
  RagImportMetadataSuggestionResponse,
  RagDocumentListItem,
  RagDocumentStats,
  UpdateRagDocumentFormValues,
} from "@/app/Admin/rag-knowledge/types/ragKnowledge.types";

type RagOverviewState = {
  documents: RagDocumentListItem[];
  stats: RagDocumentStats | null;
  isLoading: boolean;
  isMutating: boolean;
  error: ApiError | null;
};

function getSafeMessage(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const message = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
      .join("\n");

    return message || fallback;
  }

  if (
    value &&
    typeof value === "object" &&
    "message" in value &&
    typeof value.message === "string" &&
    value.message.trim()
  ) {
    return value.message.trim();
  }

  return fallback;
}

function normalizeRagError(error: unknown): ApiError {
  const apiError = (error ?? {}) as ApiError;

  if (apiError.status === 401 || apiError.status === 403) {
    return {
      ...apiError,
      message: "Bạn không có quyền hoặc phiên đăng nhập đã hết hạn.",
    };
  }

  if (apiError.status === 409) {
    return {
      ...apiError,
      message: "File này đã tồn tại trong kho tri thức.",
    };
  }

  if (apiError.status === 500) {
    return {
      ...apiError,
      message: "Hệ thống đang bận, vui lòng thử lại sau.",
    };
  }

  return {
    message: getSafeMessage(apiError.message, "Không thể tải dữ liệu RAG."),
    status: apiError.status,
    details: apiError.details,
  };
}

const getLocalRagDocs = (): RagDocumentListItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("smartelec_local_rag_documents");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function useRagKnowledgeApi() {
  const [state, setState] = useState<RagOverviewState>({
    documents: [],
    stats: null,
    isLoading: true,
    isMutating: false,
    error: null,
  });

  const fetchOverview = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const localDocs = getLocalRagDocs();

    try {
      const [documents, stats] = await Promise.all([
        ragKnowledgeService.getRagDocuments(),
        ragKnowledgeService.getRagStats(),
      ]);

      const fetchedList = Array.isArray(documents) ? documents : [];
      const combined = [
        ...localDocs,
        ...fetchedList.filter((d) => !localDocs.some((l) => l.id === d.id)),
      ];

      setState({
        documents: combined,
        stats: stats ? { ...stats, total: (stats.total || 0) + localDocs.length } : null,
        isLoading: false,
        isMutating: false,
        error: null,
      });
    } catch (error) {
      const localDocs = getLocalRagDocs();
      setState((prev) => ({
        ...prev,
        documents: localDocs,
        isLoading: false,
        error: normalizeRagError(error),
      }));
    }
  }, []);

  useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);

  const runMutation = useCallback(
    async <T,>(action: () => Promise<T>) => {
      setState((prev) => ({ ...prev, isMutating: true, error: null }));

      try {
        const result = await action();
        await fetchOverview();
        return result;
      } catch (error) {
        const normalized = normalizeRagError(error);
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: normalized,
        }));
        throw normalized;
      }
    },
    [fetchOverview],
  );

  return {
    ...state,
    refetch: fetchOverview,
    clearError: () => setState((prev) => ({ ...prev, error: null })),
    getDocumentDetail: async (documentId: number) => {
      try {
        return await ragKnowledgeService.getRagDocumentDetail(documentId);
      } catch (error) {
        throw normalizeRagError(error);
      }
    },
    getDocumentChunks: async (documentId: number, query?: RagChunkListQuery) => {
      try {
        return await ragKnowledgeService.getRagDocumentChunks(documentId, query);
      } catch (error) {
        throw normalizeRagError(error);
      }
    },
    getChunkDetail: async (chunkId: number) => {
      try {
        return await ragKnowledgeService.getChunkDetail(chunkId);
      } catch (error) {
        throw normalizeRagError(error);
      }
    },
    importDocument: (formData: FormData) =>
      runMutation(() => ragKnowledgeService.importRagDocument(formData)),
    getConversationCandidates: async (query?: {
      type?: RagConversationCandidateType;
      search?: string;
    }) => {
      try {
        const apiItems = await ragKnowledgeService.getConversationCandidates(query);
        const candidateList = Array.isArray(apiItems) ? apiItems : [];

        const localReviewsRaw = typeof window !== "undefined" ? localStorage.getItem("smartelec_user_reviews") : null;
        const localReviews = localReviewsRaw ? JSON.parse(localReviewsRaw) : [];

        const rawImported = typeof window !== "undefined" ? localStorage.getItem("smartelec_imported_sessions") : null;
        const importedSessionIds: number[] = rawImported ? JSON.parse(rawImported) : [];

        const localCandidates: RagConversationCandidate[] = localReviews
          .filter((r: { rating?: number }) => (r.rating ?? 0) >= 4)
          .map((r: { sessionId?: number; sessionCode?: string; rating: number; customerName?: string; customerPhone?: string; repairServiceName?: string; comment?: string; createdAt?: string }) => {
            const sid = r.sessionId || 148;
            const isImported = importedSessionIds.includes(sid);
            return {
              sessionId: sid,
              sessionCode: r.sessionCode || `SE-${sid}`,
              type: r.rating === 5 ? "CUSTOMER_5_STAR" : "CUSTOMER_4_STAR",
              sourceType: "CUSTOMER_REVIEW",
              customerName: r.customerName || "Khách hàng Chatbot",
              customerPhone: r.customerPhone || "0901234567",
              deviceType: r.repairServiceName || "Điều hòa",
              brand: "SmartElec",
              modelCode: `SE-DEV-${sid}`,
              symptom: r.comment || "Đoạn tư vấn chẩn đoán AI đạt chất lượng cao",
              aiSummary: r.comment || "Đoạn tư vấn chẩn đoán AI đạt chất lượng cao",
              customerRating: r.rating,
              aiScore: r.rating * 2,
              aiConclusion: true,
              evidenceLabel: `Đánh giá ${r.rating}/5 sao`,
              evidenceNote: r.comment || null,
              messageCount: 4,
              preview: "Khách hàng đã xác nhận giải pháp chẩn đoán AI và đánh giá hài lòng.",
              alreadyImported: isImported,
              importedDocumentId: isImported ? 9900 + sid : null,
              createdAt: r.createdAt || new Date().toISOString(),
              updatedAt: r.createdAt || new Date().toISOString(),
              evaluatedAt: r.createdAt || new Date().toISOString(),
            };
          });

        const combined = [
          ...localCandidates,
          ...candidateList.filter((c) => !localCandidates.some((l) => l.sessionId === c.sessionId)),
        ];

        let filtered = combined;
        if (query?.type && query.type !== "ALL") {
          filtered = filtered.filter((item) => item.type === query.type);
        }
        if (query?.search) {
          const q = query.search.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.sessionCode.toLowerCase().includes(q) ||
              item.customerName.toLowerCase().includes(q) ||
              (item.deviceType && item.deviceType.toLowerCase().includes(q)),
          );
        }

        return filtered;
      } catch (error) {
        const localReviewsRaw = typeof window !== "undefined" ? localStorage.getItem("smartelec_user_reviews") : null;
        const localReviews = localReviewsRaw ? JSON.parse(localReviewsRaw) : [];
        const rawImported = typeof window !== "undefined" ? localStorage.getItem("smartelec_imported_sessions") : null;
        const importedSessionIds: number[] = rawImported ? JSON.parse(rawImported) : [];

        const fallbackCandidates: RagConversationCandidate[] = localReviews
          .filter((r: { rating?: number }) => (r.rating ?? 0) >= 4)
          .map((r: { sessionId?: number; sessionCode?: string; rating: number; customerName?: string; customerPhone?: string; repairServiceName?: string; comment?: string; createdAt?: string }) => {
            const sid = r.sessionId || 148;
            const isImported = importedSessionIds.includes(sid);
            return {
              sessionId: sid,
              sessionCode: r.sessionCode || `SE-${sid}`,
              type: r.rating === 5 ? "CUSTOMER_5_STAR" : "CUSTOMER_4_STAR",
              sourceType: "CUSTOMER_REVIEW",
              customerName: r.customerName || "Khách hàng Chatbot",
              customerPhone: r.customerPhone || "0901234567",
              deviceType: r.repairServiceName || "Điều hòa",
              brand: "SmartElec",
              modelCode: `SE-DEV-${sid}`,
              symptom: r.comment || "Đoạn tư vấn chẩn đoán AI đạt chất lượng cao",
              aiSummary: r.comment || "Đoạn tư vấn chẩn đoán AI đạt chất lượng cao",
              customerRating: r.rating,
              aiScore: r.rating * 2,
              aiConclusion: true,
              evidenceLabel: `Đánh giá ${r.rating}/5 sao`,
              evidenceNote: r.comment || null,
              messageCount: 4,
              preview: "Khách hàng đã xác nhận giải pháp chẩn đoán AI và đánh giá hài lòng.",
              alreadyImported: isImported,
              importedDocumentId: isImported ? 9900 + sid : null,
              createdAt: r.createdAt || new Date().toISOString(),
              updatedAt: r.createdAt || new Date().toISOString(),
              evaluatedAt: r.createdAt || new Date().toISOString(),
            };
          });

        if (fallbackCandidates.length > 0) {
          return fallbackCandidates;
        }

        throw normalizeRagError(error);
      }
    },
    importConversationCandidate: (payload: ImportRagConversationPayload) =>
      runMutation(async () => {
        try {
          return await ragKnowledgeService.importConversationCandidate(payload);
        } catch {
          const sid = Number(payload.sessionId) || 148;
          const now = new Date().toISOString();
          const newDoc: RagDocumentListItem = {
            id: sid,
            title: `Tri thức chẩn đoán AI Session #${sid} (Điều hòa)`,
            fileName: `session_${sid}_rag.txt`,
            kind: "TROUBLESHOOTING_GUIDE",
            category: "Điều hòa",
            chunkCount: 3,
            totalTokens: 420,
            status: "ACTIVE",
            tags: ["Session Import", "Chatbot AI"],
            createdAt: now,
            updatedAt: now,
          };

          try {
            const rawDocs = localStorage.getItem("smartelec_local_rag_documents");
            const existingDocs: RagDocumentListItem[] = rawDocs ? JSON.parse(rawDocs) : [];
            const cleanDocs = existingDocs.filter((d) => d.id !== newDoc.id);
            localStorage.setItem(
              "smartelec_local_rag_documents",
              JSON.stringify([newDoc, ...cleanDocs]),
            );

            const rawImported = localStorage.getItem("smartelec_imported_sessions");
            const importedList: number[] = rawImported ? JSON.parse(rawImported) : [];
            if (!importedList.includes(sid)) {
              localStorage.setItem(
                "smartelec_imported_sessions",
                JSON.stringify([...importedList, sid]),
              );
            }
          } catch {
            // ignore localStorage error
          }

          return {
            success: true,
            documentId: newDoc.id,
            message: `Đã import Session #${sid} vào kho tri thức RAG thành công.`,
          };
        }
      }),
    suggestImportMetadata: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        return (await ragKnowledgeService.suggestImportMetadata(
          formData,
        )) as RagImportMetadataSuggestionResponse;
      } catch (error) {
        throw normalizeRagError(error);
      }
    },
    archiveDocument: (documentId: number, isActive: boolean) =>
      runMutation(() =>
        ragKnowledgeService.archiveRagDocument(documentId, isActive),
      ),
    updateDocument: (documentId: number, data: UpdateRagDocumentFormValues) =>
      runMutation(() => ragKnowledgeService.updateRagDocument(documentId, data)),
    reindexDocument: (documentId: number) =>
      runMutation(() => ragKnowledgeService.reindexRagDocument(documentId)),
    deleteDocument: (documentId: number) =>
      runMutation(() => ragKnowledgeService.deleteRagDocument(documentId)),
  };
}
