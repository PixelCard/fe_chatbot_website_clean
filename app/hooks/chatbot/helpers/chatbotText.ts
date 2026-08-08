const DEVICE_ALIASES: Record<string, string> = {
  "lo vi song": "Lò vi sóng",
  "lo nuong": "Lò nướng",
  microwave: "Lò vi sóng",
  "may rua bat": "Máy rửa bát",
  "may rua chen": "Máy rửa bát",
  dishwasher: "Máy rửa bát",
  "may lanh": "Điều hòa",
  "dieu hoa": "Điều hòa",
  "air conditioner": "Điều hòa",
  "tu lanh": "Tủ lạnh",
  "tu dong": "Tủ lạnh",
  "cai tu": "Tủ lạnh",
  fridge: "Tủ lạnh",
  refrigerator: "Tủ lạnh",
  "may nuoc nong": "Máy nước nóng",
  "binh nong lanh": "Máy nước nóng",
  "may say": "Máy sấy",
  "may giat": "Máy giặt",
  "washing machine": "Máy giặt",
  "bep tu": "Bếp từ",
  "bep dien": "Bếp điện",
  "noi chien khong dau": "Nồi chiên không dầu",
  "noi chien": "Nồi chiên không dầu",
  "noi com dien": "Nồi cơm điện",
  "may pha ca phe": "Máy pha cà phê",
  "may hut mui": "Máy hút mùi",
  "may hut bui": "Máy hút bụi",
  "robot hut bui": "Robot hút bụi",
  "may lau nha": "Máy lau nhà",
  "may loc khong khi": "Máy lọc không khí",
  "may hut am": "Máy hút ẩm",
  "may tao am": "Máy tạo ẩm",
  "may loc nuoc": "Máy lọc nước",
  tivi: "Tivi",
  tv: "Tivi",
  "man hinh": "Màn hình",
  loa: "Loa",
};

const SYMPTOM_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  {
    pattern:
      /\b(?:khong|ko|k|kh)\s+lanh\b|\b(?:khong|ko|k|kh)\s+mat\b|\bkhong\s+lam\s+mat\b|\bphong\s+ham\s+ham\b|\bchang\s+thay\s+mat\b/,
    value: "Không lạnh",
  },
  {
    pattern:
      /\bkhong\s+nong\b|\bkhong\s+lam\s+nong(?:\s+thuc\s+an)?\b|\bdo\s+an\s+van\s+nguoi\b|\bquay\s+xong\s+van\s+nguoi\b/,
    value: "Không nóng",
  },
  { pattern: /\bkhong\s+dong\s+da\b/, value: "Không đông đá" },
  { pattern: /\bkhong\s+vat\b/, value: "Không vắt" },
  { pattern: /\bkhong\s+len\s+nguon\b/, value: "Không lên nguồn" },
  { pattern: /\bkhong\s+chay\b/, value: "Không chạy" },
  { pattern: /\bkhong\s+hoat\s+dong\b/, value: "Không hoạt động" },
  { pattern: /\bbi\s+hu\b/, value: "Bị hư" },
  { pattern: /\bhu\s+roi\b/, value: "Hư rồi" },
];

/** Làm sạch text đầu vào và chặn các giá trị giả như "null"/"undefined". */
export function cleanText(value?: string | null) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const comparable = trimmed.toLowerCase();
  if (comparable === "null" || comparable === "undefined") {
    return "";
  }

  return trimmed;
}

/** Chuẩn hóa text về dạng không dấu để so khớp alias/rule ổn định hơn. */
export function toComparableText(value?: string | null) {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Escape text để đưa an toàn vào RegExp động. */
export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Map tên thiết bị đời thường về nhãn canonical đang dùng trong UI/API. */
export function findCanonicalDevice(value?: string | null) {
  const comparable = toComparableText(value);

  if (!comparable) {
    return null;
  }

  for (const [alias, canonical] of Object.entries(DEVICE_ALIASES)) {
    const matcher = new RegExp(`(?:^|\\s)${escapeRegExp(alias)}(?:\\s|$)`);
    if (matcher.test(comparable)) {
      return canonical;
    }
  }

  return null;
}

/** Ưu tiên label canonical, nếu không có thì giữ nguyên label đã làm sạch. */
export function inferDeviceLabel(value?: string | null) {
  const cleaned = cleanText(value);
  if (!cleaned) {
    return null;
  }

  return findCanonicalDevice(cleaned) ?? cleaned;
}

/** Dò symptom canonical từ câu người dùng bằng rule-based regex. */
export function extractSymptomCandidate(value?: string | null) {
  const comparable = toComparableText(value);

  if (!comparable) {
    return null;
  }

  for (const symptom of SYMPTOM_PATTERNS) {
    if (symptom.pattern.test(comparable)) {
      return symptom.value;
    }
  }

  return null;
}

/** Chuẩn hóa device type để dùng nhất quán trong state và header UI. */
export function normalizeDeviceType(value?: string | null) {
  return inferDeviceLabel(value);
}

/** Chuẩn hóa symptom; có thể giữ free text nếu caller cho phép. */
export function normalizeSymptom(
  value?: string | null,
  allowFreeText: boolean = false,
) {
  const cleaned = cleanText(value);
  const explicitSymptom = extractSymptomCandidate(cleaned);

  if (!allowFreeText && explicitSymptom) return explicitSymptom;

  if (!cleaned || findCanonicalDevice(cleaned)) {
    return null;
  }

  if (!allowFreeText) return null;

  const hasDangerDetail =
    /(mùi khét|khét|cháy|bốc khói|tia lửa|rò điện|điện giật|chập|nóng bất thường|rò gas|rò nước)/i.test(
      cleaned,
    );
  const isLongDescription = cleaned.length >= 24 || cleaned.split(/\s+/).length >= 6;
  const extractedIsTooShort =
    explicitSymptom != null &&
    explicitSymptom.trim().length <= cleaned.length * 0.55;

  if (hasDangerDetail || (isLongDescription && extractedIsTooShort)) {
    return cleaned;
  }

  return explicitSymptom || cleaned;
}

/** Trích thiết bị từ text người dùng theo alias canonical. */
export function extractDeviceFromText(value?: string | null) {
  return findCanonicalDevice(value);
}

/** Trích symptom canonical ngắn gọn từ câu người dùng. */
export function extractSymptomFromText(value?: string | null) {
  return extractSymptomCandidate(value);
}
