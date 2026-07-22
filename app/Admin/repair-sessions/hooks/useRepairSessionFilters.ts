"use client";

import { useCallback, useMemo, useState } from "react";

import type { JobStatus, RepairSession } from "../types/repairSession.types";
import { matchesRepairSessionFilters } from "../utils/repairSessionFilters";

export type RepairSessionFilterState = {
  search: string;
  status: "ALL" | JobStatus;
  datePreset: "ALL" | "TODAY" | "LAST_7_DAYS";
  deviceType: string;
  area: string;
  hasTechnician: "ALL" | "YES" | "NO";
  isDangerous: "ALL" | "YES";
  isStuck: "ALL" | "YES";
  createdDate: string;
  updatedDate: string;
};

export const defaultRepairSessionFilters: RepairSessionFilterState = {
  search: "",
  status: "ALL",
  datePreset: "ALL",
  deviceType: "ALL",
  area: "ALL",
  hasTechnician: "ALL",
  isDangerous: "ALL",
  isStuck: "ALL",
  createdDate: "",
  updatedDate: "",
};

export function useRepairSessionFilters(sessions: RepairSession[]) {
  const [filters, setFilters] = useState<RepairSessionFilterState>(
    defaultRepairSessionFilters,
  );

  const patchFilters = useCallback(
    (patch: Partial<RepairSessionFilterState>) => {
      setFilters((current) => ({ ...current, ...patch }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultRepairSessionFilters);
  }, []);

  const filteredSessions = useMemo(() => {
    const now = new Date();
    return sessions.filter((session) =>
      matchesRepairSessionFilters(session, filters, now),
    );
  }, [filters, sessions]);

  return {
    filters,
    setFilters,
    patchFilters,
    resetFilters,
    filteredSessions,
  };
}
