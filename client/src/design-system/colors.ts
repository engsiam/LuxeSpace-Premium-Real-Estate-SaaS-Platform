// Color tokens - NO random colors allowed
// Primary → #C9A74D (Gold)
// Background → #0B0F1A (Deep Navy)
// Surface → #121826 (Card backgrounds)
// Text → #FFFFFF (White)
// Muted → #9CA3AF (Gray)

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
} as const;

// Usage in Tailwind:
// bg-[#C9A74D] → bg-primary
// bg-[#0B0F1A] → bg-background
// bg-[#121826] → bg-surface (custom)
// text-[#FFFFFF] → text-text (custom)
// text-[#9CA3AF] → text-muted-foreground

// NO hardcoded hex values anywhere in codebase
// NO arbitrary color classes like bg-[#xyz]
