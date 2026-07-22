import type {
  AccessLevel,
  EmbeddingStatus,
  TechnicalDocumentFilterState,
  TechnicalDocumentItem,
} from "../types/technicalDocument.types";

export function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getAccessLevelLabel(level: AccessLevel) {
  if (level === "BASIC") return "Cơ bản";
  return "Nâng cao";
}

export function getEmbeddingStatusLabel(status: EmbeddingStatus) {
  if (status === "SYNCED") return "Đã đồng bộ";
  if (status === "STALE") return "Cần cập nhật";
  if (status === "MISSING") return "Chưa tạo";
  return "Đang cập nhật";
}

export function filterTechnicalDocuments(
  documents: TechnicalDocumentItem[],
  filters: TechnicalDocumentFilterState,
) {
  const keyword = filters.keyword.trim().toLowerCase();

  return documents.filter((doc) => {
    const matchKeyword =
      !keyword ||
      doc.title.toLowerCase().includes(keyword) ||
      doc.content.toLowerCase().includes(keyword) ||
      (doc.category ?? "").toLowerCase().includes(keyword) ||
      (doc.source ?? "").toLowerCase().includes(keyword);

    const matchCategory =
      filters.category === "ALL" || doc.category === filters.category;

    const matchSource =
      filters.source === "ALL" || doc.source === filters.source;

    const matchAccess =
      filters.accessLevel === "ALL" ||
      doc.accessLevel === filters.accessLevel;

    const matchEmbedding =
      filters.embeddingStatus === "ALL" ||
      doc.embeddingStatus === filters.embeddingStatus;

    const matchOutdated = !filters.onlyOutdated || doc.isOutdated;

    const matchAiCoverage = !filters.onlyAiCoverage || doc.needsAiCoverage;

    return (
      matchKeyword &&
      matchCategory &&
      matchSource &&
      matchAccess &&
      matchEmbedding &&
      matchOutdated &&
      matchAiCoverage
    );
  });
}

export function buildTechnicalDocumentSummary(
  documents: TechnicalDocumentItem[],
) {
  return {
    total: documents.length,
    basic: documents.filter((item) => item.accessLevel === "BASIC").length,
    advanced: documents.filter((item) => item.accessLevel === "ADVANCED").length,
    staleEmbedding: documents.filter(
      (item) =>
        item.embeddingStatus === "STALE" ||
        item.embeddingStatus === "MISSING",
    ).length,
    outdated: documents.filter((item) => item.isOutdated).length,
    aiCoverage: documents.filter((item) => item.needsAiCoverage).length,
  };
}

export function getUniqueCategories(documents: TechnicalDocumentItem[]) {
  return Array.from(
    new Set(documents.map((item) => item.category).filter(Boolean)),
  ) as string[];
}

export function getUniqueSources(documents: TechnicalDocumentItem[]) {
  return Array.from(
    new Set(documents.map((item) => item.source).filter(Boolean)),
  ) as string[];
}