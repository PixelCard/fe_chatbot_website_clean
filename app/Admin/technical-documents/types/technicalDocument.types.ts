export type AccessLevel = "BASIC" | "ADVANCED";

export type EmbeddingStatus = "SYNCED" | "STALE" | "MISSING" | "UPDATING";

export interface TechnicalDocumentItem {
  id: number;
  title: string;
  content: string;
  category: string | null;
  source: string | null;
  accessLevel: AccessLevel;
  embeddingStatus: EmbeddingStatus;
  isOutdated: boolean;
  needsAiCoverage: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalDocumentFilterState {
  keyword: string;
  category: "ALL" | string;
  source: "ALL" | string;
  accessLevel: "ALL" | AccessLevel;
  embeddingStatus: "ALL" | EmbeddingStatus;
  onlyOutdated: boolean;
  onlyAiCoverage: boolean;
}

export interface TechnicalDocumentFormValues {
  title: string;
  content: string;
  category: string;
  source: string;
  accessLevel: AccessLevel;
}