import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { ArrowLeft, ArrowRight, Moon, Sun } from 'lucide-react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { posts, postsBySlug, type Post } from './data/posts'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

type RouteMotionState = {
  fromPostCard?: string
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const pageTransition = {
  duration: 0.58,
  ease: [0.22, 1, 0.36, 1] as const,
}

function getPostMotionIds(slug: string) {
  return {
    card: `post-card-${slug}`,
    meta: `post-meta-${slug}`,
    title: `post-title-${slug}`,
    excerpt: `post-excerpt-${slug}`,
  }
}

function useTheme() {
  const value = useContext(ThemeContext)

  if (!value) {
    throw new Error('Theme context is missing.')
  }

  return value
}

function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const saved = window.localStorage.getItem('minimalist-blog-theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    return saved === 'light' || saved === 'dark'
      ? saved
      : systemDark
        ? 'dark'
        : 'light'
  })

  useEffect(() => {
    window.localStorage.setItem('minimalist-blog-theme', theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((previousTheme) =>
          previousTheme === 'dark' ? 'light' : 'dark',
        )
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const buttonClass =
    theme === 'dark'
      ? 'border-stone-700/80 bg-stone-800/80 text-stone-100 hover:bg-stone-800'
      : 'border-rose-200/70 bg-rose-50/80 text-stone-700 hover:bg-rose-100/90'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm shadow-sm transition ${buttonClass}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

function BlogShell() {
  const { theme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const pageClass = useMemo(
    () =>
      theme === 'dark'
        ? 'bg-gradient-to-br from-stone-950 via-neutral-950 to-stone-900 text-stone-100'
        : 'bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 text-stone-900',
    [theme],
  )

  const mutedText = theme === 'dark' ? 'text-stone-300' : 'text-stone-500'
  const borderClass =
    theme === 'dark' ? 'border-stone-800' : 'border-rose-200/70'
  const titleClass = theme === 'dark' ? 'text-stone-50' : 'text-stone-900'

  return (
    <div
      className={`${pageClass} min-h-screen transition-colors duration-300`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              window.scrollTo(0, 0)
              void navigate('/')
            }}
            className={`text-sm font-semibold tracking-[0.2em] ${titleClass}`}
          >
            GUS BLOG
          </button>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-x-clip pt-16 sm:pt-20">
          <LayoutGroup id="blog-post-transition">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={location.pathname}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20, filter: 'blur(10px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -14, filter: 'blur(8px)' }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.18 }
                    : pageTransition
                }
              >
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/posts/:slug" element={<PostPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </LayoutGroup>
        </main>

        <footer
          className={`mt-16 border-t pt-6 text-sm ${borderClass} ${mutedText}`}
        >
          © 2026 Gus Blog
        </footer>
      </div>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
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

function HomePage() {
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

function PostPage() {
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

export default function App() {
  return (
    <ThemeProvider>
      <BlogShell />
    </ThemeProvider>
  )
}
