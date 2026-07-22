import Link from 'next/link';
import { APP_ROUTES } from '@/app/config/routes';

export function LoginButton() {
  return (
    <Link
      href={`${APP_ROUTES.Auth.LOGIN}?mode=login`}
      className="inline-flex h-10 items-center justify-center rounded-full border border-[#D1D5DB] bg-white px-5 text-sm font-semibold text-[#1F2937] shadow-sm transition hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 hover:text-[#FF7A00] dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-[#FF7A00]/15 dark:hover:text-[#FFB366]"
    >
      Đăng nhập
    </Link>
  );
}
