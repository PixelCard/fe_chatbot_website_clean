"use client";

import { useCallback } from "react";
import { mechanicAiService, type MechanicSearchQuery, type RagDocumentPayload } from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useMechanicAiApi() {
  const { run, ...state } = useAsyncAction();

  /** Nạp một tài liệu kỹ thuật vào module mechanic-ai. */
  const ingestDocument = useCallback((payload: RagDocumentPayload) => run(() => mechanicAiService.ingestDocument(payload)), [run]);

  /** Tìm kiếm tri thức mechanic-ai theo nội dung truy vấn, mức truy cập và giới hạn kết quả. */
  const searchDocuments = useCallback((query: MechanicSearchQuery) => run(() => mechanicAiService.searchDocuments(query)), [run]);

  return {
    ...state,
    ingestDocument,
    searchDocuments,
  };
}
