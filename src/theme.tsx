import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
  type ThemePreference,
  type ThemeContextValue,
} from './theme-context'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') {
      return 'system'
    }

    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)

    return saved === 'system' || saved === 'light' || saved === 'dark'
      ? saved
      : 'system'
  })
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === 'undefined'
      ? 'light'
      : themePreference === 'system'
        ? getSystemTheme()
        : themePreference,
  )

  useEffect(() => {
    if (themePreference !== 'system') {
      setTheme(themePreference)
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystemTheme = () => {
      setTheme(getSystemTheme())
    }

    syncSystemTheme()
    mediaQuery.addEventListener('change', syncSystemTheme)

    return () => {
      mediaQuery.removeEventListener('change', syncSystemTheme)
    }
  }, [themePreference])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themePreference,
      setThemePreference,
    }),
    [theme, themePreference],
  )

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
  }, [themePreference])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
