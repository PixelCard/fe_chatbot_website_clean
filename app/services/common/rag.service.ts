import { apiClient } from "@/app/services/apiClient";
import type {
  RagDocumentMutationResponse,
  RagDocumentPayload,
  RagIngestResponse,
  TechnicalDocument,
} from "./types";

export const ragService = {
  /** Gọi POST /rag/ingest để nạp một tài liệu tri thức vào kho RAG có bảo vệ. */
  ingestDocument(payload: RagDocumentPayload) {
    return apiClient.post<RagIngestResponse>("/api/rag/ingest", payload);
  },

  /** Gọi GET /rag/documents để lấy danh sách tài liệu đã được nạp, kèm nội dung hiển thị cho admin. */
  getDocuments() {
    return apiClient.get<TechnicalDocument[]>("/api/rag/documents");
  },

  /** Gọi PATCH /rag/documents/:id để cập nhật tài liệu và vector hóa lại nội dung. */
  updateDocument(id: number, payload: RagDocumentPayload) {
    return apiClient.patch<RagDocumentMutationResponse>(
      `/api/rag/documents/${id}`,
      payload,
    );
  },

  /** Gọi DELETE /rag/documents/:id để xóa tài liệu khỏi kho RAG. */
  deleteDocument(id: number) {
    return apiClient.delete<RagDocumentMutationResponse>(
      `/api/rag/documents/${id}`,
    );
  },
};
