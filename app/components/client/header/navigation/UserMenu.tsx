'use client';

import Link from 'next/link';
import { ChevronDown, History, LogOut, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { APP_ROUTES } from '@/app/config/routes';

type UserMenuProps = {
  name: string;
  email: string;
  onLogout?: () => void;
};

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'U';
}

export function UserMenu({ name, email, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative shrink-0 py-2">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="group flex h-10 items-center gap-2.5 rounded-2xl border border-slate-300/70 bg-slate-100/80 px-2.5 pr-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-orange-400/60 hover:bg-white hover:text-orange-600 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-cyan-500/50 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
        aria-label="Mở menu người dùng"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-xs font-black text-white shadow-sm dark:from-cyan-500 dark:to-blue-600">
          {getInitial(name)}
        </span>

        <span className="hidden max-w-[120px] truncate font-extrabold sm:block 2xl:max-w-[180px]">
          {name}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-orange-500 dark:text-slate-400 dark:group-hover:text-cyan-400 ${
            isOpen ? 'rotate-180 text-orange-500 dark:text-cyan-400' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        role="menu"
        className={[
          'absolute right-0 top-full mt-2.5 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-200 dark:border-slate-800 dark:bg-[#0D1527] dark:shadow-[0_24px_60px_rgba(0,0,0,0.7)]',
          isOpen
            ? 'visible translate-y-0 opacity-100 scale-100'
            : 'invisible -translate-y-1 opacity-0 scale-95',
        ].join(' ')}
      >
        <div className="rounded-xl border-b border-slate-100 bg-slate-50/80 px-3.5 py-3 dark:border-slate-800/80 dark:bg-slate-900/60">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
            {name}
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
            {email}
          </p>
        </div>

        <div className="py-1 space-y-0.5">
          <MenuLink
            href={APP_ROUTES.Auth.UPDATE_PROFILE}
            icon={User}
            onClick={() => setIsOpen(false)}
          >
            Thông tin cá nhân
          </MenuLink>

          <MenuLink
            href={APP_ROUTES.CLIENT.ORDER_HISTORY}
            icon={History}
            onClick={() => setIsOpen(false)}
          >
            Lịch sử đơn
          </MenuLink>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            onLogout?.();
          }}
          role="menuitem"
          className="flex w-full items-center gap-3 rounded-xl border-t border-slate-100 px-3.5 py-2.5 text-left text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:border-slate-800/80 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 mt-1"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  onClick,
  children,
}: {
  href: string;
  icon: typeof User;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-100 hover:text-orange-600 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-cyan-300"
    >
      <Icon className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-orange-500 dark:text-slate-400 dark:group-hover:text-cyan-400" aria-hidden="true" />
      {children}
    </Link>
  );
}
