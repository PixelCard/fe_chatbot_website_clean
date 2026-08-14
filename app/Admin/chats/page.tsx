"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import { ChatActionDrawer } from "./components/ChatActionDrawer";
import { ChatFilterBar } from "./components/Chatfillter/ChatFilterBar";
import { ChatThreadPanel } from "./components/ChatThreadPanel";
import { SessionListPanel } from "./components/SessionListPanel";
import { useChatsApi } from "./hooks";
import type { ChatSessionListQuery } from "./services/chat.service";
import { defaultChatFilters, type ChatFilterState } from "./types/chat.types";
import AdminToastStack, {
  type AdminToast,
} from "@/app/components/admin/AdminToastStack";

export default function AdminChatsPage() {
  const [filters, setFilters] = useState<ChatFilterState>(defaultChatFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [flagOverrides, setFlagOverrides] = useState<
    Record<string, { isFlagged: boolean; flagReason: string | null }>
  >({});
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const pushToast = (type: AdminToast["type"], text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const query = useMemo<ChatSessionListQuery>(
    () => ({
      keyword: filters.search.trim() || undefined,
      status: filters.status === "ALL" ? undefined : filters.status,
      address: filters.address.trim() || undefined,
      technicianName: filters.technicianName.trim() || undefined,
      isDangerous: filters.isDangerous === "YES" ? true : undefined,
      isFlagged: filters.isFlagged === "YES" ? true : undefined,
    }),
    [filters],
  );

  const {
    items: sessions,
    isLoading,
    error,
    refetch,
    updateQuery,
    selectedSession,
    loadSessionDetail,
  } = useChatsApi(query);

  useEffect(() => {
    updateQuery(query);
  }, [query, updateQuery]);

  const mergedSessions = useMemo(
    () =>
      sessions.map((session) => {
        const override = flagOverrides[session.id];
        if (!override) return session;
        return {
          ...session,
          isFlagged: override.isFlagged,
          flagReason: override.flagReason,
        };
      }),
    [flagOverrides, sessions],
  );

  const filteredSessions = mergedSessions.filter((session) => {
    const matchesSearch = filters.search
      ? session.customerName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        session.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        session.customerPhone.includes(filters.search)
      : true;

    const matchesStatus =
      filters.status !== "ALL" ? session.status === filters.status : true;
    const matchesAddress = filters.address
      ? session.address.toLowerCase().includes(filters.address.toLowerCase())
      : true;
    const matchesTechnician = filters.technicianName
      ? session.technicianName
          ?.toLowerCase()
          .includes(filters.technicianName.toLowerCase())
      : true;
    const matchesDangerous =
      filters.isDangerous === "YES" ? session.isDangerous === true : true;
    const matchesFlagged =
      filters.isFlagged === "YES" ? session.isFlagged === true : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesAddress &&
      matchesTechnician &&
      matchesDangerous &&
      matchesFlagged
    );
  });

  const activeSelectedId = filteredSessions.some(
    (session) => session.id === selectedId,
  )
    ? selectedId
    : filteredSessions[0]?.id ?? null;

  const currentSession =
    selectedSession && selectedSession.id === activeSelectedId
      ? {
          ...selectedSession,
          ...(flagOverrides[selectedSession.id]
            ? flagOverrides[selectedSession.id]
            : {}),
        }
      : mergedSessions.find((session) => session.id === activeSelectedId) || null;

  useEffect(() => {
    if (isLoading || !activeSelectedId) {
      return;
    }

    if (selectedSession?.id === activeSelectedId) {
      return;
    }

    void loadSessionDetail(activeSelectedId);
  }, [activeSelectedId, isLoading, loadSessionDetail, selectedSession?.id]);

  const handleToggleFlag = () => {
    if (!activeSelectedId) return;
    const selected = mergedSessions.find((item) => item.id === activeSelectedId);
    if (!selected) return;

    setFlagOverrides((prev) => ({
      ...prev,
      [activeSelectedId]: {
        isFlagged: !selected.isFlagged,
        flagReason: !selected.isFlagged
          ? "Điều phối viên cưỡng chế can thiệp rủi ro thực địa"
          : null,
      },
    }));
  };

  return (
    <AdminShell>
      <div className="relative flex min-h-[calc(100vh-132px)] min-h-0 flex-col gap-4 overflow-hidden px-1 py-0.5 text-[var(--admin-theme-text)]">
        <ChatFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultChatFilters)}
        />

        {error ? (
          <section className="rounded-2xl border border-rose-300/80 bg-rose-50 p-4 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-500/30 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-rose-500/10">
            <p className="text-sm text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200">
              Không tải được danh sách phiên chat: {error.message}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 h-10 rounded-lg border border-rose-300/70 px-4 text-sm font-semibold text-rose-700 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-rose-300/40 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-rose-200"
            >
              Thử lại
            </button>
          </section>
        ) : null}

        {isLoading ? (
          <section className="admin-card rounded-2xl p-4 text-sm text-[var(--admin-muted-text)]">
            Đang tải phiên chat...
          </section>
        ) : null}

        <section className="relative grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden xl:grid-cols-[minmax(380px,420px)_minmax(0,1fr)] 2xl:grid-cols-[minmax(400px,440px)_minmax(0,1fr)]">
          <div className="min-h-0 overflow-hidden">
            <SessionListPanel
              sessions={filteredSessions}
              selectedId={activeSelectedId}
              onSelect={(session) => {
                setSelectedId(session.id);
                setIsDrawerOpen(false);
                void loadSessionDetail(session.id);
              }}
              showFlaggedOnly={false}
            />
          </div>

          <div className="min-h-0 overflow-hidden">
            <ChatThreadPanel
              session={currentSession}
              onOpenDrawer={() => setIsDrawerOpen(true)}
            />
          </div>
        </section>

        <AnimatePresence>
          {isDrawerOpen && currentSession ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 220 }}
                className="fixed bottom-0 right-0 top-0 z-50 w-[min(380px,calc(100vw-12px))] border-l border-[var(--admin-soft-panel-border)] bg-[var(--admin-card-bg)] p-3 shadow-[-18px_0_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:w-[400px] sm:p-4"
              >
                <ChatActionDrawer
                  session={currentSession}
                  onClose={() => setIsDrawerOpen(false)}
                  onToggleFlag={handleToggleFlag}
                />
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>

      <AdminToastStack
        toasts={toasts}
        onRemove={(id) =>
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </AdminShell>
  );
}
