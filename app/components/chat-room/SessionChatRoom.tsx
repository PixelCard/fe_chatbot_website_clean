'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  MapPin,
  Paperclip,
  Phone,
  Send,
  Video,
  Wrench,
  XCircle,
} from 'lucide-react';
import { useSessionChatRoom } from '@/app/hooks/useSessionChatRoom';
import {
  canRespondToQuote,
  formatChatTime,
  formatCurrency,
  getCounterpartLabel,
  getCounterpartParticipant,
  getParticipantRoleLabel,
  getQuoteCardMetadata,
  getSenderLabel,
  getSessionStatusTone,
  getSessionTitle,
  isMessageMine,
  isSystemMessage,
  type ChatViewerRole,
} from './chatRoom.utils';

type SessionChatRoomProps = {
  sessionId: number;
  viewerRole: ChatViewerRole;
  backHref: string;
};

export default function SessionChatRoom({
  sessionId,
  viewerRole,
  backHref,
}: SessionChatRoomProps) {
  const {
    session,
    messages,
    isLoading,
    error,
    isSending,
    isCreatingQuote,
    isUploading,
    pendingQuoteMessageId,
    reload,
    sendTextMessage,
    createQuote,
    respondToQuote,
    uploadMedia,
  } = useSessionChatRoom({ sessionId, viewerRole });
  const [draft, setDraft] = useState('');
  const [isQuoteComposerOpen, setIsQuoteComposerOpen] = useState(false);
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const counterpart = useMemo(
    () => getCounterpartParticipant(session, viewerRole),
    [session, viewerRole],
  );
  const sessionTitle = useMemo(() => getSessionTitle(session, viewerRole), [session, viewerRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const content = draft.trim();

    if (!content || isSending) return;

    await sendTextMessage(content);
    setDraft('');
  };

  const handleSubmitQuote = async () => {
    const amount = Number(quoteAmount.replace(/[^\d]/g, ''));

    if (!quoteTitle.trim() || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    await createQuote({ title: quoteTitle, amount });
    setQuoteTitle('');
    setQuoteAmount('');
    setIsQuoteComposerOpen(false);
  };

  const handleChooseImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    await uploadMedia(file);
    event.target.value = '';
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-white/70">
          <Loader2 className="h-6 w-6 animate-spin text-[#10d481]" />
          <p>Dang tai phong chat...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
            <div>
              <h1 className="text-base font-semibold text-red-100">Khong tai duoc phong chat</h1>
              <p className="mt-1 text-sm text-red-100/90">
                {error?.message || 'Session khong ton tai hoac ban khong co quyen truy cap.'}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => void reload()}
                  className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-medium text-red-100 transition-colors hover:bg-red-500/20"
                >
                  Thu lai
                </button>
                <Link
                  href={backHref}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Quay lai
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        'client-page-shell flex h-[100dvh] min-h-0 w-full overflow-hidden text-[var(--client-text-primary)]',
        viewerRole === 'CLIENT' ? 'md:mt-[72px] md:h-[calc(100dvh-72px)]' : '',
      ].join(' ')}
    >
      <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--client-shell-bg)]">
        <header className="client-header-surface flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={backHref} className="text-gray-400 transition-colors hover:text-[#10d481]">
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10d481]/10 text-[#10d481]">
              <Wrench className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                {sessionTitle}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  {getCounterpartLabel(viewerRole)}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getSessionStatusTone(session.status)}`}
                >
                  {session.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <button type="button" className="transition-colors hover:text-[#10d481]">
              <Phone className="h-5 w-5" />
            </button>
            <button type="button" className="transition-colors hover:text-[#10d481]">
              <Video className="h-5 w-5" />
            </button>
            <button type="button" className="transition-colors hover:text-[#10d481]">
              <Info className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {messages.map((message) => {
              const mine = isMessageMine(message, session, viewerRole);
              const systemMessage = isSystemMessage(message);
              const quoteCard = getQuoteCardMetadata(message);

              if (systemMessage) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="max-w-[90%] rounded-lg border border-[#10d481]/30 bg-[#10d481]/10 px-4 py-2 text-center text-xs font-medium text-[#10d481]">
                      {message.content}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className={`flex w-full ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex max-w-[90%] flex-col sm:max-w-[72%]">
                    {!mine ? (
                      <span className="mb-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        {getSenderLabel(message, session, viewerRole)}
                      </span>
                    ) : null}

                    {message.type === 'IMAGE' ? (
                      <div
                        className={`overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-1 shadow-sm dark:border-white/10 dark:bg-[#151E32] ${mine ? 'rounded-br-none' : 'rounded-bl-none'}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={message.content}
                          alt="media"
                          className="h-auto w-64 max-w-full rounded-xl object-cover"
                        />
                      </div>
                    ) : quoteCard ? (
                      <div
                        className={`w-72 max-w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-white/10 dark:bg-[#151E32] ${mine ? 'rounded-br-none' : 'rounded-bl-none'}`}
                      >
                        <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-white/5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20">
                            <FileText className="h-4 w-4" />
                          </div>
                          <h4 className="text-sm font-bold dark:text-white">Phieu bao gia</h4>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400">{quoteCard.title}</p>
                        <p className="mt-2 text-xl font-bold text-[#10d481]">
                          {formatCurrency(quoteCard.amount)}
                        </p>

                        {canRespondToQuote(message, session, viewerRole) ? (
                          <div className="mt-4 flex gap-2">
                            <button
                              type="button"
                              disabled={pendingQuoteMessageId === message.id}
                              onClick={() => void respondToQuote(message.id, 'REJECTED')}
                              className="flex-1 rounded-lg bg-gray-100 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-60 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                            >
                              {pendingQuoteMessageId === message.id ? 'Dang xu ly...' : 'Tu choi'}
                            </button>
                            <button
                              type="button"
                              disabled={pendingQuoteMessageId === message.id}
                              onClick={() => void respondToQuote(message.id, 'ACCEPTED')}
                              className="flex-1 rounded-lg bg-[#10d481] py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#0eac69] disabled:opacity-60"
                            >
                              {pendingQuoteMessageId === message.id ? 'Dang xu ly...' : 'Chap nhan'}
                            </button>
                          </div>
                        ) : (
                          <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-xs font-bold text-slate-600 dark:bg-white/5 dark:text-white/70">
                            <CheckCircle2 className="h-4 w-4" />
                            {quoteCard.status || 'Da gui bao gia'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          mine
                            ? 'rounded-br-none bg-gradient-to-r from-[#10d481] to-[#05a3f0] text-white'
                            : 'rounded-bl-none bg-gray-100 text-gray-800 dark:bg-[#151E32] dark:text-gray-200'
                        }`}
                      >
                        {message.content}
                      </div>
                    )}

                    <span
                      className={`mt-1 text-[10px] text-gray-400 ${
                        mine ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatChatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {viewerRole === 'TECHNICIAN' ? (
          <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0B1221] sm:px-6">
            <button
              type="button"
              onClick={() => setIsQuoteComposerOpen((prev) => !prev)}
              className="mb-3 inline-flex items-center gap-2 rounded-xl border border-[#10d481]/30 bg-[#10d481]/10 px-4 py-2 text-sm font-semibold text-[#10d481] transition-colors hover:bg-[#10d481]/20"
            >
              <FileText className="h-4 w-4" />
              {isQuoteComposerOpen ? 'Dong tao bao gia' : 'Tao bao gia'}
            </button>

            {isQuoteComposerOpen ? (
              <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-[#151E32] p-4 md:grid-cols-[minmax(0,1fr)_180px_auto]">
                <input
                  type="text"
                  value={quoteTitle}
                  onChange={(event) => setQuoteTitle(event.target.value)}
                  placeholder="Noi dung bao gia"
                  className="h-11 rounded-xl border border-white/10 bg-[#0B1221] px-4 text-sm text-white outline-none placeholder:text-white/40"
                />
                <input
                  type="number"
                  min="0"
                  value={quoteAmount}
                  onChange={(event) => setQuoteAmount(event.target.value)}
                  placeholder="So tien"
                  className="h-11 rounded-xl border border-white/10 bg-[#0B1221] px-4 text-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="button"
                  disabled={isCreatingQuote}
                  onClick={() => void handleSubmitQuote()}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#10d481] px-4 text-sm font-semibold text-[#07111F] transition-colors hover:bg-[#22D3EE] disabled:opacity-60"
                >
                  {isCreatingQuote ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Gui quote'}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="shrink-0 border-t border-[var(--client-card-border)] bg-[var(--client-shell-bg)] p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-full bg-[var(--client-muted-bg)] px-3 py-2 sm:gap-3 sm:px-4">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 transition-colors hover:text-[#10d481] disabled:opacity-60"
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="hidden text-gray-400 transition-colors hover:text-[#10d481] sm:block"
            >
              <ImageIcon className="h-5 w-5" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(event) => void handleChooseImage(event)}
              className="hidden"
            />

            <input
              type="text"
              placeholder="Nhap tin nhan..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-gray-400 dark:text-white"
              disabled={isSending}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
            />

            <button
              type="button"
              disabled={isSending || !draft.trim()}
              onClick={() => void handleSendMessage()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#10d481] to-[#05a3f0] text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="ml-0.5 h-4 w-4" />}
            </button>
          </div>
        </div>
      </main>

      <aside className="hidden w-80 shrink-0 flex-col border-l border-[var(--client-card-border)] bg-[var(--client-shell-soft-bg)] lg:flex">
        <div className="border-b border-[var(--client-card-border)] p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#10d481]/10 text-[#10d481]">
            <Wrench className="h-10 w-10" />
          </div>
          <h2 className="mt-4 text-lg font-bold dark:text-white">{sessionTitle}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {getParticipantRoleLabel(counterpart?.role, viewerRole)}
          </p>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Thong tin phien
            </h3>
            <div className="space-y-3 text-sm dark:text-gray-300">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-gray-400" />
                <span>Session #{session.id}</span>
              </div>
              <div className="flex items-start gap-3">
                <Wrench className="mt-0.5 h-4 w-4 text-gray-400" />
                <span>{session.deviceType || 'Chua cap nhat thiet bi'}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                <span>{session.address || 'Chua cap nhat dia chi'}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gray-400" />
                <span>{session.contactPhone || 'Chua co so dien thoai'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Mo ta loi
            </h3>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-white/10 dark:bg-[#0B1221] dark:text-white/70">
              {session.symptom || session.aiSummary || 'Chua co mo ta chi tiet.'}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
