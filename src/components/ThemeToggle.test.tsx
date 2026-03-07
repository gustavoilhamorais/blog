import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { THEME_STORAGE_KEY } from '../theme-context'
import { ThemeProvider } from '../theme'
import { ThemeToggle } from './ThemeToggle'

function renderThemeToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

function mockSystemTheme(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('ThemeToggle', () => {
  it('shows the dark label by default and toggles to light', async () => {
    const user = userEvent.setup()

    renderThemeToggle()

    const button = screen.getByRole('button', { name: 'Toggle theme' })

    expect(button).toHaveTextContent('Dark')

    await user.click(button)

    expect(button).toHaveTextContent('Light')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('uses the saved localStorage theme before the system preference', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    mockSystemTheme(true)

    renderThemeToggle()

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveTextContent(
      'Dark',
    )
  })

  it('falls back to the system preference when there is no saved theme', () => {
    mockSystemTheme(true)

    renderThemeToggle()

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveTextContent(
      'Light',
    )
  })
})
