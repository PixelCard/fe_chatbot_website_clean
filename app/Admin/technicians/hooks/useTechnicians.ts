"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import {
  accountAdminService,
  type AccountActionPayload,
} from "../../accounts/services/accountAdmin.service";
import { technicianAdminService } from "../services/technicianAdmin.service";
import type { Technician } from "../types/technician.types";

type UseTechniciansState = {
  items: Technician[];
  isLoading: boolean;
  error: ApiError | null;
};

export function useTechnicians() {
  const [isMutating, setIsMutating] = useState(false);
  const [state, setState] = useState<UseTechniciansState>({
    items: [],
    isLoading: true,
    error: null,
  });

  /** Tải danh sách thợ từ API admin và lưu vào state của trang. */
  const fetchTechnicians = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const items = await technicianAdminService.getTechnicians();
      setState({ items, isLoading: false, error: null });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false, error: error as ApiError }));
    }
  }, []);

  useEffect(() => {
    void fetchTechnicians();
  }, [fetchTechnicians]);

  const runMutation = useCallback(
    async <T,>(action: () => Promise<T>) => {
      setIsMutating(true);
      try {
        const result = await action();
        await fetchTechnicians();
        return result;
      } finally {
        setIsMutating(false);
      }
    },
    [fetchTechnicians],
  );

  const verifyTechnician = useCallback(
    (technicianId: string, payload?: AccountActionPayload) =>
      runMutation(() => accountAdminService.verifyAccount(technicianId, payload)),
    [runMutation],
  );

  const lockTechnician = useCallback(
    (technicianId: string, payload?: AccountActionPayload) =>
      runMutation(() => accountAdminService.lockAccount(technicianId, payload)),
    [runMutation],
  );

  const unlockTechnician = useCallback(
    (technicianId: string, payload?: AccountActionPayload) =>
      runMutation(() => accountAdminService.unlockAccount(technicianId, payload)),
    [runMutation],
  );

  return {
    ...state,
    isMutating,
    refetch: fetchTechnicians,
    verifyTechnician,
    lockTechnician,
    unlockTechnician,
  };
}
