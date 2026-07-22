"use client";

import { useCallback, useEffect, useState } from "react";

import { repairSessionAdminService } from "../services/repairSession.service";
import type { RepairSession } from "../types/repairSession.types";

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback);
}

export function useRepairSessionsApi() {
  const [items, setItems] = useState<RepairSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setItems(await repairSessionAdminService.getRepairSessions());
    } catch (nextError) {
      setError(
        normalizeError(nextError, "Không thể tải danh sách ca sửa chữa."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const runMutation = useCallback(
    async (executor: () => Promise<unknown>) => {
      setIsMutating(true);
      setError(null);

      try {
        await executor();
        await refetch();
      } catch (nextError) {
        const normalized = normalizeError(
          nextError,
          "Không thể cập nhật ca sửa chữa.",
        );
        setError(normalized);
        throw normalized;
      } finally {
        setIsMutating(false);
      }
    },
    [refetch],
  );

  const reassign = useCallback(
    (sessionId: string, technicianId: string) =>
      runMutation(() =>
        repairSessionAdminService.assignTechnician(sessionId, technicianId),
      ),
    [runMutation],
  );

  const unassign = useCallback(
    (sessionId: string) =>
      runMutation(() =>
        repairSessionAdminService.unassignTechnician(sessionId),
      ),
    [runMutation],
  );

  const cancel = useCallback(
    (sessionId: string) =>
      runMutation(() =>
        repairSessionAdminService.cancelRepairSession(sessionId),
      ),
    [runMutation],
  );

  return {
    items,
    isLoading,
    isMutating,
    error,
    refetch,
    reassign,
    unassign,
    cancel,
  };
}
