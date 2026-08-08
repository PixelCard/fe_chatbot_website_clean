export type UserRole = "USER" | "TECHNICIAN" | "ADMIN";

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

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "QUOTE_CARD" | "SYSTEM_LOG";

export type QuoteStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "SUPERSEDED" | "CANCELLED";

export type AccessLevel = "BASIC" | "ADVANCED";

export type AssignmentAction =
  | "ASSIGNED"
  | "UNASSIGNED"
  | "REJECTED"
  | "MANUAL_CANCEL"
  | "SYSTEM_AUTO_CANCEL";

export type LoginPayload = {
  phoneNumber: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  password: string;
  address?: string;
  avatarUrl?: string;
};

export type LoginResponse = {
  message: string;
  userId: number;
  role: UserRole;
  access_token: string;
};

export type RegisterResponse = {
  message: string;
  userId: number;
};

export type AuthMessageResponse = {
  message: string;
  verified?: boolean;
};

export type AuthProfile = {
  id: number;
  phoneNumber: string;
  fullName: string | null;
  email: string | null;
  role: UserRole;
  avatarUrl: string | null;
  address: string | null;
  gender: Gender;
};

export type UserProfile = {
  id: number;
  phoneNumber: string;
  fullName: string | null;
  gender: Gender;
  email: string | null;
  avatarUrl: string | null;
  address: string | null;
  role: UserRole;
  isActive: boolean;
};

export type UserMutationResponse = {
  id: number;
  phoneNumber: string;
  password?: string;
  fullName: string | null;
  gender: Gender;
  email: string | null;
  avatarUrl: string | null;
  address: string | null;
  fcmToken?: string | null;
  role: UserRole;
  isVerified?: boolean;
  isActive: boolean;
  isOnline: boolean;
  latitude?: number | null;
  longitude?: number | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalReviews: number;
};

export type UpdateProfilePayload = {
  fullName?: string;
  email?: string;
  address?: string;
  gender?: Gender;
  avatarUrl?: string;
};

export type ToggleOnlinePayload = {
  latitude?: number;
  longitude?: number;
  isOnline?: boolean;
};

export type CreateDevicePayload = {
  category: string;
  brandName: string;
  modelCode?: string;
  location?: string;
  purchaseDate?: string;
  warrantyMonths?: number;
  maintenanceCycleMonths?: number;
};

export type UpdateDevicePayload = Partial<CreateDevicePayload> & {
  nextMaintenanceDate?: string | null;
};

export type ChatParticipant = {
  id: number;
  fullName: string | null;
  avatarUrl?: string | null;
  role?: UserRole;
};

export type ReviewItem = {
  id: number;
  sessionId: number;
  userId: number;
  technicianId: number;
  rating: number;
  comment?: string | null;
  tags: string[];
  createdAt: string;
};

export type QuoteItem = {
  id: number;
  sessionId: number;
  technicianId: number;
  title: string;
  amount: number;
  status: QuoteStatus;
  version: number;
  parentQuoteId?: number | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type QuoteCardMetadata = {
  quoteId?: number;
  amount?: number;
  title?: string;
  quoteStatus?: QuoteStatus;
  contextDevice?: string | null;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
} & Record<string, unknown>;

export type MessageItem = {
  id: number;
  sessionId: number;
  senderId?: number | null;
  sender?: ChatParticipant | null;
  type: MessageType;
  content: string;
  metadata?: QuoteCardMetadata | null;
  isRead?: boolean;
  isDeleted?: boolean;
  createdAt: string;
};

export type SessionAssignmentHistoryItem = {
  id: number;
  technicianId: number;
  action: AssignmentAction;
  createdAt: string;
  technician?: {
    id: number;
    fullName: string | null;
  } | null;
};

export type ChatSessionItem = {
  id: number;
  userId: number;
  technicianId?: number | null;
  deviceId?: number | null;
  deviceType?: string | null;
  symptom?: string | null;
  aiSummary?: string | null;
  isDangerous: boolean;
  status: JobStatus;
  version: number;
  contactName?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
  user?: ChatParticipant;
  technician?: ChatParticipant | null;
  review?: ReviewItem | null;
  messages?: MessageItem[];
  assignmentHistories?: SessionAssignmentHistoryItem[];
  latestAiLogId?: number | null;
  latestAiFeedback?: "LIKE" | "DISLIKE" | null;
  bookingTriggered?: boolean;
  aiStateSnapshot?: AiConversationState | null;
  risk?: AiConversationRisk | null;
  canBook?: boolean | null;
  chatClosed?: boolean | null;
  symptomLabel?: string | null;
  symptomDetail?: string | null;
  finalAiSummary?: {
    headline?: string | null;
    analysis?: string | null;
    recommendation?: string | null;
    symptomLabel?: string | null;
    symptomDetail?: string | null;
    risk?: AiConversationRisk | null;
  } | null;
};

export type DeviceItem = {
  id: number;
  category: string;
  brandName: string;
  modelCode?: string | null;
  location?: string | null;
  purchaseDate?: string | null;
  warrantyMonths?: number | null;
  maintenanceCycleMonths?: number | null;
  nextMaintenanceDate?: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  chatSessions?: ChatSessionItem[];
};

export type AdminDeviceSessionItem = {
  id: number;
  symptom?: string | null;
  aiSummary?: string | null;
  deviceType?: string | null;
  status: JobStatus;
  updatedAt: string;
  technician?: {
    fullName?: string | null;
  } | null;
};

export type AdminDeviceItem = Omit<DeviceItem, "chatSessions"> & {
  user: {
    id: number;
    fullName?: string | null;
    phoneNumber: string;
  };
  chatSessions: AdminDeviceSessionItem[];
};

export type SendMessagePayload = {
  type: MessageType;
  content: string;
  metadata?: Record<string, unknown>;
  deviceType?: string;
};

export type CreateQuotePayload = {
  title: string;
  amount: number;
};

export type CreateQuoteResponse = {
  quote: QuoteItem;
  message: MessageItem;
};

export type BookTechnicianPayload = {
  contactName?: string;
  contactPhone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

export type BookTechnicianResponse = {
  message: string;
  data: ChatSessionItem;
};

export type ReviewPayload = {
  rating: number;
  comment?: string;
  tags?: string[];
};

export type ReviewSubmitResponse = {
  success: boolean;
  message: string;
  data: ReviewItem;
};

export type UpdateQuoteStatusPayload = {
  status: "ACCEPTED" | "REJECTED";
};

export type UpdateQuoteStatusResponse = {
  message: string;
  data: MessageItem;
};

export type JobActionResponse = {
  success: boolean;
  message: string;
};

export type ReadAllMessagesResponse = {
  count: number;
};

export type BroadcastJobItem = {
  id: number;
  deviceType?: string | null;
  symptom?: string | null;
  aiSummary?: string | null;
  createdAt: string;
  version: number;
  address?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  user?: Omit<ChatParticipant, "role">;
};

export type ChatHistoryPayload = {
  title: string;
  summary: string;
};

export type ChatHistorySaveResponse = {
  id: number;
  deviceType: string;
  aiSummary: string;
  createdAt: string;
  userId: number;
};

export type ChatHistoryItem = {
  id: number;
  deviceType: string;
  aiSummary: string;
  createdAt: string;
};

export type DeviceCategory =
  | "COOLING_HEATING"
  | "WATER_APPLIANCE"
  | "COOKING_APPLIANCE"
  | "DISPLAY_AUDIO"
  | "CLEANING_APPLIANCE"
  | "AIR_WATER_TREATMENT"
  | "GENERIC_APPLIANCE";

export type AiConversationPhase =
  | "COLLECTING"
  | "ASKING_CONTEXT"
  | "READY_FOR_RAG"
  | "ADVISING"
  | "DIAGNOSING"
  | "READY_TO_BOOK";

export type AiConversationRisk = "GREEN" | "YELLOW" | "RED" | "UNKNOWN";

export type AiConversationContextAnswers = {
  operationStatus?: string | null;
  errorCode?: string | null;
  abnormalSigns?: string | null;
  brandModel?: string | null;
  whenHappens?: string | null;
  maintenanceHistory?: string | null;
  environmentCondition?: string | null;
  safetySigns?: string | null;
  outdoorUnitStatus?: string | null;
};

export type AiConversationState = {
  device?: string | null;
  deviceCategory?: DeviceCategory | null;
  symptom?: string | null;
  ctx?: string | null;
  phase: AiConversationPhase;
  risk: AiConversationRisk;
  flags: string[];
  contextQuestionsAsked?: boolean;
  contextQuestionSet?: string | null;
  contextAnswers?: AiConversationContextAnswers;
  askedFollowupKey?: string | null;
  canBook?: boolean;
  chatClosed?: boolean;
  symptomLabel?: string | null;
  symptomDetail?: string | null;
  aiSummaryText?: string | null;
  finalAiSummary?: {
    headline?: string | null;
    analysis?: string | null;
    recommendation?: string | null;
    symptomLabel?: string | null;
    symptomDetail?: string | null;
    risk?: AiConversationRisk | null;
  } | null;
};

export type AiChatPayload = {
  message: string;
  sessionId?: string | number;
  image?: string;
  history?: unknown[];
  state?: AiConversationState;
};

export type AiChatResponse = {
  text: string;
  state: AiConversationState;
  is_booking_triggered?: boolean;
  sessionId?: number | null;
  logId?: number | null;
};

export type AiFeedbackPayload = {
  feedback: "LIKE" | "DISLIKE";
};

export type AiFeedbackResponse = {
  success: true;
  feedback: "LIKE" | "DISLIKE";
  alreadySubmitted?: boolean;
};

export type RagDocumentPayload = {
  title: string;
  content: string;
  category?: string;
  source?: string;
  accessLevel?: AccessLevel;
};

export type RagIngestResponse = {
  message: string;
  document: {
    title: string;
    category?: string | null;
    accessLevel: AccessLevel;
  };
};

export type RagDocumentMutationResponse = {
  message: string;
  document?: TechnicalDocument | null;
  id?: number;
};

export type TechnicalDocument = {
  id: number;
  title: string;
  content: string;
  category?: string | null;
  source?: string | null;
  accessLevel: AccessLevel;
  createdAt: string;
  updatedAt: string;
};

export type MechanicAiIngestResponse = {
  message: string;
  data: {
    title: string;
    category?: string | null;
    accessLevel: AccessLevel;
  };
};

export type MechanicSearchQuery = {
  q: string;
  level?: AccessLevel;
  limit?: number;
};

export type MechanicSearchResultItem = {
  id: number;
  title: string;
  content: string;
  category?: string | null;
  accessLevel: AccessLevel;
  distance?: number | null;
};

export type MechanicSearchResponse = {
  message: string;
  results: MechanicSearchResultItem[];
};

export type NotificationTestPayload = {
  token: string;
  title: string;
  body: string;
};

export type NotificationTestResponse = {
  success: boolean;
  messageId: string;
};
