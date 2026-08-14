import Link from 'next/link';
import { Zap } from 'lucide-react';

export function HeaderLogo() {
  return (
    <Link
      href="/"
      prefetch={true}
      className="group flex shrink-0 items-center gap-3 transform-gpu"
      aria-label="Về trang chủ SMARTELEC"
    >
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FF7A00] text-white shadow-[0_12px_26px_rgba(255,122,0,0.24)] transition-transform duration-200 group-hover:-translate-y-0.5">
        <Zap className="h-5 w-5" aria-hidden="true" />
      </span>

      <span className="hidden text-[1.28rem] font-black tracking-[0.13em] text-[#1F2937] transition-colors dark:text-white sm:inline">
        SMARTELEC
      </span>
    </Link>
  );
}