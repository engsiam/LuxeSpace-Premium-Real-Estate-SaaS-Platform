// design-system/spacing.ts
// STRICT SCALE ONLY - 4px, 8px, 16px, 24px, 32px, 48px, 64px

export const spacing = {
  xs: 'p-1',     // 4px
  sm: 'p-2',     // 8px
  md: 'p-4',     // 16px
  lg: 'p-6',     // 24px
  xl: 'p-8',     // 32px
  '2xl': 'p-12',  // 48px
  '3xl': 'p-16', // 64px
} as const;

export const margin = {
  xs: 'm-1',
  sm: 'm-2',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
  '2xl': 'm-12',
  '3xl': 'm-16',
} as const;

export const gap = {
  xs: 'gap-1',     // 4px
  sm: 'gap-2',     // 8px
  md: 'gap-4',     // 16px
  lg: 'gap-6',     // 24px
  xl: 'gap-8',     // 32px
  '2xl': 'gap-12', // 48px
} as const;

// USAGE:
// p-{key}, m-{key}, gap-{key}
// NO: p-10, p-12, p-[10px], etc.
