import { getPostsEndpoint } from './config'

export type PostSummary = {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tag: string
}

export type Post = PostSummary & {
  content: string
}

export class PostsHttpError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'PostsHttpError'
    this.status = status
  }
}

let cachedEndpoint: string | null = null
let manifestPromise: Promise<PostSummary[]> | null = null

function buildPostFileUrl(postsEndpoint: string, slug: string) {
  return `${postsEndpoint}/${encodeURIComponent(slug)}.md`
}

function readResponseOrThrow(response: Response, message: string) {
  if (!response.ok) {
    throw new PostsHttpError(message, response.status)
  }

  return response
}

export function resetPostsCache() {
  cachedEndpoint = null
  manifestPromise = null
}

export async function fetchPostManifest() {
  const postsEndpoint = getPostsEndpoint()

  if (!manifestPromise || cachedEndpoint !== postsEndpoint) {
    cachedEndpoint = postsEndpoint
    manifestPromise = fetch(`${postsEndpoint}/index.json`, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) =>
        readResponseOrThrow(response, 'Could not load the posts manifest.'),
      )
      .then((response) => response.json() as Promise<PostSummary[]>)
      .catch((error: unknown) => {
        manifestPromise = null
        throw error
      })
  }

  return manifestPromise
}

export async function fetchPostMarkdown(slug: string) {
  const response = await fetch(buildPostFileUrl(getPostsEndpoint(), slug), {
    headers: {
      Accept: 'text/markdown, text/plain;q=0.9, */*;q=0.8',
    },
  })

  readResponseOrThrow(response, 'Could not load the post body.')

  return response.text()
}
