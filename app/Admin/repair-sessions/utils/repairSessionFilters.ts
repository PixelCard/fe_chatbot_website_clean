import type { RepairSessionFilterState } from "../hooks/useRepairSessionFilters";
import type { RepairSession } from "../types/repairSession.types";
import { hasAssignedTechnician, isStuckSession } from "./repairSessionRules";

function includesNormalized(value: string | null | undefined, keyword: string) {
  return (value ?? "").toLocaleLowerCase("vi-VN").includes(keyword);
}

function isSameDate(value: string, expectedDate: string) {
  if (!expectedDate) return true;
  return value.slice(0, 10) === expectedDate;
}

function matchesDatePreset(
  createdAt: string,
  preset: RepairSessionFilterState["datePreset"],
  now: Date,
) {
  if (preset === "ALL") return true;

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return false;

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (preset === "TODAY") {
    return createdDate >= startOfToday;
  }

  const startOfLastSevenDays = new Date(startOfToday);
  startOfLastSevenDays.setDate(startOfToday.getDate() - 6);
  return createdDate >= startOfLastSevenDays;
}

export function matchesRepairSessionFilters(
  session: RepairSession,
  filters: RepairSessionFilterState,
  now = new Date(),
): boolean {
  const keyword = filters.search.trim().toLocaleLowerCase("vi-VN");

  const matchesSearch =
    !keyword ||
    includesNormalized(session.id, keyword) ||
    includesNormalized(session.deviceType, keyword) ||
    includesNormalized(session.symptom, keyword) ||
    includesNormalized(session.customer.fullName, keyword) ||
    includesNormalized(session.customer.phoneNumber, keyword) ||
    includesNormalized(session.contactPhone, keyword);

  const assigned = hasAssignedTechnician(session);

  return (
    matchesSearch &&
    (filters.status === "ALL" || session.status === filters.status) &&
    matchesDatePreset(session.createdAt, filters.datePreset, now) &&
    (filters.deviceType === "ALL" ||
      session.deviceType === filters.deviceType) &&
    (filters.area === "ALL" ||
      includesNormalized(session.address, filters.area.toLocaleLowerCase("vi-VN"))) &&
    (filters.hasTechnician === "ALL" ||
      (filters.hasTechnician === "YES" ? assigned : !assigned)) &&
    (filters.isDangerous === "ALL" || session.isDangerous) &&
    (filters.isStuck === "ALL" || isStuckSession(session, now)) &&
    isSameDate(session.createdAt, filters.createdDate) &&
    isSameDate(session.updatedAt, filters.updatedDate)
  );
}
