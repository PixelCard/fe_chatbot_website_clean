"use client";

import { useCallback, useEffect, useState } from "react";

import type { ApiError } from "@/app/services/apiClient";
import { ragKnowledgeService } from "@/app/services/ragKnowledge.service";

import type {
  RagChunkListQuery,
  RagImportMetadataSuggestionResponse,
  RagDocumentListItem,
  RagDocumentStats,
  UpdateRagDocumentFormValues,
} from "@/app/admin/rag-knowledge/types/ragKnowledge.types";

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

    try {
      const [documents, stats] = await Promise.all([
        ragKnowledgeService.getRagDocuments(),
        ragKnowledgeService.getRagStats(),
      ]);

      setState({
        documents,
        stats,
        isLoading: false,
        isMutating: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
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
