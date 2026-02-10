const BASE = 4;

/** Semantic spacing based on a 4pt grid. */
export const spacing = {
  none:  0,
  half:  BASE / 2,   // 2
  xs:    BASE,        // 4
  sm:    BASE * 2,    // 8
  md:    BASE * 4,    // 16
  lg:    BASE * 6,    // 24
  xl:    BASE * 8,    // 32
  '2xl': BASE * 10,   // 40
  '3xl': BASE * 12,   // 48
  '4xl': BASE * 16,   // 64
} as const;

/** Convenience helper: multiply the base unit by n. */
export const sp = (n: number) => BASE * n;

/**
 * Border radius derived from CSS --radius: 0.375rem (6px).
 * --radius-sm = base - 4 = 2px   (xs)
 * --radius-md = base - 2 = 4px   (sm)
 * --radius-lg = base      = 6px  (md)  ← default component radius
 * --radius-xl = base + 4 = 10px  (lg)
 */
export const borderRadius = {
  none: 0,
  xs:   2,    // --radius-sm
  sm:   4,    // --radius-md
  md:   6,    // --radius-lg  (base, matches --radius)
  lg:   10,   // --radius-xl
  xl:   16,
  '2xl': 24,
  full: 9999,
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

export const zIndex = {
  base:    0,
  raised:  10,
  overlay: 100,
  modal:   200,
  toast:   300,
} as const;
