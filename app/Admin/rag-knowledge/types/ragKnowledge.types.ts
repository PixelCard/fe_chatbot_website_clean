import type { AccessLevel } from "@/app/services/common/types";
export type { AccessLevel };

export type RagDocumentStatus =
  | "UPLOADED"
  | "PARSING"
  | "CHUNKING"
  | "EMBEDDING"
  | "READY"
  | "FAILED"
  | "ARCHIVED";

export type RagFileType =
  | "PDF"
  | "DOCX"
  | "XLSX"
  | "XLS"
  | "CSV"
  | "TXT"
  | "MD"
  | "HTML"
  | "JSON"
  | "UNKNOWN";

export type RagDocumentKind =
  | "TROUBLESHOOTING_GUIDE"
  | "REPAIR_POLICY"
  | "PRICE_TABLE"
  | "DEVICE_MANUAL"
  | "FAQ"
  | "INTERNAL_NOTE";

export type RagDocumentListItem = {
  id: number;
  title: string;
  description: string | null;
  content: string;
  contentPreview: string;
  category: string | null;
  brand: string | null;
  modelCode: string | null;
  source: string | null;
  accessLevel: AccessLevel;
  fileType: RagFileType;
  originalFileName: string | null;
  createdAt: string;
  updatedAt: string;
  indexedAt: string | null;
  status: RagDocumentStatus;
  totalChunks: number;
  totalCharacters: number;
  isActive?: boolean;
};

export type RagDocumentStats = {
  totalDocuments: number;
  readyDocuments: number;
  failedDocuments: number;
  archivedDocuments: number;
  totalChunks: number;
  activeChunks: number;
  totalCharacters: number;
  totalTokens: number;
  documentsByFileType: Array<{
    fileType: RagFileType;
    count: number;
  }>;
  documentsByStatus: Array<{
    status: RagDocumentStatus;
    count: number;
  }>;
};

export type RagDocumentPreviewChunk = {
  id: number;
  chunkIndex: number;
  title: string | null;
  section: string | null;
  contentPreview: string;
  charCount: number | null;
  tokenCount: number | null;
  isActive: boolean;
  createdAt: string;
};

export type RagDocumentDetail = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  modelCode: string | null;
  source: string | null;
  tags: string[];
  accessLevel: AccessLevel;
  kind: RagDocumentKind | null;
  status: RagDocumentStatus;
  errorMessage: string | null;
  fileType: RagFileType;
  originalFileName: string | null;
  storedFileName: string | null;
  fileUrl: string | null;
  storageKey: string | null;
  mimeType: string | null;
  fileSizeBytes: string | null;
  checksum: string | null;
  totalChunks: number;
  totalCharacters: number;
  totalTokens: number;
  version: number;
  isActive: boolean;
  uploadedById: number | null;
  parsedAt: string | null;
  indexedAt: string | null;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    id: number;
    fullName: string | null;
    phoneNumber: string | null;
    email: string | null;
  } | null;
  chunksPreview: RagDocumentPreviewChunk[];
};

export type RagChunkItem = {
  id: number;
  documentId: number;
  chunkIndex: number;
  title: string | null;
  section: string | null;
  content: string;
  pageNumber: number | null;
  sheetName: string | null;
  rowIndex: number | null;
  metadata: Record<string, unknown> | null;
  category: string | null;
  brand: string | null;
  modelCode: string | null;
  tags: string[];
  accessLevel: AccessLevel;
  tokenCount: number | null;
  charCount: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hasEmbedding: boolean;
};

export type RagChunkDetail = RagChunkItem & {
  document: {
    id: number;
    title: string;
    status: RagDocumentStatus;
    isActive: boolean;
  };
};

export type RagDocumentChunksResponse = {
  document: {
    id: number;
    title: string;
    status: RagDocumentStatus;
    totalChunks: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  chunks: RagChunkItem[];
};

export type RagChunkListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
};

export type ImportRagDocumentFormValues = {
  file: File | null;
  title: string;
  description: string;
  kind: RagDocumentKind | "";
  category: string;
  brand: string;
  modelCode: string;
  source: string;
  tags: string;
  accessLevel: AccessLevel;
};

export type RagImportMetadataSuggestion = {
  title: string;
  description: string | null;
  kind: RagDocumentKind | null;
  category: string | null;
  brand: string | null;
  modelCode: string | null;
  source: string | null;
  tags: string[];
};

export type RagImportMetadataSuggestionResponse = {
  message: string;
  metadata: RagImportMetadataSuggestion;
};

export type RagDocumentMutationResponse = {
  message: string;
  document?: RagDocumentListItem | RagDocumentDetail | Record<string, unknown>;
  id?: number;
};

export type UpdateRagDocumentFormValues = {
  title?: string;
  description?: string;
  kind?: RagDocumentKind | "";
  category?: string;
  brand?: string;
  modelCode?: string;
  source?: string;
  tags?: string;
  accessLevel?: AccessLevel;
};
