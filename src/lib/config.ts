export const BLOG_BASE_PATH = '/blog'
const DEFAULT_POSTS_ENDPOINT = 'http://localhost:80/blog/posts'

declare global {
  interface Window {
    __BLOG_CONFIG__?: {
      postsEndpoint?: string
    }
  }
}

function normalizePathSegment(value: string) {
  return value.replace(/\/+$/, '')
}

export function getBlogBaseName() {
  return normalizePathSegment(BLOG_BASE_PATH)
}

export function getPostsEndpoint() {
  const runtimeEndpoint = window.__BLOG_CONFIG__?.postsEndpoint?.trim()
  const viteEndpoint =
    typeof import.meta.env.VITE_BLOG_POSTS_ENDPOINT === 'string'
      ? import.meta.env.VITE_BLOG_POSTS_ENDPOINT.trim()
      : undefined

  return normalizePathSegment(
    runtimeEndpoint || viteEndpoint || DEFAULT_POSTS_ENDPOINT,
  )
}
