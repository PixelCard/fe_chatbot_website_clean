import type { ChatSessionItem, MessageItem } from "@/app/services/common";
import type {
  ChatUiMessage,
  DeviceSwitchResult,
  UploadSessionMediaSuccess,
} from "@/app/hooks/chatbot/chatbot.types";

export const INITIAL_ASSISTANT_MESSAGE: ChatUiMessage = {
  id: "assistant-welcome",
  type: "text",
  role: "assistant",
  content:
    "Chào bạn. Mô tả thiết bị và tình trạng lỗi, mình sẽ hỗ trợ chẩn đoán sơ bộ trước khi đặt thợ.",
};

/** Kiểm tra response upload có phải là payload cảnh báo lệch thiết bị hay không. */
export function isDeviceSwitchResult(
  value: UploadSessionMediaSuccess | DeviceSwitchResult,
): value is DeviceSwitchResult {
  return (value as DeviceSwitchResult).deviceSwitchDetected === true;
}

/** Thu hồi blob URL cũ để tránh rò rỉ bộ nhớ khi preview file. */
export function revokeObjectUrl(value: string | null) {
  if (value?.startsWith("blob:")) {
    URL.revokeObjectURL(value);
  }
}

/** Làm sạch label hiển thị để chặn string rác như "null"/"undefined". */
export function cleanDisplayValue(value?: string | null) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const comparable = trimmed.toLowerCase();
  return comparable === "null" || comparable === "undefined" ? "" : trimmed;
}

/** Map message backend sang bubble UI tương ứng cho khu chat web. */
export function mapMessageToUi(
  message: MessageItem,
  session: Pick<ChatSessionItem, "userId">,
): ChatUiMessage {
  const role =
    message.senderId && message.senderId === session.userId
      ? "user"
      : "assistant";

  if (message.type === "IMAGE") {
    return {
      id: `message-${message.id}`,
      type: "image",
      role,
      content:
        typeof message.metadata?.fileName === "string" &&
        message.metadata.fileName.trim()
          ? message.metadata.fileName
          : message.content,
      mediaUrl: message.content,
    };
  }

  if (message.type === "VIDEO") {
    return {
      id: `message-${message.id}`,
      type: "video",
      role,
      content:
        typeof message.metadata?.fileName === "string" &&
        message.metadata.fileName.trim()
          ? message.metadata.fileName
          : message.content,
      mediaUrl: message.content,
    };
  }

  return {
    id: `message-${message.id}`,
    type: "text",
    role,
    content: message.content,
  };
}

/** Lấy tên profile đã lưu ở localStorage để hiển thị ở sidebar. */
export function getStoredProfileName() {
  if (typeof window === "undefined") return "Khách hàng";

  const savedProfile = window.localStorage.getItem("user_profile");
  if (!savedProfile) return "Khách hàng";

  try {
    const parsed = JSON.parse(savedProfile) as { name?: string };
    return parsed.name || "Khách hàng";
  } catch {
    return "Khách hàng";
  }
}
