// app/components/client/header/navigation/ClientHeader.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  clearClientSession,
  getClientTokenFromDocument,
  syncStoredSessionToCookie,
} from '@/app/auth/utils/session';
import { APP_ROUTES } from '@/app/config/routes';

import { useOceanThemeTransition } from '../animation/useOceanThemeTransition';
import { HeaderLogo } from '../image/HeaderLogo';
import { HEADER_NAV_ITEMS } from '../type/constants';
import { HeaderActions } from './HeaderActions';
import { HeaderNav } from './HeaderNav';

type ClientHeaderProps = {
  isLoggedIn?: boolean;
  userName?: string;
};

type SessionSnapshot = {
  hasSession: boolean;
  profileName: string;
  profileEmail: string;
};

const DEFAULT_PROFILE_EMAIL = 'khachhang.smartelec@example.com';
const DESKTOP_HEADER_QUERY = '(min-width: 1180px)';

function isPathActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ClientHeader({
  isLoggedIn,
  userName = 'Khách hàng',
}: ClientHeaderProps) {
  const { isDarkMode, isAnimating, toggleTheme } =
    useOceanThemeTransition();

  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sessionSnapshot, setSessionSnapshot] =
    useState<SessionSnapshot>({
      hasSession: Boolean(isLoggedIn),
      profileName: userName,
      profileEmail: DEFAULT_PROFILE_EMAIL,
    });

  useEffect(() => {
    const { token } = syncStoredSessionToCookie();
    const cookieHasToken = Boolean(getClientTokenFromDocument());
    const localHasToken = Boolean(
      window.localStorage.getItem('accessToken'),
    );
    const rawProfile =
      window.localStorage.getItem('user_profile');

    let profileName = userName;
    let profileEmail = DEFAULT_PROFILE_EMAIL;

    if (rawProfile) {
      try {
        const parsed = JSON.parse(rawProfile) as {
          name?: string;
          email?: string;
        };

        if (parsed.name?.trim()) {
          profileName = parsed.name.trim();
        }

        if (parsed.email?.trim()) {
          profileEmail = parsed.email.trim();
        }
      } catch {
        // Bỏ qua dữ liệu localStorage không hợp lệ.
      }
    }

    setSessionSnapshot({
      hasSession:
        typeof isLoggedIn === 'boolean'
          ? isLoggedIn
          : Boolean(token) || cookieHasToken || localHasToken,
      profileName,
      profileEmail,
    });

    setMobileOpen(false);
  }, [isLoggedIn, pathname, userName]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_HEADER_QUERY);

    const handleDesktopChange = (
      event: MediaQueryListEvent,
    ) => {
      if (event.matches) {
        setMobileOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleDesktopChange);

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleDesktopChange,
      );
    };
  }, []);

  const handleLogout = () => {
    clearClientSession();

    setSessionSnapshot({
      hasSession: false,
      profileName: userName,
      profileEmail: DEFAULT_PROFILE_EMAIL,
    });

    setMobileOpen(false);
    router.replace('/');
    router.refresh();
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] bg-white/95 backdrop-blur-xl transition-colors dark:bg-[#050b18]/95">
        <div
          className={[
            'mx-auto grid h-[72px] w-full max-w-[1920px] items-center',
            'grid-cols-[auto_minmax(0,1fr)_auto] gap-3',
            'px-4 sm:px-6 lg:px-8',
            'min-[1180px]:grid-cols-[minmax(210px,1fr)_minmax(450px,600px)_minmax(210px,1fr)]',
            'min-[1180px]:gap-4',
          ].join(' ')}
        >
          <div className="min-w-0 justify-self-start">
            <HeaderLogo />
          </div>

          <div className="hidden w-full min-w-0 justify-self-center min-[1180px]:block">
            <HeaderNav />
          </div>

          <div className="min-w-0 justify-self-end">
            <HeaderActions
              isLoggedIn={sessionSnapshot.hasSession}
              userName={sessionSnapshot.profileName}
              userEmail={sessionSnapshot.profileEmail}
              isDarkMode={isDarkMode}
              isAnimating={isAnimating}
              isMobileMenuOpen={mobileOpen}
              onToggleTheme={toggleTheme}
              onToggleMobileMenu={() =>
                setMobileOpen((current) => !current)
              }
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <div
        className={[
          'fixed inset-x-0 bottom-0 top-[72px] z-[110]',
          'min-[1180px]:hidden',
          mobileOpen
            ? 'visible pointer-events-auto'
            : 'invisible pointer-events-none',
        ].join(' ')}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Đóng menu điều hướng"
          tabIndex={mobileOpen ? 0 : -1}
          className={[
            'absolute inset-0 bg-slate-950/25 backdrop-blur-[2px]',
            'transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />

        <aside
          id="client-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng"
          className={[
            'absolute bottom-0 right-0 top-0',
            'flex w-[min(420px,92vw)] flex-col',
            'border-l border-slate-200 bg-white',
            'shadow-[-18px_0_48px_rgba(15,23,42,0.14)]',
            'transition-transform duration-300 ease-out',
            'dark:border-white/10 dark:bg-[#07101f]',
            'dark:shadow-[-18px_0_48px_rgba(0,0,0,0.38)]',
            mobileOpen
              ? 'translate-x-0'
              : 'translate-x-full',
          ].join(' ')}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <div>
              <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                Điều hướng
              </p>

              {sessionSnapshot.hasSession ? (
                <p className="mt-0.5 max-w-[260px] truncate text-[13px] text-slate-500 dark:text-slate-400">
                  {sessionSnapshot.profileName}
                </p>
              ) : (
                <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
                  Chọn mục bạn muốn truy cập
                </p>
              )}
            </div>

            <span className="inline-flex h-9 items-center rounded-full bg-orange-50 px-3 text-[12px] font-semibold text-[#FF7A00] dark:bg-[#FF7A00]/15 dark:text-[#FFB366]">
              SmartElec
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <nav
              aria-label="Điều hướng trên màn hình nhỏ"
              className="grid gap-2"
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
                    onClick={() => setMobileOpen(false)}
                    aria-current={
                      isActive ? 'page' : undefined
                    }
                    tabIndex={mobileOpen ? 0 : -1}
                    className={[
                      'flex min-h-[50px] items-center rounded-[16px] px-4',
                      'text-[15px] font-semibold transition',
                      'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A00]/20',
                      isActive
                        ? 'bg-orange-50 text-[#FF7A00] dark:bg-[#FF7A00]/15 dark:text-[#FFB366]'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white',
                    ].join(' ')}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>

                    {isActive ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF7A00]" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="my-4 h-px bg-slate-200 dark:bg-white/10" />

            <div className="grid gap-2.5">
              <Link
                href={APP_ROUTES.CLIENT.CHAT_BOT}
                onClick={() => setMobileOpen(false)}
                tabIndex={mobileOpen ? 0 : -1}
                className="inline-flex min-h-[50px] items-center justify-center rounded-[16px] bg-[#FF7A00] px-4 text-[15px] font-bold text-white transition hover:bg-[#E66E00] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A00]/25"
              >
                Bắt đầu trò chuyện
              </Link>

              {sessionSnapshot.hasSession ? (
                <>
                  <Link
                    href={APP_ROUTES.Auth.UPDATE_PROFILE}
                    onClick={() => setMobileOpen(false)}
                    tabIndex={mobileOpen ? 0 : -1}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-[16px] border border-slate-200 px-4 text-[15px] font-semibold text-slate-700 transition hover:border-[#FF7A00] hover:text-[#FF7A00] dark:border-white/10 dark:text-slate-100"
                  >
                    Thông tin cá nhân
                  </Link>

                  <Link
                    href={APP_ROUTES.CLIENT.ORDER_HISTORY}
                    onClick={() => setMobileOpen(false)}
                    tabIndex={mobileOpen ? 0 : -1}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-[16px] border border-slate-200 px-4 text-[15px] font-semibold text-slate-700 transition hover:border-[#FF7A00] hover:text-[#FF7A00] dark:border-white/10 dark:text-slate-100"
                  >
                    Lịch sử đơn
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    tabIndex={mobileOpen ? 0 : -1}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-[16px] border border-red-200 px-4 text-[15px] font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Link
                    href={`${APP_ROUTES.Auth.LOGIN}?mode=login`}
                    onClick={() => setMobileOpen(false)}
                    tabIndex={mobileOpen ? 0 : -1}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-[16px] border border-slate-200 px-4 text-[15px] font-semibold text-slate-700 transition hover:border-[#FF7A00] hover:text-[#FF7A00] dark:border-white/10 dark:text-slate-100"
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    href={`${APP_ROUTES.Auth.LOGIN}?mode=register`}
                    onClick={() => setMobileOpen(false)}
                    tabIndex={mobileOpen ? 0 : -1}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-[16px] bg-[#FF7A00] px-4 text-[15px] font-semibold text-white transition hover:bg-[#E66E00]"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="h-[72px]" aria-hidden="true" />
    </>
  );
}