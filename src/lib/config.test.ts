import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPostsEndpoint } from './config'

describe('getPostsEndpoint', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    window.__BLOG_CONFIG__ = undefined
  })

  it('prefers runtime config over the Vite fallback', () => {
    window.__BLOG_CONFIG__ = {
      postsEndpoint: 'https://gustavoilhamorais.dev.br/blog/posts/',
    }

    expect(getPostsEndpoint()).toBe(
      'https://gustavoilhamorais.dev.br/blog/posts',
    )
  })

  it('uses the Vite fallback when runtime config is unavailable', () => {
    vi.stubEnv('VITE_BLOG_POSTS_ENDPOINT', 'https://preview.local/posts/')

    expect(getPostsEndpoint()).toBe('https://preview.local/posts')
  })

  it('falls back to the same-origin blog posts path by default', () => {
    expect(getPostsEndpoint()).toBe('/blog/posts')
  })
})
