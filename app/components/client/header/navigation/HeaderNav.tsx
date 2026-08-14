// app/components/client/header/navigation/HeaderNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { HEADER_NAV_ITEMS } from '../type/constants';

function isPathActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="grid w-full grid-cols-4 items-center gap-1.5 text-center text-[14px] font-semibold text-slate-500 transition-colors min-[1450px]:gap-2 min-[1450px]:text-[15px] dark:text-slate-300"
    >
      {HEADER_NAV_ITEMS.map((item) => {
        const isActive = isPathActive(
          pathname,
          item.href,
        );

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'inline-flex min-h-10 w-full min-w-0 items-center justify-center',
              'whitespace-nowrap rounded-full px-2.5 py-2 transform-gpu',
              'transition-all duration-200 ease-out min-[1450px]:px-3',
              'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A00]/20 dark:focus-visible:ring-cyan-500/25',
              isActive
                ? 'bg-[#FF7A00]/10 text-[#FF7A00] font-bold dark:bg-cyan-500/15 dark:text-cyan-300'
                : 'hover:bg-[#FF7A00]/10 hover:text-[#FF7A00] dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300',
            ].join(' ')}
          >
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}