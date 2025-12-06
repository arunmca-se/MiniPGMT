/**
 * Design System - Animation Tokens
 *
 * Smooth, consistent animations and transitions throughout the application.
 * Provides a polished, professional feel to all interactions.
 */

export const animations = {
  // Transition durations
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Duration values (in ms)
  duration: {
    fast: 150,
    base: 200,
    slow: 300,
    slower: 500,
  },

  // Easing functions
  easing: {
    // Standard easing
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Accelerate (ease-in)
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    // Decelerate (ease-out)
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    // Sharp (no easing)
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    // Bounce
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Keyframe animations
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    slideUp: {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideDown: {
      from: { transform: 'translateY(-10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideLeft: {
      from: { transform: 'translateX(10px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    slideRight: {
      from: { transform: 'translateX(-10px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    scaleOut: {
      from: { transform: 'scale(1)', opacity: 1 },
      to: { transform: 'scale(0.95)', opacity: 0 },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    shimmer: {
      '0%': { backgroundPosition: '-1000px 0' },
      '100%': { backgroundPosition: '1000px 0' },
    },
  },
} as const;

// Common animation presets
export const animationPresets = {
  // Fade animations
  fadeIn: `fadeIn ${animations.duration.base}ms ${animations.easing.standard}`,
  fadeOut: `fadeOut ${animations.duration.base}ms ${animations.easing.standard}`,

  // Slide animations
  slideUp: `slideUp ${animations.duration.base}ms ${animations.easing.decelerate}`,
  slideDown: `slideDown ${animations.duration.base}ms ${animations.easing.decelerate}`,
  slideLeft: `slideLeft ${animations.duration.base}ms ${animations.easing.decelerate}`,
  slideRight: `slideRight ${animations.duration.base}ms ${animations.easing.decelerate}`,

  // Scale animations
  scaleIn: `scaleIn ${animations.duration.fast}ms ${animations.easing.decelerate}`,
  scaleOut: `scaleOut ${animations.duration.fast}ms ${animations.easing.accelerate}`,

  // Loading animations
  spin: `spin ${animations.duration.slower}ms linear infinite`,
  shimmer: `shimmer 2000ms linear infinite`,
} as const;

// Transition properties for common interactions
export const transitionProperties = {
  all: `all ${animations.transition.base}`,
  colors: `color ${animations.transition.base}, background-color ${animations.transition.base}, border-color ${animations.transition.base}`,
  opacity: `opacity ${animations.transition.base}`,
  shadow: `box-shadow ${animations.transition.base}`,
  transform: `transform ${animations.transition.base}`,
  size: `width ${animations.transition.base}, height ${animations.transition.base}`,
} as const;
