export type JobStatus =
  | "AI_CONSULTING"
  | "BROADCASTING"
  | "MATCHED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DONE"
  | "CANCELLED";

export type AssignmentAction =
  | "ASSIGNED"
  | "UNASSIGNED"
  | "REJECTED"
  | "MANUAL_CANCEL"
  | "SYSTEM_AUTO_CANCEL";

export type Customer = {
  id: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  isVerified: boolean;
};

export type Technician = {
  id: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string | null;
  isOnline: boolean;
  latitude?: number | null;
  longitude?: number | null;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  isVerified: boolean;
  distanceKm?: number;
  currentWorkload?: number;
};

export type Device = {
  id: string;
  category: string;
  brandName: string;
  modelCode: string;
  location: string;
  purchaseDate: string;
  warrantyMonths: number;
  maintenanceCycleMonths: number;
  nextMaintenanceDate: string;
  userId: string;
};

export type SessionAssignmentHistory = {
  id: string;
  chatSessionId: string;
  technicianId: string | null;
  technicianName?: string;
  action: AssignmentAction;
  reason?: string;
  createdAt: string;
};

export type RepairSessionTimelineItem = {
  id: string;
  status: JobStatus;
  title: string;
  description?: string;
  createdAt: string;
};

export type RepairSession = {
  id: string;
  deviceType: string;
  symptom: string;
  aiSummary: string | null;
  isDangerous: boolean;
  status: JobStatus;
  version: number;
  contactName: string | null;
  contactPhone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  userId: string;
  technicianId: string | null;
  deviceId: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  technician?: Technician | null;
  device?: Device | null;
  assignmentHistory: SessionAssignmentHistory[];
  statusTimeline: RepairSessionTimelineItem[];
};
