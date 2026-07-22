import { apiClient } from "@/app/services/apiClient";
import type {
  MechanicAiIngestResponse,
  MechanicSearchQuery,
  MechanicSearchResponse,
  RagDocumentPayload,
} from "./types";

export const mechanicAiService = {
  /** Gọi POST /mechanic-ai/ingest để nạp một tài liệu tri thức cho mechanic-ai. */
  ingestDocument(payload: RagDocumentPayload) {
    return apiClient.post<MechanicAiIngestResponse>("/api/mechanic-ai/ingest", payload);
  },

  /** Gọi GET /mechanic-ai/search để truy vấn các tài liệu liên quan theo nội dung tìm kiếm. */
  searchDocuments(query: MechanicSearchQuery) {
    return apiClient.get<MechanicSearchResponse>("/api/mechanic-ai/search", query);
  },
};
