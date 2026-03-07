import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
  type ThemeContextValue,
} from './theme-context'

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    return saved === 'light' || saved === 'dark'
      ? saved
      : systemDark
        ? 'dark'
        : 'light'
  })

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((previousTheme) =>
          previousTheme === 'dark' ? 'light' : 'dark',
        )
      },
    }),
    [theme],
  )

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
