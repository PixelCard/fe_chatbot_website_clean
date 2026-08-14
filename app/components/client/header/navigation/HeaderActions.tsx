// app/components/client/header/navigation/HeaderActions.tsx
'use client';

import Link from 'next/link';
import { Menu, MessageSquare, X } from 'lucide-react';
import type { MouseEvent } from 'react';

import { APP_ROUTES } from '@/app/config/routes';

import { LoginButton } from '../button/LoginButton';
import { ThemeToggleButton } from '../button/ThemeToggleButton';
import { UserMenu } from './UserMenu';

type HeaderActionsProps = {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  isDarkMode: boolean;
  isAnimating?: boolean;
  isMobileMenuOpen?: boolean;
  onToggleTheme: (
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
};

export function HeaderActions({
  isLoggedIn,
  userName,
  userEmail,
  isDarkMode,
  isAnimating = false,
  isMobileMenuOpen = false,
  onToggleTheme,
  onToggleMobileMenu,
  onLogout,
}: HeaderActionsProps) {
  return (
    <>
      <div className="hidden shrink-0 items-center justify-end gap-2.5 min-[1180px]:flex min-[1500px]:gap-3">
        <Link
          href={APP_ROUTES.CLIENT.CHAT_BOT}
          prefetch={true}
          aria-label="Bắt đầu trò chuyện"
          title="Bắt đầu trò chuyện"
          className={[
            'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transform-gpu',
            'bg-[#FF7A00] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66E00]',
            'dark:bg-cyan-500 dark:text-slate-950 dark:shadow-[0_4px_16px_rgba(6,182,212,0.35)] dark:hover:bg-cyan-400',
            'active:translate-y-0',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A00]/25 dark:focus-visible:ring-cyan-500/30',
            'min-[1550px]:w-auto min-[1550px]:gap-2',
            'min-[1550px]:rounded-[16px] min-[1550px]:px-5',
          ].join(' ')}
        >
          <MessageSquare
            className="h-[18px] w-[18px] shrink-0"
            aria-hidden="true"
          />

          <span className="hidden whitespace-nowrap text-[14px] font-bold min-[1550px]:inline">
            Bắt đầu trò chuyện
          </span>
        </Link>

        <div className="shrink-0">
          <ThemeToggleButton
            isDarkMode={isDarkMode}
            isAnimating={isAnimating}
            onToggle={onToggleTheme}
          />
        </div>

        {isLoggedIn ? (
          <div className="min-w-0 shrink-0">
            <UserMenu
              name={userName}
              email={userEmail}
              onLogout={onLogout}
            />
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2.5">
            <LoginButton />

            <Link
              href={`${APP_ROUTES.Auth.LOGIN}?mode=register`}
              prefetch={true}
              className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#FF7A00] px-4 text-sm font-semibold text-white transition hover:bg-[#E66E00] dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A00]/25 dark:focus-visible:ring-cyan-500/30 min-[1500px]:px-5 transform-gpu"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2.5 min-[1180px]:hidden">
        <div className="shrink-0">
          <ThemeToggleButton
            isDarkMode={isDarkMode}
            isAnimating={isAnimating}
            onToggle={onToggleTheme}
          />
        </div>

        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label={
            isMobileMenuOpen
              ? 'Đóng menu điều hướng'
              : 'Mở menu điều hướng'
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="client-mobile-menu"
          className={[
            'grid h-11 w-11 shrink-0 place-items-center rounded-[16px]',
            'border border-slate-200 bg-white text-slate-700',
            'transition hover:border-[#FF7A00]',
            'hover:bg-[#FF7A00]/10 hover:text-[#FF7A00]',
            'active:scale-95',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A00]/20',
            'dark:border-cyan-500/40 dark:bg-slate-900/90 dark:text-cyan-300',
            'dark:hover:border-cyan-400 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-200',
          ].join(' ')}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}