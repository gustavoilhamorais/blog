import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'
export type ThemePreference = 'system' | Theme

export type ThemeContextValue = {
  theme: Theme
  themePreference: ThemePreference
  setThemePreference: (themePreference: ThemePreference) => void
}

export const THEME_STORAGE_KEY = 'minimalist-blog-theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const value = useContext(ThemeContext)

  if (!value) {
    throw new Error('Theme context is missing.')
  }

  return value
}
