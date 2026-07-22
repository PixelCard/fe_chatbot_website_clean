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
      className="client-theme-toggle"
      aria-label="Đổi giao diện sáng tối"
      aria-pressed={isDarkMode}
    >
      <span className="client-theme-toggle-art" aria-hidden="true">
        <span className="client-theme-toggle-icon client-theme-toggle-sun">
          <Sun className="h-4.5 w-4.5" />
        </span>

        <span className="client-theme-toggle-icon client-theme-toggle-moon">
          <Moon className="h-4.5 w-4.5" />
        </span>
      </span>
    </button>
  );
}
