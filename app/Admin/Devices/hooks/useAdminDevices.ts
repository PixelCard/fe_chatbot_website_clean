"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApiError } from "@/app/services/apiClient";
import { deviceAdminService } from "../services/deviceAdmin.service";
import type {
  DeviceItem,
  DeviceSummary,
  MaintenanceFilter,
  WarrantyFilter,
} from "../types/device.types";

type DeviceFilters = {
  searchTerm: string;
  categoryFilter: string;
  warrantyFilter: WarrantyFilter;
  maintenanceFilter: MaintenanceFilter;
};

type UseAdminDevicesState = {
  items: DeviceItem[];
  summary: DeviceSummary;
  categories: string[];
  isLoading: boolean;
  error: ApiError | null;
};

const emptySummary: DeviceSummary = {
  total: 0,
  hasWarranty: 0,
  hasNextMaintenance: 0,
  repairJobs: 0,
};

/** Kiểm tra một thiết bị có khớp với bộ lọc admin hiện tại hay không. */
function matchesFilters(device: DeviceItem, filters: DeviceFilters) {
  const keyword = filters.searchTerm.trim().toLowerCase();

  const matchesSearch =
    !keyword ||
    String(device.id).includes(keyword) ||
    device.category.toLowerCase().includes(keyword) ||
    device.brandName.toLowerCase().includes(keyword) ||
    device.modelCode?.toLowerCase().includes(keyword) ||
    device.location?.toLowerCase().includes(keyword) ||
    device.userName.toLowerCase().includes(keyword) ||
    device.userPhone.toLowerCase().includes(keyword);

  const matchesCategory =
    filters.categoryFilter === "ALL" || device.category === filters.categoryFilter;

  const matchesWarranty =
    filters.warrantyFilter === "ALL" ||
    (filters.warrantyFilter === "HAS_WARRANTY" &&
      device.warrantyMonths !== null) ||
    (filters.warrantyFilter === "NO_WARRANTY" && device.warrantyMonths === null);

  const matchesMaintenance =
    filters.maintenanceFilter === "ALL" ||
    (filters.maintenanceFilter === "HAS_NEXT" &&
      device.nextMaintenanceDate !== null) ||
    (filters.maintenanceFilter === "NO_NEXT" &&
      device.nextMaintenanceDate === null);

  return (
    matchesSearch &&
    matchesCategory &&
    matchesWarranty &&
    matchesMaintenance
  );
}

/** Quản lý trạng thái tải và lọc danh sách thiết bị quản trị từ API thật. */
export function useAdminDevices(filters: DeviceFilters) {
  const [state, setState] = useState<UseAdminDevicesState>({
    items: [],
    summary: emptySummary,
    categories: ["ALL"],
    isLoading: true,
    error: null,
  });

  /** Tải danh sách thiết bị quản trị và tính sẵn danh mục cho bộ lọc. */
  const fetchDevices = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await deviceAdminService.getDevices();
      setState({
        items: result.items,
        summary: result.summary,
        categories: [
          "ALL",
          ...Array.from(new Set(result.items.map((item) => item.category))),
        ],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    void fetchDevices();
  }, [fetchDevices]);

  /** Lọc dữ liệu thiết bị ở FE theo bộ lọc của layout admin. */
  const filteredItems = useMemo(
    () => state.items.filter((device) => matchesFilters(device, filters)),
    [filters, state.items],
  );

  return {
    ...state,
    filteredItems,
    refetch: fetchDevices,
  };
}
