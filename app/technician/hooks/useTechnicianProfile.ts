"use client";

import { useCallback } from "react";
import { useAsyncAction } from "@/app/hooks/common/useAsyncAction";
import {
  technicianService,
  type TechnicianPasswordPayload,
  type TechnicianProfilePayload,
} from "../services/technician.service";

export function useTechnicianProfile() {
  const { run, ...state } = useAsyncAction();

  const getCompletedJobs = useCallback(
    () => run(() => technicianService.getCompletedJobs()),
    [run],
  );

  const getProfile = useCallback(
    () => run(() => technicianService.getProfile()),
    [run],
  );

  const getReviews = useCallback(
    () => run(() => technicianService.getReviews()),
    [run],
  );

  const changePassword = useCallback(
    (payload: TechnicianPasswordPayload) =>
      run(() => technicianService.changePassword(payload)),
    [run],
  );

  const updateProfile = useCallback(
    (payload: TechnicianProfilePayload) =>
      run(() => technicianService.updateProfile(payload)),
    [run],
  );

  return {
    ...state,
    getCompletedJobs,
    getProfile,
    getReviews,
    changePassword,
    updateProfile,
  };
}
