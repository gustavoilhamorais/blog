import { describe, expect, it } from 'vitest'
import { getPostsEndpoint } from './config'

describe('getPostsEndpoint', () => {
  it('prefers runtime config over the Vite fallback', () => {
    window.__BLOG_CONFIG__ = {
      postsEndpoint: 'https://gustavoilhamorais.dev.br/blog/posts/',
    }

    expect(getPostsEndpoint()).toBe(
      'https://gustavoilhamorais.dev.br/blog/posts',
    )
  })
})
