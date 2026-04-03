export type ColorScheme = "light" | "dark";

/**
 * Design tokens derived from the amber theme,
 * mapped to a Material Design 3 structure with sidebar and chart extensions.
 */
export const Colors = {
  light: {
    // ── Core MD3 ────────────────────────────────────────────────────────────
    primary: "#f59e0b",
    onPrimary: "#000000",
    primaryContainer: "#fffbeb", // --accent
    onPrimaryContainer: "#92400e", // --accent-foreground

    secondary: "#f3f4f6", // --secondary
    onSecondary: "#4b5563", // --secondary-foreground
    secondaryContainer: "#f3f4f6",
    onSecondaryContainer: "#4b5563",

    tertiary: "#b45309", // chart-3
    onTertiary: "#ffffff",
    tertiaryContainer: "#fef3c7",
    onTertiaryContainer: "#78350f", // chart-5

    error: "#ef4444", // --destructive
    onError: "#ffffff",
    errorContainer: "#fef2f2",
    onErrorContainer: "#7f1d1d",

    background: "#ffffff",
    onBackground: "#262626", // --foreground
    surface: "#ffffff", // --card
    onSurface: "#262626", // --card-foreground
    surfaceVariant: "#f3f4f6", // --muted
    onSurfaceVariant: "#6b7280", // --muted-foreground
    outline: "#e5e7eb", // --border
    outlineVariant: "#e5e7eb",

    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#262626",
    inverseOnSurface: "#e5e5e5",
    inversePrimary: "#d97706", // chart-2

    elevation: {
      level0: "transparent",
      level1: "#f9fafb", // --muted
      level2: "#f3f4f6", // --secondary
      level3: "#fffbeb", // amber-50 tint
      level4: "#fffbeb",
      level5: "#fef3c7", // amber-100 tint
    },

    surfaceDisabled: "rgba(38, 38, 38, 0.12)",
    onSurfaceDisabled: "rgba(38, 38, 38, 0.38)",
    backdrop: "rgba(0, 0, 0, 0.4)",

    // ── Sidebar ─────────────────────────────────────────────────────────────
    sidebar: "#f6f6f6",
    sidebarForeground: "#262626",
    sidebarPrimary: "#f59e0b",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent: "#fffbeb",
    sidebarAccentForeground: "#92400e",
    sidebarBorder: "#e5e7eb",
    sidebarRing: "#f59e0b",

    // ── Charts ──────────────────────────────────────────────────────────────
    chart: {
      1: "#f59e0b",
      2: "#d97706",
      3: "#b45309",
      4: "#92400e",
      5: "#78350f",
    },
  },

  dark: {
    // ── Core MD3 ────────────────────────────────────────────────────────────
    primary: "#f59e0b",
    onPrimary: "#000000",
    primaryContainer: "#92400e", // --accent (dark)
    onPrimaryContainer: "#fde68a", // --accent-foreground (dark)

    secondary: "#262626", // --secondary (dark)
    onSecondary: "#e5e5e5",
    secondaryContainer: "#262626",
    onSecondaryContainer: "#e5e5e5",

    tertiary: "#b45309",
    onTertiary: "#ffffff",
    tertiaryContainer: "#78350f",
    onTertiaryContainer: "#fde68a",

    error: "#ef4444",
    onError: "#ffffff",
    errorContainer: "#7f1d1d",
    onErrorContainer: "#fca5a5",

    background: "#171717",
    onBackground: "#e5e5e5",
    surface: "#262626", // --card (dark)
    onSurface: "#e5e5e5",
    surfaceVariant: "#1f1f1f", // --muted (dark)
    onSurfaceVariant: "#a3a3a3", // --muted-foreground (dark)
    outline: "#404040", // --border (dark)
    outlineVariant: "#404040",

    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#e5e5e5",
    inverseOnSurface: "#262626",
    inversePrimary: "#d97706",

    elevation: {
      level0: "transparent",
      level1: "#1f1f1f",
      level2: "#262626",
      level3: "#2d2519",
      level4: "#322a1a",
      level5: "#3a2f1c",
    },

    surfaceDisabled: "rgba(229, 229, 229, 0.12)",
    onSurfaceDisabled: "rgba(229, 229, 229, 0.38)",
    backdrop: "rgba(0, 0, 0, 0.6)",

    // ── Sidebar ─────────────────────────────────────────────────────────────
    sidebar: "#0f0f0f",
    sidebarForeground: "#e5e5e5",
    sidebarPrimary: "#f59e0b",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent: "#92400e",
    sidebarAccentForeground: "#fde68a",
    sidebarBorder: "#404040",
    sidebarRing: "#f59e0b",

    // ── Charts ──────────────────────────────────────────────────────────────
    chart: {
      1: "#fbbf24",
      2: "#d97706",
      3: "#92400e",
      4: "#b45309",
      5: "#92400e",
    },
  },
} as const;

export type ThemeColors = typeof Colors.light;
