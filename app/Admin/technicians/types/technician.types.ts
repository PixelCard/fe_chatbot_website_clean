export type Gender = "MALE" | "FEMALE" | "OTHER";

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

export type DisplayStatus =
  | "AVAILABLE"
  | "MATCHED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "OFFLINE"
  | "LOCKED"
  | "UNVERIFIED";

export type StatusFilter = "ALL" | DisplayStatus;

export type VerificationFilter = "ALL" | "VERIFIED" | "UNVERIFIED";

export type ActiveFilter = "ALL" | "ACTIVE" | "LOCKED";

export type TechnicianCurrentJob = {
  id: string;
  status: JobStatus;
  deviceType: string;
  symptom: string;
  address: string;
  updatedAt: string;
};

export type Technician = {
  id: string;
  phoneNumber: string;
  fullName: string;
  gender: Gender;
  email: string;
  avatarUrl: string | null;
  address: string;
  role: "TECHNICIAN";
  isVerified: boolean;
  isActive: boolean;
  isOnline: boolean;
  latitude: number | null;
  longitude: number | null;
  lastLogin: string;
  createdAt: string;
  averageRating: number;
  totalReviews: number;
  activeJobCount: number;
  completedJobCount: number;
  cancelledJobCount: number;
  currentJob: TechnicianCurrentJob | null;
};

export type TechnicianSummary = {
  total: number;
  online: number;
  activeJobs: number;
  unverified: number;
};