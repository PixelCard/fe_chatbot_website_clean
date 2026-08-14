'use client';

import { Moon, Sun } from 'lucide-react';
import type { MouseEvent } from 'react';

type ThemeToggleButtonProps = {
  isDarkMode: boolean;
  isAnimating?: boolean;
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function ThemeToggleButton({
  isDarkMode,
  isAnimating = false,
  onToggle,
}: ThemeToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isAnimating}
      className={[
        'group relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-all duration-200',
        'border-orange-200/90 bg-white/95 text-orange-500 shadow-sm hover:border-orange-500 hover:bg-orange-50/80 hover:text-orange-600',
        'dark:border-cyan-500/40 dark:bg-slate-900/90 dark:text-cyan-400 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300',
        'active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 dark:focus-visible:ring-cyan-500/25',
      ].join(' ')}
      aria-label="Đổi giao diện sáng tối"
      aria-pressed={isDarkMode}
    >
      <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500/10 transition-colors duration-200 dark:bg-cyan-500/20">
        {isDarkMode ? (
          <Sun className="h-4.5 w-4.5 text-cyan-300 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-4.5 w-4.5 text-orange-500 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </span>
    </button>
  );
}
