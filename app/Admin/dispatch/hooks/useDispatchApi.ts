"use client";

import { useCallback, useEffect, useState } from "react";
import { dispatchAdminService } from "../services";
import type {
  CandidateTechnician,
  ChatSession,
  SessionAssignmentHistory,
} from "../types/dispatch.types";

type DispatchState = {
  sessions: ChatSession[];
  candidates: CandidateTechnician[];
  history: SessionAssignmentHistory[];
};

export function useDispatchApi() {
  const [state, setState] = useState<DispatchState>({
    sessions: [],
    candidates: [],
    history: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /** Tải lại state điều phối từ backend admin để giữ UI đồng bộ với dữ liệu thật. */
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextState = await dispatchAdminService.getDispatchData();
      setState(nextState);
    } catch (nextError) {
      const normalized =
        nextError instanceof Error
          ? nextError
          : new Error("Không thể tải dữ liệu điều phối.");
      setError(normalized);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  /** Chạy mutation điều phối thật trên BE rồi tải lại state để đồng bộ UI. */
  const runMutation = useCallback(
    async (executor: () => Promise<unknown>) => {
      setIsMutating(true);
      try {
        await executor();
        await refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [refetch],
  );

  /** Gọi BE để gán kỹ thuật viên cho ca đang chọn trong drawer điều phối. */
  const assign = useCallback(
    (sessionId: string, technicianId: string) =>
      runMutation(() => dispatchAdminService.assign(sessionId, technicianId)),
    [runMutation],
  );

  /** Gọi BE để gỡ kỹ thuật viên hiện tại khỏi ca và broadcast lại cho đội thợ. */
  const unassign = useCallback(
    (sessionId: string, _reason: string) =>
      runMutation(() => dispatchAdminService.unassign(sessionId)),
    [runMutation],
  );

  /** Gọi BE để ghi nhận trạng thái thợ từ chối ca từ góc nhìn điều phối admin. */
  const reject = useCallback(
    (sessionId: string, _reason: string) =>
      runMutation(() => dispatchAdminService.reject(sessionId)),
    [runMutation],
  );

  /** Gọi BE để mô phỏng timeout phản hồi của thợ trong luồng dispatch. */
  const simulateTimeout = useCallback(
    (sessionId: string) =>
      runMutation(() => dispatchAdminService.simulateTimeout(sessionId)),
    [runMutation],
  );

  return {
    ...state,
    isLoading,
    isMutating,
    error,
    refetch,
    assign,
    unassign,
    reject,
    simulateTimeout,
  };
}
