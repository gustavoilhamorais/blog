import type React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import App from '../App'
import { BLOG_BASE_PATH } from '../lib/config'

type RouterOptions = Omit<MemoryRouterProps, 'children'> &
  Omit<RenderOptions, 'wrapper'>

type RouterEntry = NonNullable<MemoryRouterProps['initialEntries']>[number]

function withBasePathString(entry: string) {
  if (entry.startsWith(BLOG_BASE_PATH)) {
    return entry
  }

  if (entry === '/') {
    return `${BLOG_BASE_PATH}/`
  }

  return `${BLOG_BASE_PATH}${entry.startsWith('/') ? entry : `/${entry}`}`
}

function withBasePath(entry: RouterEntry): RouterEntry {
  if (typeof entry !== 'string') {
    return {
      ...entry,
      pathname: entry.pathname
        ? withBasePathString(entry.pathname)
        : `${BLOG_BASE_PATH}/`,
    }
  }

  return withBasePathString(entry)
}

export function renderWithRouter(
  ui: React.ReactElement,
  { initialEntries = ['/'], initialIndex, ...renderOptions }: RouterOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter
        basename={BLOG_BASE_PATH}
        initialEntries={initialEntries.map(withBasePath)}
        initialIndex={initialIndex}
      >
        {children}
      </MemoryRouter>
    ),
    ...renderOptions,
  })
}

export function renderApp(initialEntries: string[] = ['/']) {
  return renderWithRouter(<App />, { initialEntries })
}
