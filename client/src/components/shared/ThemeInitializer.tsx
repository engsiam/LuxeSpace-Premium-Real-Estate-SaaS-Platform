'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export default function ThemeInitializer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme once after hydration
  // The store handles all subsequent theme changes
  useEffect(() => {
    if (!mounted) return;
    const state = useThemeStore.getState();
    const { theme } = state;
    const resolved =
      theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.setAttribute('data-theme', resolved);
  }, [mounted]);

  return null;
}
