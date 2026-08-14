import Link from 'next/link';
import { APP_ROUTES } from '@/app/config/routes';

export function LoginButton() {
  return (
    <Link
      href={`${APP_ROUTES.Auth.LOGIN}?mode=login`}
      prefetch={true}
      className="inline-flex h-10 items-center justify-center rounded-full border border-orange-200/90 bg-white/95 px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 hover:text-[#FF7A00] dark:border-cyan-500/40 dark:bg-slate-900/90 dark:text-cyan-300 dark:hover:border-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-slate-950 transform-gpu"
    >
      Đăng nhập
    </Link>
  );
}
