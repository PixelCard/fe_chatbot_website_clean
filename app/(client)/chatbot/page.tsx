"use client";

import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { BookingModal } from "@/app/components/chatbot/BookingModal";
import { ChatComposer } from "@/app/components/chatbot/ChatComposer";
import { ChatHistorySidebar } from "@/app/components/chatbot/ChatHistorySidebar";
import {
  cleanDisplayValue,
  getStoredProfileName,
  INITIAL_ASSISTANT_MESSAGE,
  isDeviceSwitchResult,
  mapMessageToUi,
} from "@/app/components/chatbot/chatbotPage.helpers";
import { ChatMessageList } from "@/app/components/chatbot/ChatMessageList";
import { ChatTopbar } from "@/app/components/chatbot/ChatTopbar";
import { DiagnosticInfoPanel } from "@/app/components/chatbot/DiagnosticInfoPanel";
import { useChatMediaPicker } from "@/app/hooks/chatbot/useChatMediaPicker";
import {
  useChatbotApi,
  type ChatUiMessage,
} from "@/app/hooks/useChatbotApi";
import { useChatHistoryApi } from "@/app/hooks/common/useChatHistoryApi";
import { useCustomerBooking } from "@/app/hooks/useCustomerBooking";
import type { ApiError } from "@/app/services/apiClient";
import type { ChatHistoryItem } from "@/app/services/common";
import { chatbotWebSessionService } from "@/app/services/chatbotWebSession.service";

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
  const [isSelectingSession, setIsSelectingSession] = useState(false);

  const [historyLoadError, setHistoryLoadError] = useState<ApiError | null>(
    null,
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [profileName] = useState(getStoredProfileName);

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

  const {
    selectedFile,
    selectedFilePreview,
    mediaDeviceType,
    setMediaDeviceType,
    fileInputRef,
    handleFileSelect,
    clearSelectedFile,
    resetMediaPicker,
  } = useChatMediaPicker({
    getDefaultDeviceType: () =>
      cleanDisplayValue(bookingValues.deviceType) ||
      cleanDisplayValue(conversationState?.device) ||
      "",
    onBeforeSelect: () => {
      clearError();
      setHistoryLoadError(null);
    },
  });

  const currentDeviceLabel = useMemo(
    () =>
      cleanDisplayValue(bookingValues.deviceType) ||
      cleanDisplayValue(conversationState?.device) ||
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
    cleanDisplayValue(mediaDeviceType) ||
    cleanDisplayValue(bookingValues.deviceType) ||
    cleanDisplayValue(conversationState?.device) ||
    "";

  const showDangerBookingCta =
    conversationState?.canBook === true ||
    conversationState?.phase === "READY_TO_BOOK";

  useEffect(() => {
    const scrollContainer = messagesEndRef.current?.closest(
      '[data-chat-scroll-container="true"]',
    );

    if (!(scrollContainer instanceof HTMLDivElement)) {
      return;
    }

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSubmitting, isUploadingMedia]);

  useEffect(() => {
    let isMounted = true;

    void getHistory()
      .then((items) => {
        if (isMounted) {
          setHistoryItems(
            items.map((item) => ({
              ...item,
              deviceType: cleanDisplayValue(item.deviceType),
            })),
          );
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

  const handleNewChat = useCallback(() => {
    clearError();
    clearBookingError();
    setHistoryLoadError(null);

    resetSession();

    setDraft("");
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    setBookingValues(createInitialValues());

    resetMediaPicker();

    setIsBookingModalOpen(false);
    setIsSidebarOpen(false);
    setIsDiagnosticOpen(false);
  }, [
    clearBookingError,
    clearError,
    createInitialValues,
    resetMediaPicker,
    resetSession,
  ]);

  const refreshHistory = useCallback(async () => {
    try {
      const items = await getHistory();

      setHistoryItems(
        items.map((item) => ({
          ...item,
          deviceType: cleanDisplayValue(item.deviceType),
        })),
      );
    } catch {
      // Hook handles error state separately; sidebar can keep old data.
    }
  }, [getHistory]);

  const handleSelectHistorySession = useCallback(
    async (item: ChatHistoryItem) => {
      if (!Number.isInteger(item.id) || item.id <= 0 || item.id === sessionId) {
        return;
      }

      clearError();
      clearBookingError();
      setHistoryLoadError(null);
      setIsSelectingSession(true);

      try {
        const [session, sessionMessages] = await Promise.all([
          chatbotWebSessionService.getSessionById(item.id),
          chatbotWebSessionService.getMessages(item.id),
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
          aiStateSnapshot: session.aiStateSnapshot,
        });

        setMessages(nextMessages);
        setDraft("");

        setBookingValues((prev) => ({
          ...prev,
          deviceType: cleanDisplayValue(session.deviceType),
          symptom: cleanDisplayValue(session.symptom),
        }));

        setIsSidebarOpen(false);
        setIsDiagnosticOpen(false);
        setIsBookingModalOpen(false);

        resetMediaPicker();
      } catch (requestError) {
        const apiError = requestError as ApiError;

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
    },
    [
      clearBookingError,
      clearError,
      hydrateSession,
      resetMediaPicker,
      sessionId,
    ],
  );

  const handleSend = useCallback(async () => {
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
        deviceType:
          cleanDisplayValue(response.state?.device) || prev.deviceType,
        symptom: cleanDisplayValue(response.state?.symptom) || prev.symptom,
      }));

      await refreshHistory();
    } catch {
      setMessages((prev) =>
        prev.filter((message) => message.id !== nextUserMessage.id),
      );

      setDraft(trimmed);
    }
  }, [
    bookingValues.symptom,
    chatClosed,
    clearError,
    clearSelectedFile,
    draft,
    isSubmitting,
    isUploadingMedia,
    mediaDeviceType,
    messages,
    refreshHistory,
    selectedFile,
    sendMessage,
    uploadSessionMedia,
  ]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await handleSend();
    },
    [handleSend],
  );

  const handleBookingChange = useCallback(
    (field: keyof typeof bookingValues, value: string) => {
      if (bookingError) {
        clearBookingError();
      }

      setBookingValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [bookingError, clearBookingError],
  );

  const handleOpenBookingModal = useCallback(() => {
    /*
     * Guard phía FE:
     * Không mở modal nếu phiên đã đóng hoặc risk không phải RED.
     */
    if (
      chatClosed ||
      (conversationState?.canBook !== true &&
        conversationState?.phase !== "READY_TO_BOOK")
    ) {
      return;
    }

    clearBookingError();
    setIsBookingModalOpen(true);
  }, [
    chatClosed,
    clearBookingError,
    conversationState?.canBook,
    conversationState?.phase,
  ]);

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
          const bookedSession = await submitBooking(
            bookingValues,
            sessionId,
          );

          markBookingConfirmed({
            id: bookedSession.id,
            deviceType:
              bookedSession.deviceType ?? bookingValues.deviceType,
            symptom: bookedSession.symptom ?? bookingValues.symptom,
            status: bookedSession.status,
          });

          /*
           * Không reset messages.
           * Transcript hiện tại được giữ nguyên sau booking.
           */
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
        chatClosed={chatClosed}
        showDangerBookingCta={showDangerBookingCta}
        onClose={() => setIsDiagnosticOpen(false)}
        onOpenBooking={handleOpenBookingModal}
      />
    </div>
  );
}
