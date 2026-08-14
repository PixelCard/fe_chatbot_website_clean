'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { ThemeMode } from '../type/types';

const STORAGE_KEY = 'theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;

  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  root.setAttribute('data-admin-theme', theme);
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.localStorage.setItem('smartelec-admin-theme', theme);
}

function getMaxRadiusFromPoint(x: number, y: number) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return Math.ceil(
    Math.max(
      Math.hypot(x, y),
      Math.hypot(width - x, y),
      Math.hypot(x, height - y),
      Math.hypot(width - x, height - y),
    ),
  );
}

function easeOutSine(t: number) {
  return Math.sin((t * Math.PI) / 2);
}

function getRingColor(theme: ThemeMode) {
  return theme === 'dark'
    ? 'rgba(181, 184, 208, 0.34)'
    : 'rgba(255, 138, 31, 0.3)';
}

export function useOceanThemeTransition() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const effectsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initialTheme = getInitialTheme();

    applyTheme(initialTheme);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      overlayRef.current?.remove();
      effectsRef.current?.remove();
    };
  }, []);

  const finishRipple = useCallback(() => {
    overlayRef.current?.remove();
    effectsRef.current?.remove();
    overlayRef.current = null;
    effectsRef.current = null;
    isAnimatingRef.current = false;
    rafRef.current = null;
    setIsAnimating(false);
  }, []);

  const createAdminStyleRipple = useCallback((x: number, y: number, currentTheme: ThemeMode, nextTheme: ThemeMode) => {
    overlayRef.current?.remove();
    effectsRef.current?.remove();

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.className = 'admin-theme-overlay-snapshot';
    overlay.style.zIndex = '2147483644';
    overlay.style.setProperty('--admin-overlay-x', `${x}px`);
    overlay.style.setProperty('--admin-overlay-y', `${y}px`);
    overlay.style.setProperty('--admin-overlay-radius', '0px');

    const bg = document.createElement('div');
    bg.className = 'admin-theme-bg admin-theme-bg-base';
    bg.dataset.theme = currentTheme;
    overlay.appendChild(bg);

    const effects = document.createElement('div');
    effects.setAttribute('aria-hidden', 'true');
    effects.style.cssText = 'position:fixed;inset:0;z-index:2147483645;pointer-events:none;overflow:hidden;isolation:isolate;contain:layout paint style;';
    effects.style.setProperty('--admin-theme-ring', getRingColor(nextTheme));

    const wave = document.createElement('div');
    wave.className = 'admin-ripple-soft-wave';
    wave.dataset.active = 'true';
    wave.style.setProperty('--admin-ripple-x', `${x}px`);
    wave.style.setProperty('--admin-ripple-y', `${y}px`);
    wave.style.setProperty('--admin-ripple-radius', '0px');

    const ringOne = document.createElement('div');
    ringOne.className = 'admin-ripple-ring';
    const ringTwo = document.createElement('div');
    ringTwo.className = 'admin-ripple-ring admin-ripple-ring-two';

    for (const ring of [ringOne, ringTwo]) {
      ring.dataset.active = 'true';
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      ring.style.opacity = '0';
      ring.style.transform = 'translate3d(-50%, -50%, 0) scale(.1)';
    }

    effects.append(wave, ringOne, ringTwo);
    document.body.append(overlay, effects);
    overlayRef.current = overlay;
    effectsRef.current = effects;

    return { overlay, wave, ringOne, ringTwo };
  }, []);

  const toggleTheme = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (isAnimatingRef.current) {
        return;
      }

      const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        applyTheme(nextTheme);
        setTheme(nextTheme);
        return;
      }

      const x = event.clientX;
      const y = event.clientY;
      const currentTheme = theme;
      const targetRadius = getMaxRadiusFromPoint(x, y) + 96;
      const duration = 720;
      const ripple = createAdminStyleRipple(x, y, currentTheme, nextTheme);

      isAnimatingRef.current = true;
      setIsAnimating(true);

      rafRef.current = requestAnimationFrame(() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);

        const startedAt = performance.now();

        const frame = (now: number) => {
          const rawProgress = Math.min((now - startedAt) / duration, 1);
          const eased = easeOutSine(rawProgress);
          const radius = targetRadius * eased;

          ripple.overlay.style.setProperty('--admin-overlay-radius', `${radius}px`);
          ripple.wave.style.setProperty('--admin-ripple-radius', `${radius}px`);

          const ringOneProgress = Math.min(rawProgress * 1.04, 1);
          const ringTwoProgress = Math.max(
            0,
            Math.min((rawProgress - 0.12) * 1.14, 1),
          );
          const ringOneRadius = targetRadius * easeOutSine(ringOneProgress);
          const ringTwoRadius = targetRadius * easeOutSine(ringTwoProgress);

          ripple.ringOne.style.transform = `translate3d(-50%, -50%, 0) scale(${Math.max(ringOneRadius / 9, 0.1)})`;
          ripple.ringOne.style.opacity = `${Math.max(0, 0.26 * (1 - ringOneProgress))}`;
          ripple.ringTwo.style.transform = `translate3d(-50%, -50%, 0) scale(${Math.max(ringTwoRadius / 9, 0.1)})`;
          ripple.ringTwo.style.opacity = `${Math.max(0, 0.16 * (1 - ringTwoProgress))}`;

          if (rawProgress < 1) {
            rafRef.current = requestAnimationFrame(frame);
            return;
          }

          finishRipple();
        };

        rafRef.current = requestAnimationFrame(frame);
      });
    },
    [createAdminStyleRipple, finishRipple, theme],
  );

  return {
    theme,
    mounted,
    isAnimating,
    isDarkMode: mounted ? theme === 'dark' : false,
    toggleTheme,
  };
}
