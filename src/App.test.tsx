import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { posts } from './data/posts'
import { renderApp } from './test/render'

describe('App routes', () => {
  it('renders the home route with the hero and all posts', () => {
    renderApp(['/'])

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Minimal writing, generous whitespace.',
      }),
    ).toBeInTheDocument()

    for (const post of posts) {
      expect(screen.getByText(post.title)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: `Read ${post.title}` })).toHaveAttribute(
        'href',
        `/posts/${post.slug}`,
      )
    }
  })

  it('renders a post detail route for a known slug', () => {
    const post = posts[0]

    renderApp([`/posts/${post.slug}`])

    expect(
      screen.getByRole('heading', { level: 1, name: post.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(post.excerpt)).toBeInTheDocument()

    for (const paragraph of post.content) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })

  it('redirects an unknown post slug back to the home route', () => {
    renderApp(['/posts/not-a-real-post'])

    expect(
      screen.getByRole('heading', {
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

  it('navigates from a post card to the post detail route', async () => {
    const user = userEvent.setup()
    const post = posts[0]

    renderApp(['/'])

    await user.click(screen.getByRole('link', { name: `Read ${post.title}` }))

    expect(
      screen.getByRole('heading', { level: 1, name: post.title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Back to all posts' }),
    ).toBeInTheDocument()
  })

  it('returns home and scrolls to the top when the header title is clicked', async () => {
    const user = userEvent.setup()
    const post = posts[0]

    renderApp([`/posts/${post.slug}`])

    await user.click(screen.getByRole('button', { name: 'GUS BLOG' }))

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Minimal writing, generous whitespace.',
      }),
    ).toBeInTheDocument()
  })
})
