export type ColorMode = 'light' | 'dark';

import typefirstLight from '@/lib/themes/v0/shiki-typefirst-light.json';

export const CodeThemes = {
  shiki: {
    // Custom brand-aligned light theme (duotone: blue + teal)
    light: typefirstLight as unknown as any,
    // Dark can be customized later; keep a sensible default for now
    dark: 'dark-plus',
  },
  // Keep Monaco on its clean defaults unless we opt-in to custom themes
  monaco: {
    light: 'vs',
    dark: 'vs-dark',
  },
} as const;

export function getShikiTheme(mode: ColorMode = 'light'): string {
  return CodeThemes.shiki[mode];
}

export function getMonacoTheme(mode: ColorMode = 'light'): string {
  return CodeThemes.monaco[mode];
}
