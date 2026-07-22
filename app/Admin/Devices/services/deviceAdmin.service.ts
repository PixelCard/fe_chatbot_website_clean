import type { AdminDeviceItem, JobStatus } from "@/app/services/common";
import { devicesService } from "@/app/services/common";
import type {
  DeviceItem,
  DeviceRepairHistoryItem,
  DeviceSummary,
} from "../types/device.types";

function formatDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN").format(date);
}

/** Chuyển trạng thái job backend về trạng thái hiển thị gọn cho lịch sử sửa chữa. */
function mapRepairStatus(status: JobStatus): DeviceRepairHistoryItem["status"] {
  if (status === "COMPLETED" || status === "DONE") {
    return "DONE";
  }

  if (status === "CANCELLED") {
    return "CANCELLED";
  }

  return "PENDING";
}

/** Chuyển danh sách phiên chat của thiết bị thành lịch sử sửa chữa cho layout admin. */
function mapRepairHistory(device: AdminDeviceItem): DeviceRepairHistoryItem[] {
  return (device.chatSessions ?? []).map((session) => ({
    id: `#SE-${session.id}`,
    title:
      session.symptom?.trim() ||
      session.aiSummary?.trim() ||
      session.deviceType?.trim() ||
      "Phiên sửa chữa",
    date: formatDate(session.updatedAt) ?? "--",
    status: mapRepairStatus(session.status),
    technicianName: session.technician?.fullName?.trim() || "Chưa gán thợ",
  }));
}

/** Chuyển một thiết bị backend sang model mà layout admin đang dùng. */
function mapDevice(device: AdminDeviceItem): DeviceItem {
  return {
    id: device.id,
    category: device.category,
    brandName: device.brandName,
    modelCode: device.modelCode ?? null,
    location: device.location ?? null,
    purchaseDate: formatDate(device.purchaseDate) ?? null,
    warrantyMonths: device.warrantyMonths ?? null,
    maintenanceCycleMonths: device.maintenanceCycleMonths ?? null,
    nextMaintenanceDate: formatDate(device.nextMaintenanceDate) ?? null,
    userId: device.user.id,
    userName: device.user.fullName?.trim() || `Khách hàng #${device.user.id}`,
    userPhone: device.user.phoneNumber,
    createdAt: device.createdAt,
    updatedAt: device.updatedAt,
    repairHistory: mapRepairHistory(device),
  };
}

/** Tính KPI nhanh từ danh sách thiết bị đã map cho màn admin. */
function buildSummary(items: DeviceItem[]): DeviceSummary {
  return {
    total: items.length,
    hasWarranty: items.filter((item) => item.warrantyMonths !== null).length,
    hasNextMaintenance: items.filter((item) => item.nextMaintenanceDate !== null)
      .length,
    repairJobs: items.reduce((sum, item) => sum + item.repairHistory.length, 0),
  };
}

export const deviceAdminService = {
  /** Lấy toàn bộ thiết bị admin và map về đúng shape của layout hiện tại. */
  async getDevices() {
    const devices = await devicesService.getAdminDevices();
    const items = devices.map(mapDevice);

    return {
      items,
      summary: buildSummary(items),
    };
  },

  /** Lấy chi tiết một thiết bị admin và map về đúng shape của layout hiện tại. */
  async getDeviceById(deviceId: number) {
    const device = await devicesService.getAdminDeviceById(deviceId);
    return mapDevice(device);
  },
};
