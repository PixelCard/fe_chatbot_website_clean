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
  RagDocumentStatus,
  UpdateRagDocumentFormValues,
} from "@/app/Admin/rag-knowledge/types/ragKnowledge.types";

type RagOverviewState = {
  documents: RagDocumentListItem[];
  stats: RagDocumentStats | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isMutating: boolean;
  error: ApiError | null;
};

const PROCESSING_DOCUMENT_STATUSES: RagDocumentStatus[] = [
  "UPLOADED",
  "PARSING",
  "CHUNKING",
  "EMBEDDING",
];

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

const getLocalRagDocs = (): RagDocumentListItem[] => [];

export function useRagKnowledgeApi() {
  const [state, setState] = useState<RagOverviewState>({
    documents: [],
    stats: null,
    isLoading: true,
    isRefreshing: false,
    isMutating: false,
    error: null,
  });

  const fetchOverview = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    setState((prev) => ({
      ...prev,
      isLoading: silent ? prev.isLoading : true,
      isRefreshing: silent,
      error: silent ? prev.error : null,
    }));
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
        stats: stats
          ? {
              ...stats,
              totalDocuments: stats.totalDocuments + localDocs.length,
            }
          : null,
        isLoading: false,
        isRefreshing: false,
        isMutating: false,
        error: null,
      });
    } catch (error) {
      const localDocs = getLocalRagDocs();
      setState((prev) => ({
        ...prev,
        documents: silent ? prev.documents : localDocs,
        isLoading: false,
        isRefreshing: false,
        error: silent ? prev.error : normalizeRagError(error),
      }));
    }
  }, []);

  useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    const hasProcessingDocument = state.documents.some((document) =>
      PROCESSING_DOCUMENT_STATUSES.includes(document.status),
    );

    if (!hasProcessingDocument) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void fetchOverview({ silent: true });
    }, 2500);

    return () => window.clearInterval(intervalId);
  }, [fetchOverview, state.documents]);

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
        return Array.isArray(apiItems) ? apiItems : [];
      } catch (error) {
        throw normalizeRagError(error);
      }
    },
    importConversationCandidate: (payload: ImportRagConversationPayload) =>
      runMutation(() => ragKnowledgeService.importConversationCandidate(payload)),
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
