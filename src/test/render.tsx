import type React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import App from '../App'

type RouterOptions = Omit<MemoryRouterProps, 'children'> &
  Omit<RenderOptions, 'wrapper'>

export function renderWithRouter(
  ui: React.ReactElement,
  { initialEntries = ['/'], initialIndex, ...renderOptions }: RouterOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        {children}
      </MemoryRouter>
    ),
    ...renderOptions,
  })
}

export function renderApp(initialEntries: string[] = ['/']) {
  return renderWithRouter(<App />, { initialEntries })
}
