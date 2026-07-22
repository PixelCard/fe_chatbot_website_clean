import type { RepairSession } from "../types/repairSession.types";

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : DATE_TIME_FORMATTER.format(date);
}

export function formatTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : TIME_FORMATTER.format(date);
}

export function truncateText(
  text: string | null | undefined,
  max = 80,
): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export function formatCoords(
  latitude: number | null,
  longitude: number | null,
): string {
  if (latitude === null || longitude === null) return "Chưa có tọa độ";
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

export function getAreaFromAddress(session: RepairSession): string {
  if (!session.address) return "Khác";
  const parts = session.address.split(",").map((part) => part.trim());
  return parts[0] || "Khác";
}
