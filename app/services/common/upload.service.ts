import { apiClient } from "@/app/services/apiClient";

export const uploadService = {
  /** Gọi POST /upload/image để tải lên một file media với field multipart/form-data tên `file`. */
  uploadMedia(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<{ message: string; url: string }>("/api/upload/image", formData);
  },
};
