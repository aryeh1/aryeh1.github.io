/**
 * Efipaz-Inspired Color Theme System
 * ===================================
 * Japanese minimalist design with 3 core colors:
 * 1. Cream background - #F7F5F0
 * 2. Dark text - #1A1A1A
 * 3. Deep red accent - #8B2635
 *
 * Usage in CSS:  var(--color-name)
 * Usage in JS:   theme.light.colorName or theme.dark.colorName
 */

export const theme = {
  light: {
    // Backgrounds
    bgPrimary: '#F7F5F0',       // Warm cream
    bgAlt: '#EFEBE4',           // Slightly darker cream
    bgCard: '#FFFFFF',          // White for cards

    // Text
    textPrimary: '#1A1A1A',     // Near black
    textSecondary: '#4A4A4A',   // Medium gray
    textMuted: '#6A6A6A',       // Light gray

    // Accent - Japanese red
    accent: '#8B2635',
    accentHover: '#6B1D29',

    // UI Elements
    border: '#D4CFC5',
    inputBg: '#FFFFFF',

    // Special
    overlay: 'rgba(26, 26, 26, 0.6)',
  },

  dark: {
    // Backgrounds
    bgPrimary: '#1A1A1A',
    bgAlt: '#242424',
    bgCard: '#2A2A2A',

    // Text
    textPrimary: '#F7F5F0',
    textSecondary: '#B8B8B8',
    textMuted: '#808080',

    // Accent - Lighter red for dark mode
    accent: '#C4424F',
    accentHover: '#D4525F',

    // UI Elements
    border: '#3A3A3A',
    inputBg: '#2A2A2A',

    // Special
    overlay: 'rgba(0, 0, 0, 0.8)',
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
 */
export function getThemeColor(
  mode: ThemeMode,
  colorKey: keyof LightTheme
): string {
  return theme[mode][colorKey];
}

/**
 * Get CSS variable reference string.
 */
export function cssVar(varName: string): string {
  return `var(--${varName})`;
}
