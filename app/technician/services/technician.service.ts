import { apiClient } from "@/app/services/apiClient";
import type { ChatSessionItem, ReviewItem, UserMutationResponse } from "@/app/services/common";

export type TechnicianPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type TechnicianProfilePayload = {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export const technicianService = {
  getCompletedJobs() {
    return apiClient.get<ChatSessionItem[]>("/api/technicians/jobs/completed");
  },

  getProfile() {
    return apiClient.get<UserMutationResponse>("/api/technicians/profile");
  },

  getReviews() {
    return apiClient.get<ReviewItem[]>("/api/technicians/reviews");
  },

  changePassword(payload: TechnicianPasswordPayload) {
    return apiClient.post<{ message: string }>("/api/technicians/change-password", payload);
  },

  updateProfile(payload: TechnicianProfilePayload) {
    return apiClient.put<UserMutationResponse>("/api/technicians/profile", payload);
  },
};
