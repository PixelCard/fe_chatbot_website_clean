"use client";

import { useCallback } from "react";
import { ragService, type RagDocumentPayload } from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useRagApi() {
  const { run, ...state } = useAsyncAction();

  /** Nạp một tài liệu vào tập RAG có bảo vệ. */
  const ingestDocument = useCallback(
    (payload: RagDocumentPayload) => run(() => ragService.ingestDocument(payload)),
    [run],
  );

  /** Lấy các tài liệu đã được nạp trong module RAG. */
  const getDocuments = useCallback(() => run(() => ragService.getDocuments()), [run]);

  return {
    ...state,
    ingestDocument,
    getDocuments,
  };
}
