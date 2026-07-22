'use client';

import { useEffect, useState, type MouseEvent } from 'react';

type ThemeRipple = {
  active: boolean;
  x: number;
  y: number;
  radius: number;
  toDark: boolean;
};

function getInitialDarkMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  const savedTheme = window.localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    return true;
  }

  if (savedTheme === 'light') {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [ripple, setRipple] = useState<ThemeRipple>({
    active: false,
    x: 0,
    y: 0,
    radius: 0,
    toDark: false,
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const toDark = !isDarkMode;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const radius = Math.hypot(maxX, maxY) + 80;

    setRipple({ active: true, x, y, radius, toDark });

    window.setTimeout(() => {
      document.documentElement.classList.toggle('dark', toDark);
      window.localStorage.setItem('theme', toDark ? 'dark' : 'light');
      setIsDarkMode(toDark);
    }, 300);

    window.setTimeout(() => {
      setRipple((prev) => ({ ...prev, active: false }));
    }, 740);
  };

  return { isDarkMode, ripple, toggleTheme };
}
