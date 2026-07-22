import SessionChatRoom from '@/app/components/chat-room/SessionChatRoom';
import { APP_ROUTES } from '@/app/config/routes';

export default async function ClientChatRoomPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <SessionChatRoom
      sessionId={Number(sessionId)}
      viewerRole="CLIENT"
      backHref={APP_ROUTES.CLIENT.ORDER_HISTORY}
    />
  );
}
