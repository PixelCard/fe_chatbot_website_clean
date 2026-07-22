"use client";

import { useCallback, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";

export type AsyncActionState = {
  isSubmitting: boolean;
  error: ApiError | null;
};

export function useAsyncAction() {
  const [state, setState] = useState<AsyncActionState>({
    isSubmitting: false,
    error: null,
  });

  /** Chạy một tác vụ bất đồng bộ và giữ trạng thái loading/error dùng chung cho các hook mutation. */
  const run = useCallback(async <T,>(action: () => Promise<T>) => {
    setState({ isSubmitting: true, error: null });
    try {
      return await action();
    } catch (error) {
      setState({ isSubmitting: false, error: error as ApiError });
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, []);

  /** Xóa lỗi API gần nhất mà không làm thay đổi dữ liệu hiện tại. */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    run,
    clearError,
  };
}
