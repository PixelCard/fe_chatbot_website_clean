import Link from 'next/link';
import { Home, ClipboardList, MessageSquare, User } from 'lucide-react';
import { APP_ROUTES } from '@/app/config/routes';

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-black/10 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-black/90 md:hidden">
      
      {/* Home */}
      <Link href="/" className="flex flex-col items-center gap-1 text-[10px] font-medium text-black/60 dark:text-white/60">
        <Home className="h-6 w-6" />
        <span>Trang chủ</span>
      </Link>

      {/* Lịch sử đơn */}
      <Link href={APP_ROUTES.CLIENT.ORDER_HISTORY} className="flex flex-col items-center gap-1 text-[10px] font-medium text-black/60 dark:text-white/60">
        <ClipboardList className="h-6 w-6" />
        <span>Đơn hàng</span>
      </Link>

      {/* Chat (Nơi khách hàng và thợ trò chuyện) */}
      <Link href={APP_ROUTES.CLIENT.CHAT_BOT} className="flex flex-col items-center gap-1 text-[10px] font-medium text-black/60 dark:text-white/60">
        <MessageSquare className="h-6 w-6" />
        <span>Tin nhắn</span>
      </Link>

      {/* Tài khoản / FAQ */}
      <Link href={APP_ROUTES.Auth.UPDATE_PROFILE} className="flex flex-col items-center gap-1 text-[10px] font-medium text-black/60 dark:text-white/60">
        <User className="h-6 w-6" />
        <span>Cá nhân</span>
      </Link>

    </div>
  );
}
