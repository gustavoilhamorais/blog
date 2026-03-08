import {
  ChevronDown,
  Monitor,
  Moon,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from '../theme-context'

type ThemeOption = {
  description: string
  icon: LucideIcon
  label: 'System' | 'Light' | 'Dark'
  value: 'system' | 'light' | 'dark'
}

const themeOptions: ThemeOption[] = [
  {
    value: 'system',
    label: 'System',
    description: 'Follow device appearance',
    icon: Monitor,
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Warm paper tones',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Dim reading surface',
    icon: Moon,
  },
]

export function ThemeToggle() {
  const { theme, themePreference, setThemePreference } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(() =>
    themeOptions.findIndex((option) => option.value === themePreference),
  )
  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const listboxId = useId()

  const selectedIndex = themeOptions.findIndex(
    (option) => option.value === themePreference,
  )
  const selectedOption = themeOptions[selectedIndex] ?? themeOptions[0]
  const SelectedIcon = selectedOption.icon

  const controlClass =
    theme === 'dark'
      ? 'border-stone-700/80 bg-stone-800/85 text-stone-100 shadow-black/20 hover:bg-stone-800'
      : 'border-rose-200/70 bg-rose-50/85 text-stone-700 shadow-rose-200/40 hover:bg-rose-100/90'
  const menuClass =
    theme === 'dark'
      ? 'border-stone-700/80 bg-stone-900/95 text-stone-100 shadow-2xl shadow-black/35'
      : 'border-rose-200/80 bg-white/95 text-stone-800 shadow-2xl shadow-rose-200/50'

  useEffect(() => {
    setHighlightedIndex(selectedIndex)
  }, [selectedIndex])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    optionRefs.current[highlightedIndex]?.focus()
  }, [highlightedIndex, isOpen])

  const closeMenu = () => {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  const openMenu = (index = selectedIndex) => {
    setHighlightedIndex(index)
    setIsOpen(true)
  }

  const selectOption = (value: ThemeOption['value']) => {
    setThemePreference(value)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        className={`inline-flex min-w-34 items-center justify-between gap-3 rounded-full border px-3.5 py-2 text-sm shadow-sm backdrop-blur-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          theme === 'dark'
            ? 'focus-visible:ring-stone-300 focus-visible:ring-offset-stone-950'
            : 'focus-visible:ring-stone-900/70 focus-visible:ring-offset-rose-50'
        } ${controlClass}`}
        onClick={() => {
          if (isOpen) {
            closeMenu()
            return
          }

          openMenu()
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            openMenu(
              event.key === 'ArrowDown'
                ? selectedIndex
                : (selectedIndex + themeOptions.length - 1) % themeOptions.length,
            )
          }
        }}
      >
        <span className="flex items-center gap-2.5">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full ${
              theme === 'dark'
                ? 'bg-stone-700/80 text-stone-100'
                : 'bg-white/90 text-stone-700'
            }`}
          >
            <SelectedIcon className="h-4 w-4" />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] opacity-70">
              Theme
            </span>
            <span className="mt-1 font-medium">{selectedOption.label}</span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Theme options"
          className={`absolute right-0 top-full z-20 mt-3 w-64 rounded-3xl border p-2 backdrop-blur-xl ${menuClass}`}
        >
          {themeOptions.map((option, index) => {
            const OptionIcon = option.icon
            const isSelected = option.value === themePreference
            const isHighlighted = index === highlightedIndex

            return (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left outline-none transition ${
                  theme === 'dark'
                    ? isHighlighted
                      ? 'bg-stone-800 text-stone-50'
                      : 'text-stone-300'
                    : isHighlighted
                      ? 'bg-rose-50 text-stone-900'
                      : 'text-stone-600'
                } ${
                  theme === 'dark'
                    ? 'focus-visible:ring-2 focus-visible:ring-stone-300'
                    : 'focus-visible:ring-2 focus-visible:ring-stone-900/70'
                }`}
                onClick={() => {
                  selectOption(option.value)
                }}
                onFocus={() => {
                  setHighlightedIndex(index)
                }}
                onMouseEnter={() => {
                  setHighlightedIndex(index)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setHighlightedIndex((index + 1) % themeOptions.length)
                    return
                  }

                  if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    setHighlightedIndex(
                      (index + themeOptions.length - 1) % themeOptions.length,
                    )
                    return
                  }

                  if (event.key === 'Escape') {
                    event.preventDefault()
                    closeMenu()
                    return
                  }

                  if (event.key === 'Tab') {
                    setIsOpen(false)
                  }
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      theme === 'dark'
                        ? isSelected
                          ? 'bg-stone-50 text-stone-950'
                          : 'bg-stone-800/90 text-stone-200'
                        : isSelected
                          ? 'bg-stone-900 text-stone-50'
                          : 'bg-white text-stone-700'
                    }`}
                  >
                    <OptionIcon className="h-4 w-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span
                      className={`text-xs ${
                        theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
                      }`}
                    >
                      {option.description}
                    </span>
                  </span>
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-[0.65rem] uppercase tracking-[0.18em] ${
                    isSelected
                      ? theme === 'dark'
                        ? 'bg-stone-50 text-stone-950'
                        : 'bg-stone-900 text-stone-50'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-400'
                        : 'bg-rose-50 text-stone-500'
                  }`}
                >
                  {isSelected ? 'Active' : 'Choose'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
