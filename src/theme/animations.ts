import { withSpring } from 'react-native-reanimated';

export type SpringPreset = {
  mass?: number;
  damping?: number;
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
};

/**
 * Named spring presets for common animation patterns.
 *
 * Usage:
 *   translateX.value = spring(100, 'bouncy');
 *   opacity.value    = spring(0, 'snap');
 */
export const springPresets = {
  /** Smooth, no bounce — standard UI interactions */
  gentle: {
    mass: 1,
    damping: 20,
    stiffness: 150,
    overshootClamping: false,
  },

  /** Light bounce — list items, cards, FABs */
  bouncy: {
    mass: 1,
    damping: 10,
    stiffness: 180,
    overshootClamping: false,
  },

  /** Snappy, minimal bounce — drawers, navigation transitions */
  stiff: {
    mass: 1,
    damping: 26,
    stiffness: 300,
    overshootClamping: false,
  },

  /** Very slow and smooth — background colour transitions */
  slow: {
    mass: 1,
    damping: 20,
    stiffness: 60,
    overshootClamping: false,
  },

  /** No overshoot, crisp — modals, overlays */
  snap: {
    mass: 0.5,
    damping: 30,
    stiffness: 400,
    overshootClamping: true,
  },
} as const satisfies Record<string, SpringPreset>;

export type SpringPresetName = keyof typeof springPresets;

/**
 * Convenience wrapper around withSpring using a named preset.
 *
 * @example
 * scale.value = spring(1.2, 'bouncy');
 */
export const spring = (
  toValue: number,
  preset: SpringPresetName = 'gentle',
) => withSpring(toValue, springPresets[preset]);
