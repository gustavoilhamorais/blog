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
  'building-calm-software': `# Thoughtful software feels quiet

Calmer products depend on deliberate structure, not only fewer features.

## Signals of calm

- It loads quickly
- It stays focused
- It gives each idea enough room

1. Remove distractions.
2. Shorten feedback loops.
3. Leave strong defaults in place.

> Software feels lighter when the interface explains itself.

Use \`small steps\` as the default way to ship.

\`\`\`ts
export function shipQuietly(scope: number) {
  return scope <= 3 ? 'ship now' : 'cut scope first'
}
\`\`\`

| Signal | Outcome |
| --- | --- |
| Fast startup | Lower anxiety |
| Clear hierarchy | Better comprehension |

Read more in [the field notes](https://example.com/field-notes).
`,
  'notes-on-minimalism': `# Minimalism preserves clarity

Minimalism is less about removing features and more about preserving meaning.
`,
}
