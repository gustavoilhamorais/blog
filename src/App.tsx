import { useMemo } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { pageTransition } from './lib/blogMotion'
import { HomePage } from './routes/HomePage'
import { PostPage } from './routes/PostPage'
import { useTheme } from './theme-context'
import { ThemeProvider } from './theme'

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

export default function App() {
  return (
    <ThemeProvider>
      <BlogShell />
    </ThemeProvider>
  )
}
