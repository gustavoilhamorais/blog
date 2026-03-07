import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { fixturePosts } from '../test/post-fixtures'
import { ThemeProvider } from '../theme'
import { renderWithRouter } from '../test/render'
import { PostCard } from './PostCard'

describe('PostCard', () => {
  it('renders the post title, metadata, excerpt, and read link', () => {
    const post = fixturePosts[0]

    renderWithRouter(
      <ThemeProvider>
        <PostCard post={post} />
      </ThemeProvider>,
    )

    expect(screen.getByText(post.title)).toBeInTheDocument()
    expect(screen.getByText(post.date)).toBeInTheDocument()
    expect(screen.getByText(post.readingTime)).toBeInTheDocument()
    expect(screen.getByText(post.tag)).toBeInTheDocument()
    expect(screen.getByText(post.excerpt)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: `Read ${post.title}` }),
    ).toHaveAttribute('href', `/blog/posts/${post.slug}`)
  })
})
