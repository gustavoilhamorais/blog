import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { PostContent } from '../components/PostContent'
import {
  getPostMotionIds,
  pageTransition,
  type RouteMotionState,
} from '../lib/blogMotion'
import {
  fetchPostManifest,
  fetchPostMarkdown,
  PostsHttpError,
  type Post,
} from '../lib/posts'
import { useTheme } from '../theme-context'

export function PostPage() {
  const { slug } = useParams()
  const { theme } = useTheme()
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()
  const [post, setPost] = useState<Post | null>(null)
  const [status, setStatus] = useState<
    'loading' | 'ready' | 'missing' | 'error'
  >('loading')

  useEffect(() => {
    let isActive = true

    if (!slug) {
      return () => {
        isActive = false
      }
    }

    void fetchPostManifest()
      .then(async (posts) => {
        const matchingPost = posts.find((entry) => entry.slug === slug)

        if (!matchingPost) {
          if (isActive) {
            setStatus('missing')
          }
          return
        }

        const content = await fetchPostMarkdown(slug)

        if (!isActive) {
          return
        }

        setPost({
          ...matchingPost,
          content,
        })
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return
        }

        if (error instanceof PostsHttpError && error.status === 404) {
          setStatus('error')
          return
        }

        setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [slug])

  if (!slug || status === 'missing') {
    return <Navigate to="/" replace />
  }

  if (status === 'error') {
    return (
      <motion.article
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
        className="mx-auto max-w-3xl pb-8"
      >
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-sm font-medium ${
            theme === 'dark' ? 'text-stone-300' : 'text-stone-500'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all posts</span>
        </Link>
        <div
          className={`mt-8 rounded-[2rem] border p-6 ${
            theme === 'dark'
              ? 'border-stone-700/70 bg-stone-900/82 shadow-[0_30px_80px_rgba(0,0,0,0.32)]'
              : 'border-rose-200/70 bg-white/80 shadow-[0_30px_80px_rgba(224,120,68,0.12)]'
          }`}
        >
          <p className={theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}>
            This post could not be loaded right now.
          </p>
          <p
            className={`mt-2 text-sm ${
              theme === 'dark' ? 'text-stone-300' : 'text-stone-500'
            }`}
          >
            Verify the Markdown file exists at the configured posts endpoint.
          </p>
        </div>
      </motion.article>
    )
  }

  if (status === 'loading' || !post) {
    return (
      <motion.article
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0.12 } : pageTransition}
        className="mx-auto max-w-3xl pb-8"
      >
        <p className={theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}>
          Loading post...
        </p>
      </motion.article>
    )
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
        <PostContent content={post.content} theme={theme} />
      </motion.section>
    </motion.article>
  )
}
