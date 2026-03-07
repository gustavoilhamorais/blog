import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import React from 'react'
import { afterEach, vi } from 'vitest'
import { resetPostsCache } from '../lib/posts'
import { THEME_STORAGE_KEY } from '../theme-context'

type MotionProps = Record<string, unknown> & {
  children?: React.ReactNode
}

const motionPropNames = new Set([
  'animate',
  'exit',
  'initial',
  'layout',
  'layoutId',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
])

function stripMotionProps(props: MotionProps) {
  const cleanedProps: MotionProps = {}

  for (const [key, value] of Object.entries(props)) {
    if (!motionPropNames.has(key)) {
      cleanedProps[key] = value
    }
  }

  return cleanedProps
}

vi.mock('framer-motion', () => {
  const motion = new Proxy(
    {},
    {
      get: (_, tagName: string) =>
        function MotionComponent(props: MotionProps) {
          return React.createElement(
            tagName,
            stripMotionProps(props),
            props.children,
          )
        },
    },
  )

  return {
    AnimatePresence({ children }: { children: React.ReactNode }) {
      return React.createElement(React.Fragment, null, children)
    },
    LayoutGroup({ children }: { children: React.ReactNode }) {
      return React.createElement(React.Fragment, null, children)
    },
    motion,
    useReducedMotion: () => true,
  }
})

function createMatchMedia(matches = false) {
  return vi.fn().mockImplementation((query: string) => ({
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

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: createMatchMedia(),
})

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

vi.stubGlobal('fetch', vi.fn())

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.removeItem(THEME_STORAGE_KEY)
  window.__BLOG_CONFIG__ = {
    postsEndpoint: 'http://localhost:80/blog/posts',
  }
  resetPostsCache()
  vi.clearAllMocks()
  window.matchMedia = createMatchMedia()
  window.scrollTo = vi.fn()
})
