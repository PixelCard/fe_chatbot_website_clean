import type {
  ChatParticipant,
  ChatSessionItem,
  MessageItem,
  QuoteCardMetadata,
  UserRole,
} from '@/app/services/common';

export type ChatViewerRole = 'CLIENT' | 'TECHNICIAN';

export type QuoteCardViewModel = {
  quoteId?: number;
  amount?: number | null;
  title: string;
  status?: string | null;
};

export function formatChatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '--:--';

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatCurrency(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Chua co gia';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getViewerSenderId(session: ChatSessionItem | null, viewerRole: ChatViewerRole) {
  if (!session) return null;

  return viewerRole === 'CLIENT' ? session.userId : session.technicianId ?? null;
}

export function getCounterpartParticipant(
  session: ChatSessionItem | null,
  viewerRole: ChatViewerRole,
): ChatParticipant | null {
  if (!session) return null;

  if (viewerRole === 'CLIENT') {
    return session.technician ?? null;
  }

  return session.user ?? null;
}

export function getCounterpartLabel(viewerRole: ChatViewerRole) {
  return viewerRole === 'CLIENT' ? 'Kỹ thuật viên' : 'Khách hàng';
}

export function isMessageMine(
  message: MessageItem,
  session: ChatSessionItem | null,
  viewerRole: ChatViewerRole,
) {
  const viewerSenderId = getViewerSenderId(session, viewerRole);

  if (viewerSenderId && message.senderId === viewerSenderId) {
    return true;
  }

  return viewerRole === 'CLIENT'
    ? message.sender?.role === 'USER'
    : message.sender?.role === 'TECHNICIAN';
}

export function isSystemMessage(message: MessageItem) {
  return message.type === 'SYSTEM_LOG' || (!message.senderId && !message.sender);
}

export function getSenderLabel(
  message: MessageItem,
  session: ChatSessionItem | null,
  viewerRole: ChatViewerRole,
) {
  if (isSystemMessage(message)) {
    return 'He thong';
  }

  if (isMessageMine(message, session, viewerRole)) {
    return viewerRole === 'CLIENT' ? 'Ban' : 'Ban';
  }

  return message.sender?.fullName?.trim() || getCounterpartLabel(viewerRole);
}

export function getQuoteCardMetadata(message: MessageItem): QuoteCardViewModel | null {
  if (message.type !== 'QUOTE_CARD') return null;

  const metadata = (message.metadata ?? {}) as QuoteCardMetadata;

  return {
    quoteId: typeof metadata.quoteId === 'number' ? metadata.quoteId : undefined,
    amount: typeof metadata.amount === 'number' ? metadata.amount : null,
    title: metadata.title?.trim() || message.content || 'Bao gia sua chua',
    status: metadata.quoteStatus ?? null,
  };
}

export function canRespondToQuote(
  message: MessageItem,
  session: ChatSessionItem | null,
  viewerRole: ChatViewerRole,
) {
  const quoteCard = getQuoteCardMetadata(message);

  if (!quoteCard || viewerRole !== 'CLIENT') return false;

  if (quoteCard.status !== 'PENDING') return false;

  return !isMessageMine(message, session, viewerRole);
}

export function getSessionTitle(
  session: ChatSessionItem | null,
  viewerRole: ChatViewerRole,
) {
  if (!session) return 'Phong chat sua chua';

  const counterpart = getCounterpartParticipant(session, viewerRole);
  const fallback =
    viewerRole === 'CLIENT'
      ? 'Kỹ thuật viên đang xử lý'
      : session.contactName?.trim() || 'Khách hàng';

  return counterpart?.fullName?.trim() || fallback;
}

export function normalizeMessageList(messages: MessageItem[]) {
  return [...messages].sort((left, right) => {
    const leftTime = new Date(left.createdAt).getTime();
    const rightTime = new Date(right.createdAt).getTime();

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return left.id - right.id;
    }

    return leftTime - rightTime;
  });
}

export function getSessionStatusTone(status: ChatSessionItem['status']) {
  if (status === 'COMPLETED' || status === 'DONE') {
    return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';
  }

  if (status === 'CANCELLED') {
    return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
  }

  if (status === 'MATCHED' || status === 'EN_ROUTE' || status === 'ARRIVED' || status === 'IN_PROGRESS') {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
  }

  return 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/70';
}

export function getParticipantRoleLabel(role?: UserRole | null, viewerRole?: ChatViewerRole) {
  if (role === 'TECHNICIAN') return 'Kỹ thuật viên';
  if (role === 'USER') return 'Khách hàng';

  return viewerRole === 'CLIENT' ? 'Kỹ thuật viên' : 'Khách hàng';
}
