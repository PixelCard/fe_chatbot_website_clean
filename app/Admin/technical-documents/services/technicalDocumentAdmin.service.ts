import { apiClient } from "@/app/services/apiClient";
import type {
  RagDocumentMutationResponse,
  RagDocumentPayload,
  RagIngestResponse,
  TechnicalDocument,
} from "@/app/services/common";
import type {
  TechnicalDocumentFormValues,
  TechnicalDocumentItem,
} from "../types/technicalDocument.types";

/** Đổi response tài liệu từ backend sang model hiển thị của admin. */
function mapDocument(document: TechnicalDocument): TechnicalDocumentItem {
  const source = document.source?.trim() || null;

  return {
    id: document.id,
    title: document.title,
    content: document.content,
    category: document.category?.trim() || null,
    source,
    accessLevel: document.accessLevel,
    embeddingStatus: "SYNCED",
    isOutdated: false,
    needsAiCoverage: source?.toLowerCase().includes("ai") ?? false,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

/** Đổi dữ liệu form admin sang payload ingest mà backend RAG đang hỗ trợ. */
function toIngestPayload(values: TechnicalDocumentFormValues): RagDocumentPayload {
  return {
    title: values.title.trim(),
    content: values.content.trim(),
    category: values.category.trim() || undefined,
    source: values.source.trim() || undefined,
    accessLevel: values.accessLevel,
  };
}

export const technicalDocumentAdminService = {
  /** Lấy danh sách tài liệu kỹ thuật từ RagService và map về đúng UI type. */
  async getDocuments() {
    const documents = await apiClient.get<TechnicalDocument[]>(
      "/api/admin/rag-knowledge/documents",
    );
    return documents.map(mapDocument);
  },

  /** Nạp một tài liệu kỹ thuật mới vào kho tri thức RAG. */
  async createDocument(values: TechnicalDocumentFormValues) {
    await apiClient.post<RagIngestResponse>(
      "/api/admin/rag-knowledge/documents",
      toIngestPayload(values),
    );
  },

  /** Cập nhật tài liệu kỹ thuật hiện có trong kho tri thức RAG. */
  async updateDocument(id: number, values: TechnicalDocumentFormValues) {
    await apiClient.patch<RagDocumentMutationResponse>(
      `/api/admin/rag-knowledge/documents/${id}`,
      toIngestPayload(values),
    );
  },

  /** Xóa tài liệu kỹ thuật khỏi kho tri thức RAG. */
  async deleteDocument(id: number) {
    await apiClient.delete<RagDocumentMutationResponse>(
      `/api/admin/rag-knowledge/documents/${id}`,
    );
  },
};
