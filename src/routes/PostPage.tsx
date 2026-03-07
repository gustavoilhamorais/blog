import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { postsBySlug } from '../data/posts'
import {
  getPostMotionIds,
  pageTransition,
  type RouteMotionState,
} from '../lib/blogMotion'
import { useTheme } from '../theme-context'

export function PostPage() {
  const { slug } = useParams()
  const { theme } = useTheme()
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  const post = slug ? postsBySlug.get(slug) : null

  if (!post) {
    return <Navigate to="/" replace />
  }

  const routeState = location.state as RouteMotionState | null
  const shouldUseSharedLayout =
    !shouldReduceMotion && routeState?.fromPostCard === post.slug
  const motionIds = getPostMotionIds(post.slug)

  const mutedText = theme === 'dark' ? 'text-stone-300' : 'text-stone-500'
  const bodyText = theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
  const borderClass =
    theme === 'dark'
      ? 'border-stone-700/70 bg-stone-900/82 shadow-[0_30px_80px_rgba(0,0,0,0.32)]'
      : 'border-rose-200/70 bg-white/80 shadow-[0_30px_80px_rgba(224,120,68,0.12)]'
  const tagClass =
    theme === 'dark'
      ? 'border-stone-700/80 bg-stone-800/70 text-stone-200'
      : 'border-rose-200/80 text-stone-700'

  return (
    <motion.article
      initial={
        shouldUseSharedLayout || shouldReduceMotion
          ? false
          : { opacity: 0, y: 24 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
      className="mx-auto max-w-3xl pb-8"
    >
      <motion.div
        initial={
          shouldUseSharedLayout || shouldReduceMotion
            ? false
            : { opacity: 0, x: -18 }
        }
        animate={{ opacity: 1, x: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0.12 }
            : { ...pageTransition, delay: shouldUseSharedLayout ? 0 : 0.05 }
        }
      >
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-sm font-medium ${mutedText}`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all posts</span>
        </Link>
      </motion.div>

      <motion.section
        layoutId={shouldUseSharedLayout ? motionIds.card : undefined}
        transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
        initial={
          shouldUseSharedLayout || shouldReduceMotion
            ? false
            : { opacity: 0, y: 24, scale: 0.98 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`mt-8 rounded-[2.25rem] border p-8 backdrop-blur-xl sm:p-10 ${borderClass}`}
      >
        <motion.div
          layoutId={shouldUseSharedLayout ? motionIds.meta : undefined}
          transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
          className={`mb-5 flex flex-wrap items-center gap-3 text-xs ${mutedText}`}
        >
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
          <span>•</span>
          <span className={`rounded-full border px-2 py-0.5 ${tagClass}`}>
            {post.tag}
          </span>
        </motion.div>

        <motion.h1
          layoutId={shouldUseSharedLayout ? motionIds.title : undefined}
          transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
          className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
        >
          {post.title}
        </motion.h1>
        <motion.p
          layoutId={shouldUseSharedLayout ? motionIds.excerpt : undefined}
          transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
          className={`mt-6 max-w-2xl text-base leading-8 sm:text-lg ${bodyText}`}
        >
          {post.excerpt}
        </motion.p>
      </motion.section>

      <motion.section
        initial={
          shouldUseSharedLayout || shouldReduceMotion
            ? false
            : { opacity: 0, y: 30 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0.12 }
            : { ...pageTransition, delay: shouldUseSharedLayout ? 0.14 : 0.12 }
        }
        className="mt-10 space-y-6"
      >
        {post.content.map((paragraph, index) => (
          <motion.p
            key={`${post.slug}-${index}`}
            initial={
              shouldUseSharedLayout || shouldReduceMotion
                ? false
                : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.12 }
                : {
                    ...pageTransition,
                    delay: shouldUseSharedLayout
                      ? 0.18 + index * 0.05
                      : 0.16 + index * 0.05,
                  }
            }
            className={`text-base leading-8 ${bodyText}`}
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.section>
    </motion.article>
  )
}
