export type RouteMotionState = {
  fromPostCard?: string
}

export const pageTransition = {
  duration: 0.58,
  ease: [0.22, 1, 0.36, 1] as const,
}

export function getPostMotionIds(slug: string) {
  return {
    card: `post-card-${slug}`,
    meta: `post-meta-${slug}`,
    title: `post-title-${slug}`,
    excerpt: `post-excerpt-${slug}`,
  }
}
