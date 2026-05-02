'use client';

import { useThemeStore } from '@/stores/theme-store';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  // Determine if currently in dark mode
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full border border-border bg-card hover:bg-primary/10 w-10 h-10"
    >
      {isDark ? (
        <Sun size={18} className="text-primary" />
      ) : (
        <Moon size={18} className="text-primary" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
