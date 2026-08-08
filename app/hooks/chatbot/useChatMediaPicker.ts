"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  cleanDisplayValue,
  revokeObjectUrl,
} from "@/app/components/chatbot/chatbotPage.helpers";

type UseChatMediaPickerOptions = {
  getDefaultDeviceType: () => string;
  onBeforeSelect?: () => void;
};

/** Quản lý state chọn file, preview blob URL và thiết bị context cho media upload. */
export function useChatMediaPicker(options: UseChatMediaPickerOptions) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(
    null,
  );
  const [mediaDeviceType, setMediaDeviceType] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /** Xóa file đã chọn và reset preview/input để composer về trạng thái sạch. */
  const clearSelectedFile = useCallback(() => {
    revokeObjectUrl(selectedFilePreview);

    setSelectedFile(null);
    setSelectedFilePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedFilePreview]);

  /** Reset toàn bộ state media picker khi đổi session hoặc tạo chat mới. */
  const resetMediaPicker = useCallback(() => {
    clearSelectedFile();
    setMediaDeviceType("");
  }, [clearSelectedFile]);

  /** Nhận file từ input, tạo preview và tự fill device context mặc định nếu có. */
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      if (!file) return;

      options.onBeforeSelect?.();
      revokeObjectUrl(selectedFilePreview);

      setSelectedFile(file);
      setSelectedFilePreview(
        file.type.startsWith("image/") || file.type.startsWith("video/")
          ? URL.createObjectURL(file)
          : null,
      );
      setMediaDeviceType(
        (prev) => cleanDisplayValue(prev) || options.getDefaultDeviceType(),
      );
    },
    [options, selectedFilePreview],
  );

  useEffect(
    () => () => {
      revokeObjectUrl(selectedFilePreview);
    },
    [selectedFilePreview],
  );

  return {
    selectedFile,
    selectedFilePreview,
    mediaDeviceType,
    setMediaDeviceType,
    fileInputRef,
    handleFileSelect,
    clearSelectedFile,
    resetMediaPicker,
  };
}
