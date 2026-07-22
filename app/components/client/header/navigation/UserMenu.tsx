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
        className="flex h-10 items-center gap-2 rounded-xl border border-[var(--client-card-border)] bg-transparent px-2.5 pr-3 text-sm font-semibold text-[var(--client-text-primary)] transition hover:border-[var(--client-primary-soft-border)] hover:bg-[var(--client-control-hover-bg)] hover:text-[var(--client-primary)]"
        aria-label="Mở menu người dùng"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--client-primary-soft-border)] bg-[var(--client-primary-soft)] text-xs font-bold text-[var(--client-primary)]">
          {getInitial(name)}
        </span>

        <span className="hidden max-w-[120px] truncate sm:block 2xl:max-w-[180px]">
          {name}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--client-text-muted)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        role="menu"
        className={[
          'absolute right-0 top-full z-50 w-64 overflow-hidden rounded-2xl border border-[var(--client-header-border)] bg-[var(--client-card-bg)] py-2 shadow-[var(--client-card-shadow)] transition-all duration-200',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible translate-y-2 opacity-0',
        ].join(' ')}
      >
        <div className="border-b border-[var(--client-card-border)] px-4 py-3">
          <p className="truncate text-sm font-bold text-[var(--client-text-primary)]">
            {name}
          </p>

          <p className="mt-0.5 truncate text-xs text-[var(--client-text-secondary)]">
            {email}
          </p>
        </div>

        <div className="py-1">
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
          className="flex w-full items-center gap-3 border-t border-[var(--client-card-border)] px-4 py-2.5 text-left text-sm font-semibold text-[var(--client-error)] transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
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
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--client-text-secondary)] transition-colors hover:bg-[var(--client-control-hover-bg)] hover:text-[var(--client-primary)]"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </Link>
  );
}
