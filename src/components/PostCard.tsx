import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { type PostSummary } from '../lib/posts'
import {
  getPostMotionIds,
  pageTransition,
  type RouteMotionState,
} from '../lib/blogMotion'
import { useTheme } from '../theme-context'

export function PostCard({ post }: { post: PostSummary }) {
  const { theme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const motionIds = getPostMotionIds(post.slug)

  const cardClass =
    theme === 'dark'
      ? 'border-stone-700/70 bg-stone-900/88 text-stone-50 shadow-[0_10px_30px_rgba(0,0,0,0.24)] hover:bg-stone-900'
      : 'border-rose-200/70 bg-white/70 text-stone-900 shadow-sm hover:bg-white/85'

  const metaClass = theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
  const bodyClass = theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
  const ctaClass = theme === 'dark' ? 'text-stone-100' : 'text-stone-800'
  const tagClass =
    theme === 'dark'
      ? 'border-stone-700/80 bg-stone-800/70 text-stone-200'
      : 'border-rose-200/80 text-stone-700'

  return (
    <motion.article
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.12 }
          : { ...pageTransition, delay: 0.05 }
      }
      className="group"
    >
      <motion.div
        layoutId={motionIds.card}
        transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
        className={`rounded-[2rem] border p-6 backdrop-blur transition duration-300 hover:-translate-y-0.5 ${cardClass}`}
      >
        <motion.div
          layoutId={motionIds.meta}
          transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
          className={`mb-4 flex items-center gap-3 text-xs ${metaClass}`}
        >
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
          <span>•</span>
          <span className={`rounded-full border px-2 py-0.5 ${tagClass}`}>
            {post.tag}
          </span>
        </motion.div>

        <motion.h2
          layoutId={motionIds.title}
          transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
          className="text-xl font-semibold tracking-tight"
        >
          {post.title}
        </motion.h2>

        <motion.p
          layoutId={motionIds.excerpt}
          transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
          className={`mt-3 text-sm leading-7 ${bodyClass}`}
        >
          {post.excerpt}
        </motion.p>

        <Link
          to={`/posts/${post.slug}`}
          state={{ fromPostCard: post.slug } satisfies RouteMotionState}
          className={`mt-5 inline-flex items-center gap-2 text-sm font-medium transition group-hover:gap-3 ${ctaClass}`}
          aria-label={`Read ${post.title}`}
        >
          <span>Read post</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </motion.article>
  )
}
