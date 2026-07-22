import SessionChatRoom from '@/app/components/chat-room/SessionChatRoom';
import { APP_ROUTES } from '@/app/config/routes';

export default async function TechnicianChatRoomPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <SessionChatRoom
      sessionId={Number(sessionId)}
      viewerRole="TECHNICIAN"
      backHref={APP_ROUTES.TECHNICIAN.DASHBOARD}
    />
  );
}
