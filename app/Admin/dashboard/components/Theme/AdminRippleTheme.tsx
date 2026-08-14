"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Moon, SunMedium } from "lucide-react";

type AdminTheme = "light" | "dark";

type AdminRippleThemeContextValue = {
  theme: AdminTheme;
  isAnimating: boolean;
  toggleThemeFromPoint: (x: number, y: number) => void;
};

const STORAGE_KEY = "smartelec-admin-theme";
const DEFAULT_THEME: AdminTheme = "dark";

const AdminRippleThemeContext =
  createContext<AdminRippleThemeContextValue | null>(null);

function getNextTheme(theme: AdminTheme): AdminTheme {
  return theme === "light" ? "dark" : "light";
}

function easeOutSine(t: number) {
  return Math.sin((t * Math.PI) / 2);
}

function getMaxRadiusFromPoint(x: number, y: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  return Math.ceil(
    Math.max(
      Math.hypot(x, y),
      Math.hypot(w - x, y),
      Math.hypot(x, h - y),
      Math.hypot(w - x, h - y),
    ),
  );
}

function readStoredTheme(): AdminTheme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem("theme");
  return saved === "light" || saved === "dark" ? saved : DEFAULT_THEME;
}

function writeStoredTheme(theme: AdminTheme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.localStorage.setItem("theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.documentElement.setAttribute("data-admin-theme", theme);
}

function applyAdminColorScheme(theme: AdminTheme) {
  document.documentElement.style.colorScheme = theme;
}

export function AdminRippleThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<AdminTheme>(() => readStoredTheme());
  const [isAnimating, setIsAnimating] = useState(false);

  const themeRef = useRef<AdminTheme>(theme);
  const isAnimatingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const waveRef = useRef<HTMLDivElement | null>(null);
  const ringOneRef = useRef<HTMLDivElement | null>(null);
  const ringTwoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const active = readStoredTheme();
    if (active !== theme) {
      setTheme(active);
    }
  }, []);

  useLayoutEffect(() => {
    themeRef.current = theme;
    applyAdminColorScheme(theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      overlayRef.current?.remove();
    };
  }, []);

  const finishRipple = useCallback(() => {
    const wave = waveRef.current;
    const ringOne = ringOneRef.current;
    const ringTwo = ringTwoRef.current;

    if (wave) {
      wave.removeAttribute("data-active");
      wave.style.setProperty("--admin-ripple-radius", "0px");
    }

    for (const ring of [ringOne, ringTwo]) {
      if (!ring) {
        continue;
      }

      ring.removeAttribute("data-active");
      ring.style.opacity = "0";
      ring.style.transform = "translate3d(-50%, -50%, 0) scale(.1)";
    }

    overlayRef.current?.remove();
    overlayRef.current = null;

    isAnimatingRef.current = false;
    setIsAnimating(false);
    rafRef.current = null;
  }, []);

  const createSnapshotOverlay = useCallback(
    (x: number, y: number, currentTheme: AdminTheme) => {
      overlayRef.current?.remove();

      const overlay = document.createElement("div");
      overlay.setAttribute("aria-hidden", "true");
      overlay.className = "admin-theme-overlay-snapshot";
      overlay.style.setProperty("--admin-overlay-x", `${x}px`);
      overlay.style.setProperty("--admin-overlay-y", `${y}px`);
      overlay.style.setProperty("--admin-overlay-radius", "0px");

      const bg = document.createElement("div");
      bg.className = "admin-theme-bg admin-theme-bg-base";
      bg.dataset.theme = currentTheme;

      overlay.appendChild(bg);
      document.body.appendChild(overlay);
      overlayRef.current = overlay;

      return overlay;
    },
    [],
  );

  const toggleThemeFromPoint = useCallback(
    (x: number, y: number) => {
      if (isAnimatingRef.current) {
        return;
      }

      const wave = waveRef.current;
      const ringOne = ringOneRef.current;
      const ringTwo = ringTwoRef.current;

      if (!wave || !ringOne || !ringTwo) {
        return;
      }

      const nextTheme = getNextTheme(themeRef.current);
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        writeStoredTheme(nextTheme);
        themeRef.current = nextTheme;
        setTheme(nextTheme);
        applyAdminColorScheme(nextTheme);
        finishRipple();
        return;
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      isAnimatingRef.current = true;
      setIsAnimating(true);

      const overlay = createSnapshotOverlay(x, y, themeRef.current);
      const targetRadius = getMaxRadiusFromPoint(x, y) + 96;
      const duration = 720;
      const startedAt = performance.now();

      writeStoredTheme(nextTheme);
      themeRef.current = nextTheme;
      setTheme(nextTheme);
      applyAdminColorScheme(nextTheme);

      wave.dataset.active = "true";
      wave.style.setProperty("--admin-ripple-x", `${x}px`);
      wave.style.setProperty("--admin-ripple-y", `${y}px`);
      wave.style.setProperty("--admin-ripple-radius", "0px");

      for (const ring of [ringOne, ringTwo]) {
        ring.dataset.active = "true";
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        ring.style.opacity = "0";
        ring.style.transform = "translate3d(-50%, -50%, 0) scale(.1)";
      }

      const frame = (now: number) => {
        const rawProgress = Math.min((now - startedAt) / duration, 1);
        const eased = easeOutSine(rawProgress);
        const radius = targetRadius * eased;

        overlay?.style.setProperty("--admin-overlay-radius", `${radius}px`);
        wave.style.setProperty("--admin-ripple-radius", `${radius}px`);

        const ringOneProgress = Math.min(rawProgress * 1.04, 1);
        const ringTwoProgress = Math.max(
          0,
          Math.min((rawProgress - 0.12) * 1.14, 1),
        );

        const ringOneRadius = targetRadius * easeOutSine(ringOneProgress);
        const ringTwoRadius = targetRadius * easeOutSine(ringTwoProgress);

        ringOne.style.transform = `translate3d(-50%, -50%, 0) scale(${Math.max(
          ringOneRadius / 9,
          0.1,
        )})`;
        ringOne.style.opacity = `${Math.max(0, 0.26 * (1 - ringOneProgress))}`;

        ringTwo.style.transform = `translate3d(-50%, -50%, 0) scale(${Math.max(
          ringTwoRadius / 9,
          0.1,
        )})`;
        ringTwo.style.opacity = `${Math.max(0, 0.16 * (1 - ringTwoProgress))}`;

        if (rawProgress < 1) {
          rafRef.current = requestAnimationFrame(frame);
          return;
        }

        finishRipple();
      };

      rafRef.current = requestAnimationFrame(frame);
    },
    [createSnapshotOverlay, finishRipple],
  );

  const value = useMemo<AdminRippleThemeContextValue>(
    () => ({
      theme,
      isAnimating,
      toggleThemeFromPoint,
    }),
    [theme, isAnimating, toggleThemeFromPoint],
  );

  return (
    <AdminRippleThemeContext.Provider value={value}>
      <div
        className="admin-ripple-theme-shell font-sans"
        data-admin-theme={theme}
        data-theme-animating={isAnimating ? "true" : "false"}
        suppressHydrationWarning
      >
        <div aria-hidden="true" className="admin-theme-background-stack">
          <div
            className="admin-theme-bg admin-theme-bg-base"
            data-theme={theme}
            suppressHydrationWarning
          />

          <div ref={waveRef} className="admin-ripple-soft-wave" />
          <div ref={ringOneRef} className="admin-ripple-ring" />
          <div
            ref={ringTwoRef}
            className="admin-ripple-ring admin-ripple-ring-two"
          />
        </div>

        {children}
      </div>
    </AdminRippleThemeContext.Provider>
  );
}

export function useAdminRippleTheme() {
  const context = useContext(AdminRippleThemeContext);

  if (!context) {
    throw new Error(
      "useAdminRippleTheme must be used inside AdminRippleThemeProvider",
    );
  }

  return context;
}

export function AdminRippleThemeToggle() {
  const { theme, isAnimating, toggleThemeFromPoint } = useAdminRippleTheme();

  return (
    <button
      type="button"
      className="admin-theme-toggle"
      disabled={isAnimating}
      aria-label="Chuyển giao diện sáng tối"
      aria-pressed={theme === "dark"}
      onClick={(event) => toggleThemeFromPoint(event.clientX, event.clientY)}
      suppressHydrationWarning
    >
      <span className="admin-theme-toggle-art" aria-hidden="true">
        <span className="admin-theme-toggle-icon admin-theme-toggle-sun">
          <SunMedium className="h-4.5 w-4.5" />
        </span>

        <span className="admin-theme-toggle-icon admin-theme-toggle-moon">
          <Moon className="h-4.5 w-4.5" />
        </span>
      </span>
    </button>
  );
}
