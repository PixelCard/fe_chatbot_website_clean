"use client";

import { useCallback } from "react";
import {
  devicesService,
  type CreateDevicePayload,
  type UpdateDevicePayload,
} from "@/app/services/common";
import { useAsyncAction } from "./useAsyncAction";

export function useDevicesApi() {
  const { run, ...state } = useAsyncAction();

  /** Tạo một thiết bị mới cho người dùng đang đăng nhập. */
  const createDevice = useCallback(
    (payload: CreateDevicePayload) =>
      run(() => devicesService.createDevice(payload)),
    [run],
  );

  /** Lấy toàn bộ thiết bị của người dùng hiện tại. */
  const getDevices = useCallback(() => run(() => devicesService.getDevices()), [run]);

  /** Lấy chi tiết một thiết bị theo id số. */
  const getDeviceById = useCallback(
    (deviceId: number) => run(() => devicesService.getDeviceById(deviceId)),
    [run],
  );

  /** Cập nhật một thiết bị theo id số. */
  const updateDevice = useCallback(
    (deviceId: number, payload: UpdateDevicePayload) =>
      run(() => devicesService.updateDevice(deviceId, payload)),
    [run],
  );

  /** Xóa một thiết bị theo id số. */
  const deleteDevice = useCallback(
    (deviceId: number) => run(() => devicesService.deleteDevice(deviceId)),
    [run],
  );

  /** Lấy toàn bộ thiết bị theo quyền quản trị để đổ vào màn admin. */
  const getAdminDevices = useCallback(
    () => run(() => devicesService.getAdminDevices()),
    [run],
  );

  /** Lấy chi tiết thiết bị theo quyền quản trị. */
  const getAdminDeviceById = useCallback(
    (deviceId: number) => run(() => devicesService.getAdminDeviceById(deviceId)),
    [run],
  );

  return {
    ...state,
    createDevice,
    getDevices,
    getDeviceById,
    updateDevice,
    deleteDevice,
    getAdminDevices,
    getAdminDeviceById,
  };
}
