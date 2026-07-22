"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, Home, LogIn, Menu, MessageSquareText, X, Zap } from "lucide-react";

import { APP_ROUTES } from "@/app/config/routes";

import { homeSections } from "./data";
import { cn } from "./ui/GlassCard";

const HEADER_OFFSET = 92;

function getInitialSectionId() {
  if (typeof window === "undefined") return homeSections[0]?.id ?? "hero";

  const hashId = window.location.hash.replace("#", "");

  if (hashId && homeSections.some((section) => section.id === hashId)) {
    return hashId;
  }

  return homeSections[0]?.id ?? "hero";
}

export function SectionNavigator() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [activeSectionId, setActiveSectionId] = useState(getInitialSectionId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isChatRoute = pathname === APP_ROUTES.CLIENT.CHAT_BOT;
  const isLoginRoute = pathname === APP_ROUTES.Auth.LOGIN;

  const sectionMap = useMemo(() => {
    return new Map(homeSections.map((section) => [section.id, section.label]));
  }, []);

  const activeSectionLabel = sectionMap.get(activeSectionId) ?? "Giới thiệu";

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const top = Math.max(targetTop - HEADER_OFFSET, 0);

    window.scrollTo({
      top,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });

    setActiveSectionId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const handleSectionClick = (id: string) => {
    scrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const sections = homeSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const nextActiveId = visibleEntries[0]?.target.id;

        if (nextActiveId && sectionMap.has(nextActiveId)) {
          setActiveSectionId(nextActiveId);
        }
      },
      {
        root: null,
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0.08, 0.18, 0.32, 0.48],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionMap]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 sm:px-4 lg:px-6"
      >
        <nav
          aria-label="Điều hướng SmartElec"
          className="mx-auto flex min-h-[64px] w-full max-w-[1440px] items-center gap-3 rounded-[22px] border border-orange-100/90 bg-white/92 px-3 py-2 shadow-[0_16px_48px_rgba(255,122,0,0.12)] backdrop-blur-[20px] dark:border-slate-700/80 dark:bg-slate-950/88 dark:shadow-[0_18px_56px_rgba(0,0,0,0.34)] sm:min-h-[68px] sm:px-4"
        >
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center gap-3 rounded-[18px] px-2 py-2 transition hover:bg-orange-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:hover:bg-blue-500/10 dark:focus-visible:ring-blue-500/25"
            aria-label="Về trang chủ SmartElec"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-orange-500 text-white shadow-[0_12px_28px_rgba(255,122,0,0.22)] transition group-hover:bg-orange-600 dark:bg-blue-700 dark:shadow-[0_12px_28px_rgba(37,99,235,0.24)] dark:group-hover:bg-blue-800">
              <Zap className="h-[22px] w-[22px]" />
            </span>

            <span className="min-w-0">
              <span className="block truncate text-[19px] font-black leading-6 tracking-[-0.045em] text-slate-950 dark:text-white sm:text-[21px]">
                SmartElec
              </span>
              <span className="hidden truncate text-[12px] font-black uppercase tracking-[0.14em] text-orange-600 dark:text-blue-300 sm:block">
                AI sửa chữa
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 min-[1500px]:flex">
            {homeSections.map((section) => {
              const isActive = section.id === activeSectionId;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleSectionClick(section.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "group relative inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[15px] px-3 text-[14px] font-black leading-6 transition",
                    "focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:focus-visible:ring-blue-500/25",
                    isActive
                      ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-blue-500/14 dark:text-blue-200 dark:ring-blue-500/25"
                      : "text-slate-700 hover:bg-orange-50 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-blue-500/10 dark:hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full transition",
                      isActive
                        ? "bg-orange-500 dark:bg-blue-400"
                        : "bg-slate-300 group-hover:bg-orange-400 dark:bg-slate-600 dark:group-hover:bg-blue-400",
                    )}
                  />
                  {section.label}

                  {isActive ? (
                    <span className="absolute inset-x-3 -bottom-1 h-1 rounded-full bg-orange-500 dark:bg-blue-500" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-2 min-[1500px]:flex">
            <Link
              href={APP_ROUTES.Auth.LOGIN}
              aria-current={isLoginRoute ? "page" : undefined}
              className={cn(
                "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[15px] border px-4 text-[14px] font-black transition",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:focus-visible:ring-blue-500/25",
                isLoginRoute
                  ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-blue-500/35 dark:bg-blue-500/14 dark:text-blue-200"
                  : "border-orange-100 bg-white/80 text-slate-800 hover:border-orange-200 hover:bg-orange-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-blue-500/45 dark:hover:bg-blue-500/10",
              )}
            >
              <LogIn className="h-[18px] w-[18px]" />
              Đăng nhập
            </Link>

            <Link
              href={APP_ROUTES.CLIENT.CHAT_BOT}
              aria-current={isChatRoute ? "page" : undefined}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[15px] bg-orange-500 px-4 text-[14px] font-black text-white shadow-[0_12px_28px_rgba(255,122,0,0.22)] transition hover:bg-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 dark:bg-blue-700 dark:shadow-[0_12px_28px_rgba(37,99,235,0.24)] dark:hover:bg-blue-800 dark:focus-visible:ring-blue-500/30"
            >
              <MessageSquareText className="h-[18px] w-[18px]" />
              Mở AI chat
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Mở menu điều hướng"
            aria-expanded={isMobileMenuOpen}
            aria-controls="smart-elec-mobile-menu"
            className="ml-auto inline-flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-[18px] border border-orange-100 bg-white text-slate-900 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-blue-500/45 dark:hover:bg-blue-500/10 dark:focus-visible:ring-blue-500/25 min-[1500px]:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Đóng menu điều hướng"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[80] cursor-default bg-slate-950/45 backdrop-blur-[2px] min-[1500px]:hidden"
            />

            <motion.aside
              id="smart-elec-mobile-menu"
              initial={{ x: "100%", opacity: 0.98 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.98 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-[90] flex h-[100dvh] w-[min(88vw,420px)] flex-col overflow-y-auto border-l border-orange-100 bg-[#fffaf4] p-4 shadow-[-24px_0_70px_rgba(15,23,42,0.22)] dark:border-slate-700 dark:bg-[#070b12] min-[1500px]:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu điều hướng SmartElec"
            >
              <div className="flex items-center justify-between gap-3 border-b border-orange-100 pb-4 dark:border-slate-800">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-w-0 items-center gap-3 rounded-[18px] pr-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:focus-visible:ring-blue-500/25"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-orange-500 text-white shadow-[0_12px_28px_rgba(255,122,0,0.24)] dark:bg-blue-700">
                    <Zap className="h-6 w-6" />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-[22px] font-black leading-7 tracking-[-0.05em] text-slate-950 dark:text-white">
                      SmartElec
                    </span>
                    <span className="block truncate text-[12px] font-black uppercase tracking-[0.14em] text-orange-600 dark:text-blue-300">
                      {activeSectionLabel}
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Đóng menu điều hướng"
                  className="inline-flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-[18px] border border-orange-100 bg-white text-slate-900 transition hover:border-orange-200 hover:bg-orange-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-blue-500/45 dark:hover:bg-blue-500/10 dark:focus-visible:ring-blue-500/25"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-5 rounded-[24px] border border-orange-100 bg-white/82 p-3 shadow-[0_16px_44px_rgba(255,122,0,0.09)] dark:border-slate-700 dark:bg-slate-900/72 dark:shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
                <p className="px-2 pb-2 text-[12px] font-black uppercase tracking-[0.14em] text-orange-600 dark:text-blue-300">
                  Điều hướng trang
                </p>

                <div className="grid gap-2">
                  {homeSections.map((section) => {
                    const isActive = section.id === activeSectionId;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => handleSectionClick(section.id)}
                        aria-current={isActive ? "location" : undefined}
                        className={cn(
                          "group flex min-h-[52px] w-full items-center gap-3 rounded-[18px] px-3 text-left text-[16px] font-black leading-7 transition",
                          "focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:focus-visible:ring-blue-500/25",
                          isActive
                            ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-blue-500/14 dark:text-blue-200 dark:ring-blue-500/25"
                            : "text-slate-800 hover:bg-orange-50 hover:text-slate-950 dark:text-slate-100 dark:hover:bg-blue-500/10 dark:hover:text-white",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] transition",
                            isActive
                              ? "bg-orange-500 text-white dark:bg-blue-700"
                              : "bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white dark:bg-slate-800 dark:text-blue-300 dark:group-hover:bg-blue-700",
                          )}
                        >
                          {section.id === "hero" ? (
                            <Home className="h-[18px] w-[18px]" />
                          ) : section.id === "ai-preview" ||
                            section.id === "assistant" ? (
                            <Bot className="h-[18px] w-[18px]" />
                          ) : (
                            <span className="h-2.5 w-2.5 rounded-full bg-current" />
                          )}
                        </span>

                        <span className="min-w-0 flex-1 truncate">
                          {section.label}
                        </span>

                        {isActive ? (
                          <span className="h-7 w-1.5 rounded-full bg-orange-500 dark:bg-blue-500" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <Link
                  href={APP_ROUTES.CLIENT.CHAT_BOT}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isChatRoute ? "page" : undefined}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[18px] bg-orange-500 px-4 text-[16px] font-black text-white shadow-[0_14px_32px_rgba(255,122,0,0.22)] transition hover:bg-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 dark:bg-blue-700 dark:shadow-[0_14px_32px_rgba(37,99,235,0.24)] dark:hover:bg-blue-800 dark:focus-visible:ring-blue-500/30"
                >
                  <MessageSquareText className="h-5 w-5" />
                  Mở AI chat
                </Link>

                <Link
                  href={APP_ROUTES.Auth.LOGIN}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isLoginRoute ? "page" : undefined}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[18px] border border-orange-200 bg-white px-4 text-[16px] font-black text-slate-900 transition hover:border-orange-300 hover:bg-orange-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-blue-500/45 dark:hover:bg-blue-500/10 dark:focus-visible:ring-blue-500/25"
                >
                  <LogIn className="h-5 w-5" />
                  Đăng nhập
                </Link>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 flex-col gap-3 min-[1900px]:flex"
        aria-label="Điều hướng nhanh theo khu vực"
      >
        {homeSections.map((section) => {
          const isActive = section.id === activeSectionId;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleSectionClick(section.id)}
              aria-label={`Đi tới ${section.label}`}
              aria-current={isActive ? "location" : undefined}
              className="group flex min-h-[36px] items-center justify-end gap-3 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:focus-visible:ring-blue-500/25"
            >
              <span
                className={cn(
                  "pointer-events-none max-w-[180px] translate-x-2 truncate rounded-full border px-3 py-1.5 text-[12px] font-black shadow-lg backdrop-blur-md transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100",
                  isActive
                    ? "border-orange-200 bg-orange-50 text-orange-700 opacity-100 dark:border-blue-500/35 dark:bg-blue-500/14 dark:text-blue-200"
                    : "border-orange-100 bg-white text-slate-700 opacity-0 dark:border-slate-700 dark:bg-slate-950/90 dark:text-white",
                )}
              >
                {section.label}
              </span>

              <span
                className={cn(
                  "relative flex h-5 w-5 items-center justify-center rounded-full border shadow-sm transition group-hover:border-orange-500 dark:group-hover:border-blue-400",
                  isActive
                    ? "border-orange-500 bg-orange-500 dark:border-blue-500 dark:bg-blue-600"
                    : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950",
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    isActive
                      ? "bg-white"
                      : "bg-slate-400 group-hover:bg-orange-500 dark:bg-slate-500 dark:group-hover:bg-blue-400",
                  )}
                />
              </span>
            </button>
          );
        })}
      </motion.div>
    </>
  );
}