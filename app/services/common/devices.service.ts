import { apiClient } from "@/app/services/apiClient";
import type {
  AdminDeviceItem,
  CreateDevicePayload,
  DeviceItem,
  UpdateDevicePayload,
} from "./types";

export const devicesService = {
  /** Gọi POST /devices để tạo thiết bị mới thuộc người dùng đang đăng nhập. */
  createDevice(payload: CreateDevicePayload) {
    return apiClient.post<DeviceItem>("/api/devices", payload);
  },

  /** Gọi GET /devices để lấy toàn bộ thiết bị của người dùng hiện tại. */
  getDevices() {
    return apiClient.get<DeviceItem[]>("/api/devices");
  },

  /** Gọi GET /devices/:id để lấy chi tiết một thiết bị và các phiên chat liên quan. */
  getDeviceById(deviceId: number) {
    return apiClient.get<DeviceItem>(`/api/devices/${deviceId}`);
  },

  /** Gọi PATCH /devices/:id để cập nhật một thiết bị thuộc quyền sở hữu của người dùng. */
  updateDevice(deviceId: number, payload: UpdateDevicePayload) {
    return apiClient.patch<DeviceItem>(`/api/devices/${deviceId}`, payload);
  },

  /** Gọi DELETE /devices/:id để xóa một thiết bị của người dùng. */
  deleteDevice(deviceId: number) {
    return apiClient.delete<{ message: string }>(`/api/devices/${deviceId}`);
  },

  /** Gọi GET /devices/admin/all để lấy toàn bộ thiết bị cho màn hình quản trị. */
  getAdminDevices() {
    return apiClient.get<AdminDeviceItem[]>("/api/devices/admin/all");
  },

  /** Gọi GET /devices/admin/:id để lấy chi tiết một thiết bị theo góc nhìn quản trị. */
  getAdminDeviceById(deviceId: number) {
    return apiClient.get<AdminDeviceItem>(`/api/devices/admin/${deviceId}`);
  },
};
