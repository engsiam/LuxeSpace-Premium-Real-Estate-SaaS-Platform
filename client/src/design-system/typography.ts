// Typography tokens - LOCKED
// No custom font sizes allowed

export const typography = {
  h1: 'text-5xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',  
  h3: 'text-xl font-medium',
  body: 'text-base font-normal',
  small: 'text-sm font-normal',
  xs: 'text-xs font-normal',
} as const;

// Heading scale:
// H1 → text-5xl font-bold (32px bold)
// H2 → text-3xl font-semibold (24px semibold)
// H3 → text-xl font-medium (20px medium)
// Body → text-base (16px normal)
// Small → text-sm (14px normal)
// XS → text-xs (12px normal)

// NO exceptions. NO custom sizes like text-[10rem], text-7xl, etc.
