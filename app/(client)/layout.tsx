'use client';

import './client-theme.css';
import React from 'react';
import { ClientHeader } from '..//components/client/header/navigation/ClientHeader'; 
import BottomNav from '../components/bottomnavComponents';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHideBottomNav =
    pathname?.startsWith('/chatbot') ||
    pathname?.startsWith('/faqchat') ||
    pathname?.startsWith('/chats');
  return (
    <div className="client-theme client-ripple-theme-shell min-h-screen">
      <div aria-hidden="true" className="client-theme-background-stack">
        <div className="client-theme-bg" />
      </div>

      {/* 1. Navbar: Chỉ hiện trên Desktop (md trở lên), ẩn trên Mobile */}
      <div className="hidden md:block">
        <ClientHeader />
      </div>

      {/* 2. Nội dung: Thêm padding-bottom để không bị BottomNav che mất trên mobile */}
      <main className={`relative z-0 md:pb-0 ${isHideBottomNav ? '' : 'pb-16'}`}>
        {children}
      </main>

      {/* 3. BottomNav: Chỉ hiện trên Mobile (ẩn trên md trở lên) */}
      {!isHideBottomNav && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
