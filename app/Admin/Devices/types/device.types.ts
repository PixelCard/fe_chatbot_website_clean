export type RepairStatus = "DONE" | "PENDING" | "CANCELLED";

export type DeviceRepairHistoryItem = {
  id: string;
  title: string;
  date: string;
  status: RepairStatus;
  technicianName: string;
};

export type DeviceItem = {
  id: number;
  category: string;
  brandName: string;
  modelCode: string | null;
  location: string | null;
  purchaseDate: string | null;
  warrantyMonths: number | null;
  maintenanceCycleMonths: number | null;
  nextMaintenanceDate: string | null;

  userId: number;
  userName: string;
  userPhone: string;

  createdAt: string;
  updatedAt: string;

  repairHistory: DeviceRepairHistoryItem[];
};

export type WarrantyFilter = "ALL" | "HAS_WARRANTY" | "NO_WARRANTY";

export type MaintenanceFilter = "ALL" | "HAS_NEXT" | "NO_NEXT";

export type DeviceSummary = {
  total: number;
  hasWarranty: number;
  hasNextMaintenance: number;
  repairJobs: number;
};