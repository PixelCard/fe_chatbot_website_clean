"use client";

import { useCallback, useEffect, useState } from "react";

import { aiConsultingAdminService } from "../services";
import type { AiQualitySessionItem } from "../types";

type AiConsultingState = {
  items: AiQualitySessionItem[];
  isLoading: boolean;
  error: Error | null;
};

export function useAiConsultingApi() {
  const [state, setState] = useState<AiConsultingState>({
    items: [],
    isLoading: true,
    error: null,
  });

  const fetchQualitySessions = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const items = await aiConsultingAdminService.getQualitySessions();

      setState({
        items,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        items: [],
        isLoading: false,
        error: error as Error,
      });
    }
  }, []);

  useEffect(() => {
    void fetchQualitySessions();
  }, [fetchQualitySessions]);

  return {
    ...state,
    refetch: fetchQualitySessions,
  };
}