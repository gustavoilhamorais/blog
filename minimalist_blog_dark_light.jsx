import React, { useEffect, useMemo, useState } from "react";
import { Moon, Sun, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "building-calm-software",
    title: "Building calm software",
    excerpt:
      "A few notes on making products that feel small, fast, and focused.",
    date: "Mar 7, 2026",
    readingTime: "4 min read",
    tag: "Product",
  },
  {
    slug: "notes-on-minimalism",
    title: "Notes on minimalism",
    excerpt:
      "Minimalism is less about removing features and more about preserving clarity.",
    date: "Mar 2, 2026",
    readingTime: "3 min read",
    tag: "Design",
  },
  {
    slug: "writing-for-the-web",
    title: "Writing for the web",
    excerpt:
      "Short paragraphs, strong structure, and enough whitespace to let ideas breathe.",
    date: "Feb 25, 2026",
    readingTime: "5 min read",
    tag: "Writing",
  },
];

function ThemeToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  const buttonClass =
    theme === "dark"
      ? "border-stone-700/80 bg-stone-800/80 text-stone-100 hover:bg-stone-800"
      : "border-rose-200/70 bg-rose-50/80 text-stone-700 hover:bg-rose-100/90";

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm shadow-sm transition ${buttonClass}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

function PostCard({
  theme,
  title,
  excerpt,
  date,
  readingTime,
  tag,
}: {
  theme: "light" | "dark";
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
}) {
  const cardClass =
    theme === "dark"
      ? "border-stone-700/70 bg-stone-900/88 hover:bg-stone-900 text-stone-50 shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
      : "border-rose-200/70 bg-white/70 hover:bg-white/85 text-stone-900 shadow-sm";

  const metaClass = theme === "dark" ? "text-stone-400" : "text-stone-500";
  const bodyClass = theme === "dark" ? "text-stone-300" : "text-stone-600";
  const ctaClass = theme === "dark" ? "text-stone-100" : "text-stone-800";
  const tagClass =
    theme === "dark"
      ? "border-stone-700/80 bg-stone-800/70 text-stone-200"
      : "border-rose-200/80 text-stone-700";

  return (
    <article className={`group rounded-3xl border p-6 backdrop-blur transition hover:-translate-y-0.5 ${cardClass}`}>
      <div className={`mb-4 flex items-center gap-3 text-xs ${metaClass}`}>
        <span>{date}</span>
        <span>•</span>
        <span>{readingTime}</span>
        <span>•</span>
        <span className={`rounded-full border px-2 py-0.5 ${tagClass}`}>{tag}</span>
      </div>

      <h2 className="text-xl font-semibold tracking-tight">
        {title}
      </h2>

      <p className={`mt-3 text-sm leading-7 ${bodyClass}`}>
        {excerpt}
      </p>

      <div className={`mt-5 inline-flex items-center gap-2 text-sm font-medium transition group-hover:gap-3 ${ctaClass}`}>
        <span>Read post</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </article>
  );
}

export default function MinimalistBlog() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("minimalist-blog-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = saved === "light" || saved === "dark" ? saved : systemDark ? "dark" : "light";
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("minimalist-blog-theme", theme);
  }, [theme]);

  const pageClass = useMemo(
    () =>
      theme === "dark"
        ? "bg-gradient-to-br from-stone-950 via-neutral-950 to-stone-900 text-stone-100"
        : "bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 text-stone-900",
    [theme]
  );

  const mutedText = theme === "dark" ? "text-stone-300" : "text-stone-500";
  const bodyText = theme === "dark" ? "text-stone-300" : "text-stone-600";
  const borderClass = theme === "dark" ? "border-stone-800" : "border-rose-200/70";
  const titleClass = theme === "dark" ? "text-stone-50" : "text-stone-900";

  return (
    <div className={`${pageClass} min-h-screen transition-colors duration-300`}>
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-8 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <a href="#" className={`text-sm font-semibold tracking-[0.2em] ${titleClass}`}>
            GUS BLOG
          </a>
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          />
        </header>

        <main className="flex-1 pt-20">
          <section className="max-w-2xl">
            <p className={`text-sm uppercase tracking-[0.25em] ${mutedText}`}>
              Essays on software, design, and work
            </p>
            <h1 className={`mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl ${titleClass}`}>
              Minimal writing, generous whitespace.
            </h1>
            <p className={`mt-6 max-w-xl text-base leading-8 ${bodyText}`}>
              A clean blog layout with just enough structure: a strong headline, readable cards, and a theme toggle that respects system preference.
            </p>
          </section>

          <section className="mt-14 grid gap-5">
            {posts.map((post) => (
              <PostCard key={post.slug} theme={theme} {...post} />
            ))}
          </section>
        </main>

        <footer className={`mt-16 border-t pt-6 text-sm ${borderClass} ${mutedText}`}>
          © 2026 Gus Blog
        </footer>
      </div>
    </div>
  );
}
