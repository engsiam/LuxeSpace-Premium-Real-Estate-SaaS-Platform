// design-system/tokens.ts
// SINGLE SOURCE OF TRUTH - NO EXCEPTIONS

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

export const typography = {
  h1: 'text-5xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-xl font-medium',
  body: 'text-base font-normal',
  small: 'text-sm font-normal',
  xs: 'text-xs font-normal',
} as const;

export const colors = {
  primary: '#C9A74D',
  background: '#0B0F1A',
  surface: '#121826',
  text: '#FFFFFF',
  muted: '#9CA3AF',
  border: '#1E293B',
  destructive: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  primaryForeground: '#0B0F1A',
  secondaryForeground: '#FFFFFF',
} as const;

export const radius = {
  default: '0.75rem',  // rounded-xl
  lg: '1rem',        // rounded-2xl
  full: '9999px',     // rounded-full
} as const;

// LOCKED: NO other values allowed anywhere
// NO arbitrary values: p-[10px], text-[10rem], etc.
// NO hardcoded colors: #xyz, rgba(), etc.
