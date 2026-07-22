import type { JobStatus, RepairSession } from "../types/repairSession.types";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;

const STUCK_THRESHOLDS: Partial<Record<JobStatus, number>> = {
  BROADCASTING: 10 * MINUTE_MS,
  MATCHED: 30 * MINUTE_MS,
  IN_PROGRESS: 72 * HOUR_MS,
};

export function isClosedStatus(status: JobStatus): boolean {
  return status === "COMPLETED" || status === "DONE" || status === "CANCELLED";
}

export function hasAssignedTechnician(session: RepairSession): boolean {
  return Boolean(session.technicianId || session.technician?.id);
}

export function isStuckSession(
  session: RepairSession,
  now = new Date(),
): boolean {
  if (isClosedStatus(session.status)) return false;

  const threshold = STUCK_THRESHOLDS[session.status];
  if (!threshold) return false;

  const updatedAt = new Date(session.updatedAt).getTime();
  if (Number.isNaN(updatedAt)) return false;

  return now.getTime() - updatedAt > threshold;
}

export function getStuckDuration(
  session: RepairSession,
  now = new Date(),
): string | null {
  if (!isStuckSession(session, now)) return null;

  const updatedAt = new Date(session.updatedAt).getTime();
  const minutes = Math.max(
    0,
    Math.floor((now.getTime() - updatedAt) / MINUTE_MS),
  );

  if (minutes < 60) return `${minutes} phút`;
  return `${Math.floor(minutes / 60)} giờ`;
}

export function getRecommendedAction(session: RepairSession): string {
  if (session.status === "BROADCASTING") {
    return "Xem xét phát lại hoặc hủy ca";
  }

  if (session.status === "MATCHED") {
    return "Ưu tiên gán lại thợ";
  }

  if (session.status === "IN_PROGRESS") {
    return "Kiểm tra tiến độ xử lý";
  }

  return "Theo dõi thêm";
}
