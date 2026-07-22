"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { chatsService, type BroadcastJobItem, type ChatSessionItem } from "@/app/services/common";
import type { ApiError } from "@/app/services/apiClient";

type MutationAction = "accept" | "start-moving" | "arrived" | "start-repair" | "complete" | "cancel" | null;

type UseTechnicianJobsState = {
  broadcastJobs: BroadcastJobItem[];
  activeJobs: ChatSessionItem[];
  isLoading: boolean;
  error: ApiError | null;
  actionSessionId: number | null;
  actionType: MutationAction;
};

function isOpenTechnicianStatus(status: ChatSessionItem["status"]) {
  return ["MATCHED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(status);
}

export function useTechnicianJobs() {
  const [state, setState] = useState<UseTechnicianJobsState>({
    broadcastJobs: [],
    activeJobs: [],
    isLoading: true,
    error: null,
    actionSessionId: null,
    actionType: null,
  });

  const loadJobs = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [broadcastJobs, sessions] = await Promise.all([
        chatsService.getBroadcastJobs(),
        chatsService.getSessions(),
      ]);

      setState((prev) => ({
        ...prev,
        broadcastJobs,
        activeJobs: sessions.filter((item) => isOpenTechnicianStatus(item.status)),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const runAction = useCallback(
    async (sessionId: number, actionType: Exclude<MutationAction, null>, action: () => Promise<unknown>) => {
      setState((prev) => ({ ...prev, actionSessionId: sessionId, actionType, error: null }));
      try {
        await action();
        await loadJobs();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error as ApiError,
        }));
      } finally {
        setState((prev) => ({ ...prev, actionSessionId: null, actionType: null }));
      }
    },
    [loadJobs],
  );

  const acceptJob = useCallback(
    async (job: BroadcastJobItem) =>
      runAction(job.id, "accept", () => chatsService.acceptJob(job.id, job.version)),
    [runAction],
  );

  const startMoving = useCallback(
    async (sessionId: number) =>
      runAction(sessionId, "start-moving", () => chatsService.startMoving(sessionId)),
    [runAction],
  );

  const confirmArrival = useCallback(
    async (sessionId: number) =>
      runAction(sessionId, "arrived", () => chatsService.confirmArrival(sessionId)),
    [runAction],
  );

  const startRepair = useCallback(
    async (sessionId: number) =>
      runAction(sessionId, "start-repair", () => chatsService.startRepair(sessionId)),
    [runAction],
  );

  const completeJob = useCallback(
    async (sessionId: number) =>
      runAction(sessionId, "complete", () => chatsService.completeJob(sessionId)),
    [runAction],
  );

  const cancelJob = useCallback(
    async (sessionId: number) =>
      runAction(sessionId, "cancel", () => chatsService.cancelTechnicianJob(sessionId)),
    [runAction],
  );

  const summary = useMemo(
    () => ({
      broadcasting: state.broadcastJobs.length,
      active: state.activeJobs.length,
      enRoute: state.activeJobs.filter((item) => item.status === "EN_ROUTE").length,
    }),
    [state.activeJobs, state.broadcastJobs.length],
  );

  return {
    ...state,
    summary,
    reload: loadJobs,
    acceptJob,
    startMoving,
    confirmArrival,
    startRepair,
    completeJob,
    cancelJob,
  };
}
