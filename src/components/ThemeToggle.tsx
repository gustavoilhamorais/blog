import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme-context'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const buttonClass =
    theme === 'dark'
      ? 'border-stone-700/80 bg-stone-800/80 text-stone-100 hover:bg-stone-800'
      : 'border-rose-200/70 bg-rose-50/80 text-stone-700 hover:bg-rose-100/90'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm shadow-sm transition ${buttonClass}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}
