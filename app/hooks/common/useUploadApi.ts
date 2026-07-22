"use client";

import { useCallback } from "react";
import { uploadService } from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useUploadApi() {
  const { run, ...state } = useAsyncAction();

  /** Tải lên một file media thông qua module upload dùng chung. */
  const uploadMedia = useCallback((file: File) => run(() => uploadService.uploadMedia(file)), [run]);

  return {
    ...state,
    uploadMedia,
  };
}
