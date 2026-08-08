import type {
  AiConversationContextAnswers,
  AiConversationState,
} from "@/app/services/common";
import type { ChatbotStatePayload } from "@/app/services/chatbot.service";
import type { DeviceSwitchPrompt } from "../chatbot.types";
import {
  cleanText,
  extractDeviceFromText,
  extractSymptomFromText,
  normalizeDeviceType,
  normalizeSymptom,
} from "./chatbotText";

const SESSION_CREATION_BLOCKING_FLAGS = new Set([
  "DEVICE_SYMPTOM_CONFLICT",
  "NEEDS_DEVICE_CONFIRMATION",
  "DEVICE_SWITCH_DETECTED",
]);

/** Chọn symptom tốt nhất từ state cũ, backend mới và text user hiện tại. */
function pickBetterSymptom(input: {
  previous?: string | null;
  fromBackend?: string | null;
  userText?: string | null;
}) {
  const prev = cleanText(input.previous);
  const backend = cleanText(input.fromBackend);
  const user = cleanText(input.userText);
  const dangerPattern =
    /(mùi khét|khét|cháy|bốc khói|tia lửa|rò điện|điện giật|chập|nóng bất thường|rò gas|rò nước)/i;

  if (user && dangerPattern.test(user)) return user;
  if (backend && dangerPattern.test(backend)) return backend;
  if (user && backend && user.toLowerCase().includes(backend.toLowerCase())) {
    return user.length > backend.length ? user : backend;
  }

  return [prev, backend, user].filter(Boolean).sort((a, b) => b.length - a.length)[0] || "";
}

/** Tạo nội dung cảnh báo khi user nói sang thiết bị khác trong cùng một phiên. */
export function buildDeviceSwitchPrompt(input: {
  currentDevice: string;
  detectedDevice: string;
  originalContent: string;
}): DeviceSwitchPrompt {
  return {
    currentDevice: input.currentDevice,
    detectedDevice: input.detectedDevice,
    originalContent: input.originalContent,
    message: `Phiên này đang tư vấn cho ${input.currentDevice}. Vấn đề ${input.detectedDevice} nên tạo phiên mới để không lẫn thông tin chẩn đoán.`,
  };
}

/** Kiểm tra state backend có flag chặn tạo session hoặc merge tiếp hay không. */
export function hasBlockingStateFlag(
  state?: ChatbotStatePayload | AiConversationState | null,
) {
  if (!Array.isArray(state?.flags)) {
    return false;
  }

  return state.flags.some((flag) => SESSION_CREATION_BLOCKING_FLAGS.has(flag));
}

/** Suy ra trạng thái feedback từ metadata hiện tại của phiên AI. */
export function deriveFeedbackState(input: {
  chatClosed: boolean;
  lastAiLogId: number | null;
  lastAiFeedback: "LIKE" | "DISLIKE" | null;
}) {
  const feedbackSubmitted =
    input.lastAiFeedback === "LIKE" || input.lastAiFeedback === "DISLIKE";
  return {
    feedbackSubmitted,
    feedbackPending:
      input.chatClosed && input.lastAiLogId !== null && !feedbackSubmitted,
  };
}

/** Merge contextAnswers mới nhưng không xóa dữ liệu cũ nếu backend không trả lại key đó. */
export function mergeContextAnswers(
  previousValue?: AiConversationContextAnswers | null,
  nextValue?: AiConversationContextAnswers | null,
) {
  const merged: AiConversationContextAnswers = { ...(previousValue ?? {}) };

  for (const [key, value] of Object.entries(nextValue ?? {})) {
    if (typeof value === "string" && value.trim()) {
      merged[key as keyof AiConversationContextAnswers] = value.trim();
    }
  }

  return merged;
}

/** Gộp state cũ + state mới từ backend và chặn việc ghi đè sang thiết bị khác. */
export function mergeConversationState(
  previousState: AiConversationState | null,
  responseState: ChatbotStatePayload | AiConversationState | null | undefined,
  latestUserMessage: string,
): { nextState: AiConversationState | null; deviceSwitchPrompt: DeviceSwitchPrompt | null } {
  const previousDevice = normalizeDeviceType(previousState?.device);
  const responseDevice = hasBlockingStateFlag(responseState)
    ? previousDevice
    : normalizeDeviceType(responseState?.device);
  const latestMessageDevice = extractDeviceFromText(latestUserMessage);

  const previousSymptom = normalizeSymptom(previousState?.symptom, true);
  const responseSymptom = pickBetterSymptom({
    previous: previousState?.symptom,
    fromBackend: normalizeSymptom(responseState?.symptom, true),
    userText: latestUserMessage,
  });
  const latestMessageSymptom = extractSymptomFromText(latestUserMessage);

  const mergedDevice =
    responseDevice ??
    (hasBlockingStateFlag(responseState) ? null : latestMessageDevice) ??
    previousDevice ??
    null;
  const mergedSymptom =
    responseSymptom ?? latestMessageSymptom ?? previousSymptom ?? null;

  if (previousDevice && mergedDevice && previousDevice !== mergedDevice) {
    return {
      nextState: previousState,
      deviceSwitchPrompt: buildDeviceSwitchPrompt({
        currentDevice: previousDevice,
        detectedDevice: mergedDevice,
        originalContent: latestUserMessage,
      }),
    };
  }

  if (!previousState && !responseState && !mergedDevice && !mergedSymptom) {
    return { nextState: null, deviceSwitchPrompt: null };
  }

  const mergedContextAnswers = mergeContextAnswers(
    previousState?.contextAnswers,
    responseState?.contextAnswers,
  );

  return {
    nextState: {
      ...(previousState ?? {}),
      ...(responseState ?? {}),
      device: mergedDevice,
      symptom: mergedSymptom,
      phase: responseState?.phase ?? previousState?.phase ?? "COLLECTING",
      risk: responseState?.risk ?? previousState?.risk ?? "UNKNOWN",
      flags: responseState?.flags ?? previousState?.flags ?? [],
      contextAnswers: mergedContextAnswers,
      contextQuestionsAsked:
        responseState?.contextQuestionsAsked ??
        previousState?.contextQuestionsAsked,
      contextQuestionSet:
        responseState?.contextQuestionSet ??
        previousState?.contextQuestionSet ??
        null,
      askedFollowupKey:
        responseState?.contextQuestionSet &&
        responseState.contextQuestionSet !== previousState?.contextQuestionSet
          ? responseState?.askedFollowupKey ?? null
          : responseState?.askedFollowupKey ??
            previousState?.askedFollowupKey ??
            null,
    },
    deviceSwitchPrompt: null,
  };
}
