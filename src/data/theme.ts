/**
 * Centralized Color Theme System
 * ==============================
 * ALL colors in the app MUST come from here.
 * Never use hardcoded colors anywhere else.
 *
 * Usage in CSS:  var(--color-name)
 * Usage in JS:   theme.light.colorName or theme.dark.colorName
 *
 * For components that can't use CSS variables (e.g., SVG),
 * use the getThemeColor() helper function.
 */

export const theme = {
  light: {
    // Backgrounds
    bgPrimary: '#F5F2EB',       // Main background - warm cream
    bgAlt: '#EBE7DF',           // Alternate background - slightly darker cream
    bgCard: '#FAF8F5',          // Card background - lighter cream

    // Text
    textPrimary: '#2D2A26',     // Main text - warm dark brown
    textSecondary: '#5C5650',   // Secondary text - warm medium brown
    textMuted: '#8A847C',       // Muted text - warm gray-brown

    // Accent
    accent: '#C4A77D',          // Primary accent - warm gold/tan
    accentHover: '#A8895F',     // Accent hover state - darker gold

    // UI Elements
    border: '#DDD9D2',          // Border color - warm border
    inputBg: '#FAF8F5',         // Input background

    // Special
    overlay: 'rgba(45, 42, 38, 0.6)',  // Modal overlay
  },

  dark: {
    // Backgrounds
    bgPrimary: '#1C1A18',       // Main background - warm charcoal
    bgAlt: '#252320',           // Alternate background - slightly lighter
    bgCard: '#2D2A27',          // Card background

    // Text
    textPrimary: '#F5F2EB',     // Main text - cream (matches light bg)
    textSecondary: '#C4BFB6',   // Secondary text - visible
    textMuted: '#8A847C',       // Muted text - still readable

    // Accent
    accent: '#C4A77D',          // Primary accent - same as light
    accentHover: '#D4B78D',     // Accent hover - lighter for dark mode

    // UI Elements
    border: '#3D3935',          // Border color - warm dark
    inputBg: '#2D2A27',         // Input background

    // Special
    overlay: 'rgba(0, 0, 0, 0.7)',  // Modal overlay
  },
} as const;

/**
 * CSS variable names (for documentation and type safety)
 */
export const cssVars = {
  // Light mode
  '--bg-primary': 'bgPrimary',
  '--bg-alt': 'bgAlt',
  '--bg-card': 'bgCard',
  '--text-primary': 'textPrimary',
  '--text-secondary': 'textSecondary',
  '--text-muted': 'textMuted',
  '--accent': 'accent',
  '--accent-hover': 'accentHover',
  '--border': 'border',
  '--input-bg': 'inputBg',

  // Dark mode
  '--bg-dark': 'bgPrimary',
  '--bg-dark-alt': 'bgAlt',
  '--bg-dark-card': 'bgCard',
  '--text-dark': 'textPrimary',
  '--text-dark-secondary': 'textSecondary',
  '--text-dark-muted': 'textMuted',
  '--border-dark': 'border',
  '--input-bg-dark': 'inputBg',
} as const;

export type ThemeMode = 'light' | 'dark';
export type LightTheme = typeof theme.light;
export type DarkTheme = typeof theme.dark;

/**
 * Get a specific color value based on the current theme.
 * Use this for components that can't use CSS variables (e.g., SVG fill/stroke).
 *
 * @param mode - Current theme mode
 * @param colorKey - Key from theme object
 * @returns The color value as a string
 *
 * @example
 * const bgColor = getThemeColor(isDark ? 'dark' : 'light', 'bgPrimary');
 */
export function getThemeColor(
  mode: ThemeMode,
  colorKey: keyof LightTheme
): string {
  return theme[mode][colorKey];
}

/**
 * Get CSS variable reference string.
 * Use for inline styles that need to reference CSS variables.
 *
 * @param varName - CSS variable name (without --)
 * @returns CSS var() reference
 *
 * @example
 * style={{ color: cssVar('text-primary') }}
 * // Returns: "var(--text-primary)"
 */
export function cssVar(varName: string): string {
  return `var(--${varName})`;
}
