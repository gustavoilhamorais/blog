import { motion, useReducedMotion } from 'framer-motion'
import { PostCard } from '../components/PostCard'
import { posts } from '../data/posts'
import { pageTransition } from '../lib/blogMotion'
import { useTheme } from '../theme-context'

export function HomePage() {
  const { theme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const mutedText = theme === 'dark' ? 'text-stone-300' : 'text-stone-500'
  const bodyText = theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
  const titleClass = theme === 'dark' ? 'text-stone-50' : 'text-stone-900'

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
          readable cards, and a theme toggle that respects system preference.
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
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </motion.section>
    </motion.div>
  )
}
