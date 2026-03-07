import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fixtureMarkdownBySlug, fixturePosts } from './test/post-fixtures'
import { renderApp } from './test/render'

function getRequestUrl(input: RequestInfo | URL) {
  if (typeof input === 'string') {
    return input
  }

  if (input instanceof URL) {
    return input.toString()
  }

  return input.url
}

function mockPostsFetches() {
  vi.mocked(fetch).mockImplementation((input) => {
    const url = getRequestUrl(input)

    if (url.endsWith('/index.json')) {
      return Promise.resolve(
        new Response(JSON.stringify(fixturePosts), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      )
    }

    const slug = url.match(/\/([^/]+)\.md$/)?.[1]

    if (slug && fixtureMarkdownBySlug[slug]) {
      return Promise.resolve(
        new Response(fixtureMarkdownBySlug[slug], {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown',
          },
        }),
      )
    }

    return Promise.resolve(new Response('not found', { status: 404 }))
  })
}

describe('App routes', () => {
  beforeEach(() => {
    mockPostsFetches()
  })

  it('renders the home route with the hero and all posts', () => {
    renderApp(['/'])

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Minimal writing, generous whitespace.',
      }),
    ).toBeInTheDocument()
  })

  it('loads post cards from the Markdown manifest', async () => {
    renderApp(['/'])

    for (const post of fixturePosts) {
      expect(await screen.findByText(post.title)).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: `Read ${post.title}` }),
      ).toHaveAttribute('href', `/blog/posts/${post.slug}`)
    }
  })

  it('renders a post detail route for a known slug', async () => {
    const post = fixturePosts[0]

    renderApp([`/posts/${post.slug}`])

    expect(
      await screen.findByRole('heading', { level: 1, name: post.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(post.excerpt)).toBeInTheDocument()
    expect(
      screen.getByText('Thoughtful software feels quiet.'),
    ).toBeInTheDocument()
    expect(screen.getByText('It stays focused')).toBeInTheDocument()
  })

  it('redirects an unknown post slug back to the home route', async () => {
    renderApp(['/posts/not-a-real-post'])

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Minimal writing, generous whitespace.',
      }),
    ).toBeInTheDocument()
  })

  it('redirects an unknown route back to the home route', () => {
    renderApp(['/missing'])

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Minimal writing, generous whitespace.',
      }),
    ).toBeInTheDocument()
  })

  it('shows an error state when the manifest cannot be loaded', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('broken', { status: 500 }),
    )

    renderApp(['/'])

    expect(
      await screen.findByText('Posts are unavailable right now.'),
    ).toBeInTheDocument()
  })

  it('navigates from a post card to the post detail route', async () => {
    const user = userEvent.setup()
    const post = fixturePosts[0]

    renderApp(['/'])

    await user.click(
      await screen.findByRole('link', { name: `Read ${post.title}` }),
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: post.title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Back to all posts' }),
    ).toBeInTheDocument()
  })

  it('returns home and scrolls to the top when the header title is clicked', async () => {
    const user = userEvent.setup()
    const post = fixturePosts[0]

    renderApp([`/posts/${post.slug}`])

    await screen.findByRole('heading', { level: 1, name: post.title })

    await user.click(screen.getByRole('button', { name: 'GUS BLOG' }))

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Minimal writing, generous whitespace.',
      }),
    ).toBeInTheDocument()
  })

  it('shows an error state when a Markdown file is missing', async () => {
    vi.mocked(fetch).mockImplementation((input) => {
      const url = getRequestUrl(input)

      if (url.endsWith('/index.json')) {
        return Promise.resolve(
          new Response(JSON.stringify(fixturePosts), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        )
      }

      return Promise.resolve(new Response('not found', { status: 404 }))
    })

    renderApp([`/posts/${fixturePosts[0].slug}`])

    expect(
      await screen.findByText('This post could not be loaded right now.'),
    ).toBeInTheDocument()
  })
})
