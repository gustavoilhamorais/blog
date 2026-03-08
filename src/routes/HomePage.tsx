import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PostCard } from '../components/PostCard'
import { pageTransition } from '../lib/blogMotion'
import { fetchPostManifest, type PostSummary } from '../lib/posts'
import { useTheme } from '../theme-context'

export function HomePage() {
  const { theme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const mutedText = theme === 'dark' ? 'text-stone-300' : 'text-stone-500'
  const bodyText = theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
  const titleClass = theme === 'dark' ? 'text-stone-50' : 'text-stone-900'
  const panelClass =
    theme === 'dark'
      ? 'border-stone-700/70 bg-stone-900/80 text-stone-200'
      : 'border-rose-200/80 bg-white/80 text-stone-600'

  useEffect(() => {
    let isActive = true

    void fetchPostManifest()
      .then((nextPosts) => {
        if (!isActive) {
          return
        }

        setPosts(nextPosts)
        setStatus('ready')
      })
      .catch(() => {
        if (!isActive) {
          return
        }

        setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [])

  return (
    <motion.div
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : 0.08,
            delayChildren: shouldReduceMotion ? 0 : 0.04,
          },
        },
      }}
    >
      <motion.section
        variants={{
          hidden: { opacity: 0, y: 18 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={shouldReduceMotion ? { duration: 0.1 } : pageTransition}
        className="max-w-2xl"
      >
        <p className={`text-sm uppercase tracking-[0.25em] ${mutedText}`}>
          Essays on software, design, and work
        </p>
        <h1
          className={`mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl ${titleClass}`}
        >
          Minimal writing, generous whitespace.
        </h1>
        <p className={`mt-6 max-w-xl text-base leading-8 ${bodyText}`}>
          A clean blog layout with just enough structure: a strong headline,
          readable cards, and a theme menu that can follow the system or force
          light and dark modes.
        </p>
      </motion.section>

      <motion.section
        variants={{
          hidden: { opacity: 0, y: 18 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={shouldReduceMotion ? { duration: 0.1 } : pageTransition}
        className="mt-14 grid gap-5"
      >
        {status === 'loading' && (
          <div className={`rounded-[2rem] border p-6 ${panelClass}`}>
            Loading posts from Markdown...
          </div>
        )}

        {status === 'error' && (
          <div className={`rounded-[2rem] border p-6 ${panelClass}`}>
            <p>Posts are unavailable right now.</p>
            <p className="mt-2 text-sm">Check the posts volume and manifest.</p>
          </div>
        )}

        {status === 'ready' &&
          posts.map((post) => <PostCard key={post.slug} post={post} />)}
      </motion.section>
    </motion.div>
  )
}
