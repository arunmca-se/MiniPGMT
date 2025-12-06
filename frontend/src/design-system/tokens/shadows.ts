/**
 * Design System - Shadow Tokens
 *
 * Subtle, professional shadows for elevation and depth.
 * Creates a consistent elevation system throughout the application.
 */

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// Elevation system for card components
export const elevation = {
  0: shadows.none,
  1: shadows.sm,
  2: shadows.base,
  3: shadows.md,
  4: shadows.lg,
  5: shadows.xl,
  6: shadows['2xl'],
} as const;

// Specialized shadow effects
export const shadowEffects = {
  card: shadows.base,
  cardHover: shadows.lg,
  dropdown: shadows.lg,
  modal: shadows['2xl'],
  button: shadows.sm,
  buttonHover: shadows.md,
  input: shadows.inner,
  toast: shadows.lg,
} as const;

export type ShadowKey = keyof typeof shadows;
export type ElevationLevel = keyof typeof elevation;
