import type {
  Customer,
  Device,
  JobStatus,
  RepairSession,
  RepairSessionTimelineItem,
  SessionAssignmentHistory,
  Technician,
} from "../types/repairSession.types";

const now = new Date("2026-05-27T10:00:00+07:00");

export const customersMock: Customer[] = Array.from({ length: 200 }).map((_, index) => ({
  id: `USR-${1000 + index}`,
  fullName: `Khách hàng ${index + 1}`,
  phoneNumber: `0901000${String(index).padStart(3, "0")}`,
  avatarUrl: null,
  address: `${(index % 12) + 1} Nguyễn Trãi, Quận ${(index % 8) + 1}, TP.HCM`,
  latitude: 10.75 + index * 0.001,
  longitude: 106.67 + index * 0.001,
  isActive: true,
  isVerified: index % 3 !== 0,
}));

const technicians: Technician[] = Array.from({ length: 10 }).map((_, index) => ({
  id: `TECH-${200 + index}`,
  fullName: `Kỹ thuật viên ${index + 1}`,
  phoneNumber: `0912000${String(index).padStart(3, "0")}`,
  avatarUrl: null,
  isOnline: index % 3 !== 0,
  latitude: 10.8 + index * 0.001,
  longitude: 106.7 + index * 0.001,
  averageRating: 4.5 + (index % 5) * 0.1,
  totalReviews: 30 + index * 7,
  isActive: true,
  isVerified: true,
  distanceKm: 1 + index * 0.4,
  currentWorkload: index % 4,
}));

const devices: Device[] = Array.from({ length: 12 }).map((_, index) => ({
  id: `DEV-${300 + index}`,
  category: index % 2 === 0 ? "Máy lạnh" : "Máy giặt",
  brandName: index % 2 === 0 ? "Daikin" : "LG",
  modelCode: `MD-${500 + index}`,
  location: index % 2 === 0 ? "Phòng khách" : "Ban công",
  purchaseDate: "2024-01-10",
  warrantyMonths: 24,
  maintenanceCycleMonths: 6,
  nextMaintenanceDate: "2026-09-10",
  userId: customersMock[index].id,
}));

function mkTime(minutesAgo: number): string {
  return new Date(now.getTime() - minutesAgo * 60_000).toISOString();
}

function buildTimeline(id: string, status: JobStatus, createdAt: string): RepairSessionTimelineItem[] {
  return [
    { id: `${id}-t1`, status: "AI_CONSULTING", title: "Bắt đầu tư vấn AI", createdAt },
    { id: `${id}-t2`, status, title: `Chuyển trạng thái ${status}`, createdAt: mkTime(Math.max(1, 5)) },
  ];
}

function buildHistory(id: string, technician: Technician | null): SessionAssignmentHistory[] {
  if (!technician) return [];
  return [
    {
      id: `${id}-h1`,
      chatSessionId: id,
      technicianId: technician.id,
      technicianName: technician.fullName,
      action: "ASSIGNED",
      createdAt: mkTime(30),
    },
  ];
}

type Seed = {
  id: string;
  status: JobStatus;
  dangerous?: boolean;
  minsAgoUpdate: number;
  techIndex?: number;
  deviceIndex?: number;
  aiSummary?: string | null;
};

const seeds: Seed[] = [
  { id: "JOB-9101", status: "AI_CONSULTING", minsAgoUpdate: 2 },
  { id: "JOB-9102", status: "AI_CONSULTING", minsAgoUpdate: 6 },
  { id: "JOB-9103", status: "AI_CONSULTING", minsAgoUpdate: 12, dangerous: true },
  { id: "JOB-9104", status: "BROADCASTING", minsAgoUpdate: 4 },
  { id: "JOB-9105", status: "BROADCASTING", minsAgoUpdate: 11 },
  { id: "JOB-9106", status: "BROADCASTING", minsAgoUpdate: 7, dangerous: true },
  { id: "JOB-9107", status: "BROADCASTING", minsAgoUpdate: 5 },
  { id: "JOB-9108", status: "MATCHED", minsAgoUpdate: 12, techIndex: 0 },
  { id: "JOB-9109", status: "MATCHED", minsAgoUpdate: 40, techIndex: 1 },
  { id: "JOB-9110", status: "MATCHED", minsAgoUpdate: 8, techIndex: 2 },
  { id: "JOB-9111", status: "MATCHED", minsAgoUpdate: 9, techIndex: 3, dangerous: true },
  { id: "JOB-9112", status: "EN_ROUTE", minsAgoUpdate: 16, techIndex: 4 },
  { id: "JOB-9113", status: "EN_ROUTE", minsAgoUpdate: 18, techIndex: 5 },
  { id: "JOB-9114", status: "ARRIVED", minsAgoUpdate: 20, techIndex: 6 },
  { id: "JOB-9115", status: "ARRIVED", minsAgoUpdate: 14, techIndex: 7 },
  { id: "JOB-9116", status: "IN_PROGRESS", minsAgoUpdate: 20, techIndex: 8 },
  { id: "JOB-9117", status: "IN_PROGRESS", minsAgoUpdate: 90, techIndex: 9 },
  { id: "JOB-9118", status: "IN_PROGRESS", minsAgoUpdate: 4400, techIndex: 2, dangerous: true },
  { id: "JOB-9119", status: "COMPLETED", minsAgoUpdate: 60, techIndex: 1 },
  { id: "JOB-9120", status: "CANCELLED", minsAgoUpdate: 55, techIndex: 0 },
];

export const repairSessionsMock: RepairSession[] = seeds.map((seed, index) => {
  const customer = customersMock[index];
  const technician = typeof seed.techIndex === "number" ? technicians[seed.techIndex] : null;
  const device = index < devices.length ? devices[index] : null;
  const createdAt = mkTime(seed.minsAgoUpdate + 20);
  const updatedAt = mkTime(seed.minsAgoUpdate);
  return {
    id: seed.id,
    deviceType: index % 2 === 0 ? "Máy lạnh" : "Máy giặt",
    symptom: "Thiết bị hoạt động bất thường, cần kiểm tra và xử lý sớm.",
    aiSummary: seed.aiSummary === undefined ? (index % 4 === 0 ? null : "AI đánh giá cần kiểm tra linh kiện và xác minh điều kiện vận hành.") : seed.aiSummary,
    isDangerous: Boolean(seed.dangerous),
    status: seed.status,
    version: 1 + (index % 4),
    contactName: index % 3 === 0 ? null : customer.fullName,
    contactPhone: index % 3 === 0 ? null : customer.phoneNumber,
    address: customer.address ?? null,
    latitude: customer.latitude ?? null,
    longitude: customer.longitude ?? null,
    userId: customer.id,
    technicianId: technician?.id ?? null,
    deviceId: device?.id ?? null,
    createdAt,
    updatedAt,
    customer,
    technician,
    device,
    assignmentHistory: buildHistory(seed.id, technician),
    statusTimeline: buildTimeline(seed.id, seed.status, createdAt),
  };
});

export const suggestedTechniciansMock: Technician[] = technicians.slice(0, 6);
export const usersMock: Customer[] = customersMock;

