"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import { technicalDocumentAdminService } from "../services/technicalDocumentAdmin.service";
import {
  buildTechnicalDocumentSummary,
  filterTechnicalDocuments,
  getUniqueCategories,
  getUniqueSources,
} from "../lib/technicalDocumentHelpers";
import type {
  TechnicalDocumentFilterState,
  TechnicalDocumentFormValues,
  TechnicalDocumentItem,
} from "../types/technicalDocument.types";

type UseTechnicalDocumentsState = {
  documents: TechnicalDocumentItem[];
  isLoading: boolean;
  isMutating: boolean;
  error: ApiError | null;
};

/** Quản lý việc tải, lọc và nạp thêm tài liệu kỹ thuật từ API RAG. */
export function useTechnicalDocumentsApi(filters: TechnicalDocumentFilterState) {
  const [state, setState] = useState<UseTechnicalDocumentsState>({
    documents: [],
    isLoading: true,
    isMutating: false,
    error: null,
  });

  /** Tải lại danh sách tài liệu kỹ thuật từ backend RAG. */
  const fetchDocuments = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const documents = await technicalDocumentAdminService.getDocuments();
      setState({
        documents,
        isLoading: false,
        isMutating: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  /** Nạp tài liệu mới vào backend rồi tải lại danh sách để đồng bộ UI. */
  const createDocument = useCallback(
    async (values: TechnicalDocumentFormValues) => {
      setState((prev) => ({ ...prev, isMutating: true, error: null }));

      try {
        await technicalDocumentAdminService.createDocument(values);
        await fetchDocuments();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: error as ApiError,
        }));
        throw error;
      }
    },
    [fetchDocuments],
  );

  /** Cập nhật tài liệu trên backend rồi tải lại danh sách để đồng bộ UI. */
  const updateDocument = useCallback(
    async (id: number, values: TechnicalDocumentFormValues) => {
      setState((prev) => ({ ...prev, isMutating: true, error: null }));

      try {
        await technicalDocumentAdminService.updateDocument(id, values);
        await fetchDocuments();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: error as ApiError,
        }));
        throw error;
      }
    },
    [fetchDocuments],
  );

  /** Xóa tài liệu trên backend rồi tải lại danh sách để đồng bộ UI. */
  const deleteDocument = useCallback(
    async (id: number) => {
      setState((prev) => ({ ...prev, isMutating: true, error: null }));

      try {
        await technicalDocumentAdminService.deleteDocument(id);
        await fetchDocuments();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: error as ApiError,
        }));
        throw error;
      }
    },
    [fetchDocuments],
  );

  /** Lọc danh sách tài liệu ở FE theo bộ lọc mà layout đang cung cấp. */
  const filteredDocuments = useMemo(
    () => filterTechnicalDocuments(state.documents, filters),
    [filters, state.documents],
  );

  return {
    ...state,
    filteredDocuments,
    summary: buildTechnicalDocumentSummary(state.documents),
    categories: getUniqueCategories(state.documents),
    sources: getUniqueSources(state.documents),
    refetch: fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  };
}
