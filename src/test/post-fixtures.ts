import type { PostSummary } from '../lib/posts'

export const fixturePosts: PostSummary[] = [
  {
    slug: 'building-calm-software',
    title: 'Building calm software',
    excerpt: 'A few notes on making products that feel small, fast, and focused.',
    date: '2026-03-07',
    readingTime: '4 min read',
    tag: 'Product',
  },
  {
    slug: 'notes-on-minimalism',
    title: 'Notes on minimalism',
    excerpt: 'Minimalism is less about removing features and more about preserving clarity.',
    date: '2026-03-02',
    readingTime: '3 min read',
    tag: 'Design',
  },
]

export const fixtureMarkdownBySlug: Record<string, string> = {
  'building-calm-software': `Thoughtful software feels quiet.

- It loads quickly
- It stays focused
`,
  'notes-on-minimalism': `Minimalism preserves clarity.
`,
}
