import { apiClient } from "@/app/services/apiClient";
import type {
  RagChunkDetail,
  RagChunkListQuery,
  RagDocumentChunksResponse,
  RagDocumentDetail,
  RagImportMetadataSuggestionResponse,
  RagDocumentListItem,
  RagDocumentMutationResponse,
  RagDocumentStats,
  UpdateRagDocumentFormValues,
} from "@/app/admin/rag-knowledge/types/ragKnowledge.types";

const ADMIN_RAG_BASE = "/api/admin/rag-knowledge";

export const ragKnowledgeService = {
  getRagStats() {
    return apiClient.get<RagDocumentStats>(`${ADMIN_RAG_BASE}/stats`);
  },

  getRagDocuments() {
    return apiClient.get<RagDocumentListItem[]>(`${ADMIN_RAG_BASE}/documents`);
  },

  importRagDocument(formData: FormData) {
    return apiClient.post<RagDocumentMutationResponse>(
      `${ADMIN_RAG_BASE}/import`,
      formData,
    );
  },

  suggestImportMetadata(formData: FormData) {
    return apiClient.post<RagImportMetadataSuggestionResponse>(
      `${ADMIN_RAG_BASE}/suggest-metadata`,
      formData,
    );
  },

  getRagDocumentDetail(documentId: number) {
    return apiClient.get<RagDocumentDetail>(
      `${ADMIN_RAG_BASE}/documents/${documentId}`,
    );
  },

  getRagDocumentChunks(documentId: number, query?: RagChunkListQuery) {
    return apiClient.get<RagDocumentChunksResponse>(
      `${ADMIN_RAG_BASE}/documents/${documentId}/chunks`,
      query,
    );
  },

  getChunkDetail(chunkId: number) {
    return apiClient.get<RagChunkDetail>(`${ADMIN_RAG_BASE}/chunks/${chunkId}`);
  },

  archiveRagDocument(documentId: number, isActive: boolean) {
    return apiClient.patch<RagDocumentMutationResponse>(
      `${ADMIN_RAG_BASE}/documents/${documentId}/archive`,
      { isActive },
    );
  },

  updateRagDocument(documentId: number, data: UpdateRagDocumentFormValues) {
    const payload = {
      ...data,
      tags: data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
    };
    return apiClient.patch<RagDocumentMutationResponse>(
      `${ADMIN_RAG_BASE}/documents/${documentId}`,
      payload,
    );
  },

  reindexRagDocument(documentId: number) {
    return apiClient.post<RagDocumentMutationResponse>(
      `${ADMIN_RAG_BASE}/documents/${documentId}/reindex`,
    );
  },

  deleteRagDocument(documentId: number) {
    return apiClient.delete<RagDocumentMutationResponse>(
      `${ADMIN_RAG_BASE}/documents/${documentId}`,
    );
  },
};
