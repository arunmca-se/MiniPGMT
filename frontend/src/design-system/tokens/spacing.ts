/**
 * Design System - Spacing Tokens
 *
 * Consistent spacing using 8-point grid system.
 * All spacing throughout the application should use these values.
 */

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  7: '1.75rem',  // 28px
  8: '2rem',     // 32px
  9: '2.25rem',  // 36px
  10: '2.5rem',  // 40px
  11: '2.75rem', // 44px
  12: '3rem',    // 48px
  14: '3.5rem',  // 56px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  28: '7rem',    // 112px
  32: '8rem',    // 128px
  36: '9rem',    // 144px
  40: '10rem',   // 160px
} as const;

// Semantic spacing aliases for common use cases
export const gap = {
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[4],
  lg: spacing[6],
  xl: spacing[8],
} as const;

export const padding = {
  xs: spacing[2],
  sm: spacing[3],
  md: spacing[4],
  lg: spacing[6],
  xl: spacing[8],
} as const;

export const margin = {
  xs: spacing[2],
  sm: spacing[4],
  md: spacing[6],
  lg: spacing[8],
  xl: spacing[12],
} as const;
