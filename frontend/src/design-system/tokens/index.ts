/**
 * Design System - Token Exports
 *
 * Central export point for all design tokens.
 * Import tokens from here to ensure consistency across the application.
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './shadows';
export * from './animations';

// Re-export everything as a single object for convenience
import { colors } from './colors';
import { spacing, gap, padding, margin } from './spacing';
import { typography, textStyles } from './typography';
import { shadows, elevation, shadowEffects } from './shadows';
import { animations, animationPresets, transitionProperties } from './animations';

export const tokens = {
  colors,
  spacing,
  gap,
  padding,
  margin,
  typography,
  textStyles,
  shadows,
  elevation,
  shadowEffects,
  animations,
  animationPresets,
  transitionProperties,
} as const;

export default tokens;
