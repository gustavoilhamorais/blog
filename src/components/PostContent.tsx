import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Theme } from '../theme-context'

type PostContentProps = {
  content: string
  theme: Theme
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean
  node?: unknown
}

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

function renderListItem(children: ReactNode) {
  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children) && children.length === 1) {
    return renderListItem(children[0])
  }

  return children
}

export function PostContent({ content, theme }: PostContentProps) {
  const borderClass = theme === 'dark' ? 'border-stone-700/80' : 'border-rose-200/90'
  const mutedTextClass = theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
  const emphasisTextClass = theme === 'dark' ? 'text-stone-50' : 'text-stone-900'
  const surfaceClass =
    theme === 'dark'
      ? 'bg-stone-900/88 text-stone-200'
      : 'bg-white/92 text-stone-700'
  const accentClass =
    theme === 'dark'
      ? 'text-amber-200 decoration-amber-200/40 hover:text-amber-100'
      : 'text-orange-700 decoration-orange-400/45 hover:text-orange-800'
  const inlineCodeClass =
    theme === 'dark'
      ? 'border-stone-700/80 bg-stone-800/90 text-stone-100'
      : 'border-rose-200/80 bg-rose-50/90 text-stone-800'
  const blockquoteClass =
    theme === 'dark'
      ? 'border-stone-600/90 bg-stone-900/75 text-stone-300'
      : 'border-orange-300/70 bg-orange-50/80 text-stone-600'
  const tableRowClass =
    theme === 'dark'
      ? 'border-stone-800/80 even:bg-stone-900/55'
      : 'border-rose-100/90 even:bg-rose-50/45'
  const components: Components = {
    h1: ({ children, ...props }) => (
      <h1
        {...props}
        className={joinClassNames(
          'mt-12 text-3xl font-semibold tracking-tight text-balance sm:text-4xl',
          emphasisTextClass,
        )}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        {...props}
        className={joinClassNames(
          'mt-12 text-2xl font-semibold tracking-tight sm:text-3xl',
          emphasisTextClass,
        )}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        className={joinClassNames('mt-10 text-xl font-semibold', emphasisTextClass)}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p {...props} className="mt-6 text-[1.02rem] leading-8">
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul
        {...props}
        className="mt-6 ml-6 list-disc space-y-3 marker:text-current"
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        {...props}
        className="mt-6 ml-6 list-decimal space-y-3 marker:text-current"
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li {...props} className="pl-2 leading-8">
        {renderListItem(children)}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        {...props}
        className={joinClassNames(
          'mt-8 border-l-[3px] px-5 py-1 text-lg leading-8 italic',
          blockquoteClass,
        )}
      >
        {children}
      </blockquote>
    ),
    a: ({ children, className, ...props }) => (
      <a
        {...props}
        className={joinClassNames(
          'font-medium underline decoration-2 underline-offset-4 transition-colors',
          accentClass,
          className,
        )}
      >
        {children}
      </a>
    ),
    hr: (props) => (
      <hr
        {...props}
        className={joinClassNames('mt-10 border-t', borderClass)}
      />
    ),
    code: ({ children, className, inline, ...props }: CodeProps) => {
      if (!inline && className?.includes('language-')) {
        return (
          <code {...props} className={joinClassNames('block text-sm leading-7', className)}>
            {children}
          </code>
        )
      }

      return (
        <code
          {...props}
          className={joinClassNames(
            'rounded-md border px-1.5 py-1 font-mono text-[0.92em]',
            inlineCodeClass,
            className,
          )}
        >
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }) => (
      <pre
        {...props}
        className={joinClassNames(
          'mt-8 overflow-x-auto rounded-[1.5rem] border px-5 py-4 font-mono text-sm leading-7 shadow-[0_18px_40px_rgba(15,23,42,0.08)]',
          borderClass,
          surfaceClass,
        )}
      >
        {children}
      </pre>
    ),
    img: ({ alt, ...props }) => (
      <img
        {...props}
        alt={alt ?? ''}
        className={joinClassNames(
          'mt-8 rounded-[1.75rem] border object-cover shadow-[0_20px_55px_rgba(15,23,42,0.12)]',
          borderClass,
        )}
      />
    ),
    table: ({ children, ...props }) => (
      <div className="mt-8 overflow-x-auto">
        <table
          {...props}
          className={joinClassNames(
            'min-w-full border-separate border-spacing-0 overflow-hidden rounded-[1.5rem] border text-left text-sm',
            borderClass,
          )}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead
        {...props}
        className={joinClassNames(
          mutedTextClass,
          theme === 'dark' ? 'bg-stone-900/90' : 'bg-rose-50/95',
        )}
      >
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => (
      <tr {...props} className={joinClassNames('border-b', tableRowClass)}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th
        {...props}
        className={joinClassNames(
          'px-4 py-3 font-semibold tracking-[0.08em] uppercase',
          mutedTextClass,
        )}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td {...props} className="px-4 py-3 align-top leading-7">
        {children}
      </td>
    ),
  }

  return (
    <div className={joinClassNames('max-w-none', theme === 'dark' ? 'text-stone-300' : 'text-stone-600')}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
