import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  it('defaults to the system option and persists explicit changes', async () => {
    const user = userEvent.setup()

    renderThemeToggle()

    const trigger = screen.getByRole('button', { name: 'Theme' })

    expect(trigger).toHaveTextContent('System')

    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: /dark/i }))

    expect(screen.getByRole('button', { name: 'Theme' })).toHaveTextContent(
      'Dark',
    )
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('uses the saved localStorage theme before the system preference', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    mockSystemTheme(true)

    renderThemeToggle()

    expect(screen.getByRole('button', { name: 'Theme' })).toHaveTextContent(
      'Light',
    )
  })

  it('shows all theme options when the menu opens', async () => {
    const user = userEvent.setup()

    renderThemeToggle()

    await user.click(screen.getByRole('button', { name: 'Theme' }))

    expect(screen.getByRole('listbox', { name: 'Theme options' })).toBeVisible()
    expect(screen.getByRole('option', { name: /system/i })).toBeVisible()
    expect(screen.getByRole('option', { name: /light/i })).toBeVisible()
    expect(screen.getByRole('option', { name: /dark/i })).toBeVisible()
  })

  it('closes on escape and outside click', async () => {
    const user = userEvent.setup()

    renderThemeToggle()

    await user.click(screen.getByRole('button', { name: 'Theme' }))
    expect(screen.getByRole('listbox', { name: 'Theme options' })).toBeVisible()

    fireEvent.keyDown(screen.getByRole('option', { name: /system/i }), {
      key: 'Escape',
    })

    await waitFor(() =>
      expect(
        screen.queryByRole('listbox', { name: 'Theme options' }),
      ).not.toBeInTheDocument(),
    )

    await user.click(screen.getByRole('button', { name: 'Theme' }))
    expect(screen.getByRole('listbox', { name: 'Theme options' })).toBeVisible()

    await user.click(document.body)

    await waitFor(() =>
      expect(
        screen.queryByRole('listbox', { name: 'Theme options' }),
      ).not.toBeInTheDocument(),
    )
  })

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup()

    renderThemeToggle()

    const trigger = screen.getByRole('button', { name: 'Theme' })

    trigger.focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')

    expect(screen.getByRole('button', { name: 'Theme' })).toHaveTextContent(
      'Light',
    )
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('keeps following system changes while system is selected', async () => {
    let matches = false
    let listener: ((event: MediaQueryListEvent) => void) | undefined

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(
        (_eventName: string, callback: (event: MediaQueryListEvent) => void) => {
          listener = callback
        },
      ),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    renderThemeToggle()

    const trigger = screen.getByRole('button', { name: 'Theme' })

    expect(trigger).toHaveTextContent('System')

    matches = true
    listener?.({ matches } as MediaQueryListEvent)

    await waitFor(() => expect(trigger).toHaveClass('border-stone-700/80'))
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('system')
  })
})
