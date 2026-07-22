"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { BookingModal } from "@/app/components/chatbot/BookingModal";
import { ChatComposer } from "@/app/components/chatbot/ChatComposer";
import { ChatHistorySidebar } from "@/app/components/chatbot/ChatHistorySidebar";
import { ChatMessageList } from "@/app/components/chatbot/ChatMessageList";
import { ChatTopbar } from "@/app/components/chatbot/ChatTopbar";
import { DiagnosticInfoPanel } from "@/app/components/chatbot/DiagnosticInfoPanel";
import {
  useChatbotApi,
  type ChatUiMessage,
  type DeviceSwitchResult,
  type UploadSessionMediaSuccess,
} from "@/app/hooks/useChatbotApi";
import { useChatHistoryApi } from "@/app/hooks/common/useChatHistoryApi";
import { useCustomerBooking } from "@/app/hooks/useCustomerBooking";
import type { ApiError } from "@/app/services/apiClient";
import {
  chatsService,
  type ChatHistoryItem,
  type ChatSessionItem,
  type MessageItem,
} from "@/app/services/common";

const INITIAL_ASSISTANT_MESSAGE: ChatUiMessage = {
  id: "assistant-welcome",
  type: "text",
  role: "assistant",
  content:
    "Chào bạn. Mô tả thiết bị và tình trạng lỗi, mình sẽ hỗ trợ chẩn đoán sơ bộ trước khi đặt thợ.",
};

function isDeviceSwitchResult(
  value: UploadSessionMediaSuccess | DeviceSwitchResult,
): value is DeviceSwitchResult {
  return (value as DeviceSwitchResult).deviceSwitchDetected === true;
}

function revokeObjectUrl(value: string | null) {
  if (value?.startsWith("blob:")) {
    URL.revokeObjectURL(value);
  }
}

function mapMessageToUi(
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

export default function ChatInterface() {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatUiMessage[]>([
    INITIAL_ASSISTANT_MESSAGE,
  ]);
  const [historyItems, setHistoryItems] = useState<ChatHistoryItem[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(
    null,
  );
  const [mediaDeviceType, setMediaDeviceType] = useState("");
  const [isSelectingSession, setIsSelectingSession] = useState(false);
  const [historyLoadError, setHistoryLoadError] = useState<ApiError | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [profileName] = useState(() => {
    if (typeof window === "undefined") return "Khách hàng";

    const savedProfile = window.localStorage.getItem("user_profile");
    if (!savedProfile) return "Khách hàng";

    try {
      const parsed = JSON.parse(savedProfile) as { name?: string };
      return parsed.name || "Khách hàng";
    } catch {
      return "Khách hàng";
    }
  });

  const {
    sessionId,
    chatClosed,
    conversationState,
    feedbackPending,
    feedbackSubmitted,
    isSubmitting,
    isSubmittingFeedback,
    isUploadingMedia,
    lastAiFeedback,
    error,
    clearError,
    hydrateSession,
    markBookingConfirmed,
    resetSession,
    sendMessage,
    submitFeedback,
    uploadSessionMedia,
  } = useChatbotApi();

  const {
    isSubmitting: isBooking,
    error: bookingError,
    successMessage,
    clearError: clearBookingError,
    createInitialValues,
    submitBooking,
  } = useCustomerBooking();

  const { getHistory, isSubmitting: isHistoryLoading } = useChatHistoryApi();

  const [bookingValues, setBookingValues] = useState(() =>
    createInitialValues(),
  );

  const currentDeviceLabel = useMemo(
    () =>
      bookingValues.deviceType?.trim() ||
      conversationState?.device?.trim() ||
      "Chưa xác định",
    [bookingValues.deviceType, conversationState?.device],
  );

  const currentSymptom = useMemo(
    () =>
      bookingValues.symptom?.trim() ||
      conversationState?.symptom?.trim() ||
      "",
    [bookingValues.symptom, conversationState?.symptom],
  );

  const mediaDeviceInputValue =
    mediaDeviceType ||
    bookingValues.deviceType?.trim() ||
    conversationState?.device?.trim() ||
    "";

  const showDangerBookingCta = conversationState?.risk === "RED";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting, isUploadingMedia]);

  useEffect(
    () => () => revokeObjectUrl(selectedFilePreview),
    [selectedFilePreview],
  );

  useEffect(() => {
    let isMounted = true;

    void getHistory()
      .then((items) => {
        if (isMounted) {
          setHistoryItems(items);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHistoryItems([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [getHistory]);

  const handleNewChat = () => {
    clearError();
    clearBookingError();
    setHistoryLoadError(null);
    resetSession();

    setDraft("");
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    setBookingValues(createInitialValues());

    revokeObjectUrl(selectedFilePreview);
    setSelectedFile(null);
    setSelectedFilePreview(null);
    setMediaDeviceType("");

    setIsBookingModalOpen(false);
    setIsSidebarOpen(false);
    setIsDiagnosticOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const refreshHistory = async () => {
    try {
      const items = await getHistory();
      setHistoryItems(items);
    } catch {
      // Hook handles error state separately; sidebar can keep old data.
    }
  };

  const handleSelectHistorySession = async (item: ChatHistoryItem) => {
    if (!Number.isInteger(item.id) || item.id <= 0 || item.id === sessionId) {
      return;
    }

    clearError();
    clearBookingError();
    setHistoryLoadError(null);
    setIsSelectingSession(true);

    try {
      const [session, sessionMessages] = await Promise.all([
        chatsService.getSessionById(item.id),
        chatsService.getMessages(item.id),
      ]);

      const nextMessages = sessionMessages.length
        ? sessionMessages.map((message) => mapMessageToUi(message, session))
        : [INITIAL_ASSISTANT_MESSAGE];

      hydrateSession({
        id: session.id,
        deviceType: session.deviceType,
        symptom: session.symptom,
        status: session.status,
        latestAiLogId: session.latestAiLogId,
        latestAiFeedback: session.latestAiFeedback,
      });

      setMessages(nextMessages);
      setDraft("");

      setBookingValues((prev) => ({
        ...prev,
        deviceType: session.deviceType?.trim() || "",
        symptom: session.symptom?.trim() || "",
      }));

      setIsSidebarOpen(false);
      setIsDiagnosticOpen(false);
      setIsBookingModalOpen(false);

      revokeObjectUrl(selectedFilePreview);
      setSelectedFile(null);
      setSelectedFilePreview(null);
      setMediaDeviceType("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const apiError = error as ApiError;

      setHistoryLoadError({
        message:
          apiError?.message ||
          "Không thể tải phiên chat cũ. Vui lòng thử lại.",
        status: apiError?.status,
        details: apiError?.details,
      });
    } finally {
      setIsSelectingSession(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    clearError();
    setHistoryLoadError(null);
    revokeObjectUrl(selectedFilePreview);

    setSelectedFile(file);

    setSelectedFilePreview(
      file.type.startsWith("image/") || file.type.startsWith("video/")
        ? URL.createObjectURL(file)
        : null,
    );

    setMediaDeviceType(
      (prev) =>
        prev || bookingValues.deviceType || conversationState?.device || "",
    );
  };

  const clearSelectedFile = () => {
    revokeObjectUrl(selectedFilePreview);

    setSelectedFile(null);
    setSelectedFilePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    const trimmed = draft.trim();

    if (
      (!trimmed && !selectedFile) ||
      isSubmitting ||
      isUploadingMedia ||
      chatClosed
    ) {
      return;
    }

    clearError();
    setHistoryLoadError(null);

    if (selectedFile) {
      try {
        const response = await uploadSessionMedia(selectedFile, {
          deviceType: mediaDeviceType.trim() || undefined,
          symptom: bookingValues.symptom?.trim() || undefined,
        });

        if (isDeviceSwitchResult(response)) {
          const warningMessage: ChatUiMessage = {
            id: `switch-${Date.now()}`,
            type: "device-switch",
            role: "system",
            content: response.message,
            deviceSwitch: response,
          };

          setMessages((prev) => [...prev, warningMessage]);
          return;
        }

        const isVideo = selectedFile.type.startsWith("video/");

        const mediaMessage: ChatUiMessage = {
          id: `media-${response.data.id ?? Date.now()}`,
          type: isVideo ? "video" : "image",
          role: "user",
          content: selectedFile.name,
          mediaUrl: response.fileUrl,
        };

        setMessages((prev) => [...prev, mediaMessage]);
        clearSelectedFile();
      } catch {
        // Hook already handles error state.
      }

      return;
    }

    const nextUserMessage: ChatUiMessage = {
      id: `user-${Date.now()}`,
      type: "text",
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, nextUserMessage];

    setMessages(nextMessages);
    setDraft("");

    try {
      const response = await sendMessage(trimmed, nextMessages);

      const nextAssistantMessage: ChatUiMessage = {
        id: `assistant-${response.logId ?? Date.now()}`,
        type: "text",
        role: "assistant",
        content: response.text,
      };

      setMessages((prev) => [...prev, nextAssistantMessage]);

      setBookingValues((prev) => ({
        ...prev,
        deviceType: response.state?.device?.trim() || prev.deviceType,
        symptom: response.state?.symptom?.trim() || prev.symptom,
      }));

      await refreshHistory();
    } catch {
      setMessages((prev) =>
        prev.filter((message) => message.id !== nextUserMessage.id),
      );

      setDraft(trimmed);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSend();
  };

  const handleBookingChange = (
    field: keyof typeof bookingValues,
    value: string,
  ) => {
    if (bookingError) clearBookingError();

    setBookingValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenBookingModal = () => {
    if (chatClosed) return;

    clearBookingError();
    setIsBookingModalOpen(true);
  };

  return (
    <div className="client-theme client-page-shell relative flex h-[100dvh] min-h-0 w-full overflow-hidden font-sans text-[var(--client-text-primary)] transition-colors md:h-[calc(100vh-72px)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-[-5rem] h-[260px] w-[260px] rounded-full bg-orange-300/10 blur-[90px] dark:bg-blue-600/14 sm:h-[340px] sm:w-[340px] sm:blur-[110px] lg:-left-32 lg:top-[-7rem] lg:h-[380px] lg:w-[380px] lg:blur-[120px]" />
        <div className="absolute bottom-[-7rem] right-[-5rem] h-[280px] w-[280px] rounded-full bg-amber-300/8 blur-[95px] dark:bg-cyan-500/8 sm:h-[340px] sm:w-[340px] sm:blur-[110px] lg:bottom-[-10rem] lg:right-[-6rem] lg:h-[400px] lg:w-[400px] lg:blur-[130px]" />
      </div>

      <BookingModal
        open={isBookingModalOpen}
        bookingValues={bookingValues}
        isSubmitting={isBooking}
        error={bookingError}
        successMessage={successMessage}
        onClose={() => setIsBookingModalOpen(false)}
        onChange={handleBookingChange}
        onSubmit={async () => {
          const bookedSession = await submitBooking(bookingValues, sessionId);

          markBookingConfirmed({
            id: bookedSession.id,
            deviceType: bookedSession.deviceType ?? bookingValues.deviceType,
            symptom: bookedSession.symptom ?? bookingValues.symptom,
            status: bookedSession.status,
          });

          setDraft("");
          clearSelectedFile();
          setIsBookingModalOpen(false);
          setIsDiagnosticOpen(false);

          await refreshHistory();
        }}
      />

      <ChatHistorySidebar
        isSidebarOpen={isSidebarOpen}
        profileName={profileName}
        sessionId={sessionId}
        currentDeviceLabel={currentDeviceLabel}
        historyItems={historyItems}
        isHistoryLoading={isHistoryLoading}
        isSelectingSession={isSelectingSession}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectHistorySession}
      />

      <main className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col bg-transparent transition-colors">
        <ChatTopbar
          sessionId={sessionId}
          currentDeviceLabel={currentDeviceLabel}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          onGoHome={() => router.push("/")}
        />

        <ChatMessageList
          messages={messages}
          chatClosed={chatClosed}
          feedbackPending={feedbackPending}
          feedbackSubmitted={feedbackSubmitted}
          feedbackChoice={lastAiFeedback}
          isSubmittingFeedback={isSubmittingFeedback}
          isSubmitting={isSubmitting}
          isUploadingMedia={isUploadingMedia}
          error={historyLoadError ?? error}
          messagesEndRef={messagesEndRef}
          onSubmitFeedback={submitFeedback}
        />

        <ChatComposer
          chatClosed={chatClosed}
          selectedFile={selectedFile}
          selectedFilePreview={selectedFilePreview}
          mediaDeviceType={mediaDeviceInputValue}
          draft={draft}
          fileInputRef={fileInputRef}
          isSubmitting={isSubmitting}
          isUploadingMedia={isUploadingMedia}
          hasError={Boolean(error)}
          onFileSelect={handleFileSelect}
          onClearSelectedFile={clearSelectedFile}
          onMediaDeviceTypeChange={setMediaDeviceType}
          onDraftChange={setDraft}
          onClearError={clearError}
          onSubmit={handleSubmit}
        />
      </main>

      <DiagnosticInfoPanel
        isOpen={isDiagnosticOpen}
        currentDeviceLabel={currentDeviceLabel}
        symptom={currentSymptom}
        risk={conversationState?.risk}
        sessionId={sessionId}
        showDangerBookingCta={showDangerBookingCta}
        onClose={() => setIsDiagnosticOpen(false)}
        onOpenBooking={handleOpenBookingModal}
      />
    </div>
  );
}
