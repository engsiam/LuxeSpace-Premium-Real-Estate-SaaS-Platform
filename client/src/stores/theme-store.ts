import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyThemeToDOM(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.setAttribute('data-theme', resolved);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',

      setTheme: (theme: Theme) => {
        set({ theme });
        applyThemeToDOM(resolveTheme(theme));
      },

      toggleTheme: () => {
        const state = useThemeStore.getState();
        let newTheme: Theme;

        if (state.theme === 'system') {
          const resolved = resolveTheme('system');
          newTheme = resolved === 'dark' ? 'light' : 'dark';
        } else {
          newTheme = state.theme === 'dark' ? 'light' : 'dark';
        }

        set({ theme: newTheme });
        applyThemeToDOM(resolveTheme(newTheme));
      },
    }),
    {
      name: 'luxespace-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(resolveTheme(state.theme));
        }
      },
    }
  )
);

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const state = useThemeStore.getState();
    if (state.theme === 'system') {
      applyThemeToDOM(resolveTheme('system'));
    }
  });
}
