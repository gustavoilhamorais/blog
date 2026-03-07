export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tag: string
  content: string[]
}

export const posts: Post[] = [
  {
    slug: 'building-calm-software',
    title: 'Building calm software',
    excerpt:
      'A few notes on making products that feel small, fast, and focused.',
    date: 'Mar 7, 2026',
    readingTime: '4 min read',
    tag: 'Product',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel augue a velit efficitur viverra. Nulla facilisi. Curabitur placerat, tellus non efficitur vulputate, lectus augue ultricies sem, nec convallis sem lacus a lorem.',
      'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc dapibus risus non mauris malesuada, sed maximus magna malesuada. Integer consequat semper turpis, vitae suscipit massa sodales vel.',
      'Sed id dui ut arcu luctus suscipit. Cras sed lorem sit amet lorem interdum accumsan. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse feugiat sapien eu lectus luctus, ut commodo nisl feugiat.',
      'Donec interdum erat ut tortor volutpat, vitae vulputate nibh posuere. Praesent dignissim urna id ex eleifend, quis tincidunt odio accumsan. Nam gravida sem vel felis tincidunt, ac vestibulum lacus tristique.',
    ],
  },
  {
    slug: 'notes-on-minimalism',
    title: 'Notes on minimalism',
    excerpt:
      'Minimalism is less about removing features and more about preserving clarity.',
    date: 'Mar 2, 2026',
    readingTime: '3 min read',
    tag: 'Design',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque egestas sapien non lorem feugiat, id hendrerit justo iaculis. Vivamus finibus, tortor non faucibus consectetur, lorem turpis feugiat dolor, a tristique mauris mauris ut nibh.',
      'Aliquam erat volutpat. In hac habitasse platea dictumst. Morbi laoreet hendrerit enim, ac feugiat turpis tincidunt quis. Donec dignissim, est et interdum blandit, orci sapien posuere tortor, sed dignissim magna urna vitae libero.',
      'Nunc tempus urna at sem volutpat, vitae semper mauris pulvinar. Nulla finibus purus sit amet ipsum finibus, vitae pellentesque est venenatis. Integer sed bibendum turpis. Donec posuere dui at augue convallis, ac suscipit justo tincidunt.',
      'Aenean efficitur magna sed semper condimentum. Curabitur volutpat tellus a felis molestie, id interdum nisl bibendum. Duis et risus sit amet augue faucibus tincidunt at ac urna.',
    ],
  },
  {
    slug: 'writing-for-the-web',
    title: 'Writing for the web',
    excerpt:
      'Short paragraphs, strong structure, and enough whitespace to let ideas breathe.',
    date: 'Feb 25, 2026',
    readingTime: '5 min read',
    tag: 'Writing',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non nisl feugiat, viverra mi ac, volutpat neque. Sed faucibus, nibh in placerat feugiat, turpis lectus elementum sapien, vel elementum libero nisl sed purus.',
      'Morbi non nibh eu neque luctus pellentesque. Nam egestas nulla nec luctus aliquam. Duis at suscipit dui. Integer tincidunt vulputate nisl, ut volutpat risus tempus quis. Integer vel lacus sed elit pellentesque vulputate.',
      'Suspendisse potenti. Curabitur posuere felis at lacus volutpat, at tristique lorem sodales. Phasellus congue sem eros, in pharetra tellus laoreet nec. Pellentesque id varius metus.',
      'Etiam sagittis, dolor id luctus convallis, est erat iaculis odio, vel volutpat nibh libero et justo. Sed scelerisque placerat justo, vitae varius nibh dignissim in. Nam ut sollicitudin urna.',
    ],
  },
]

export const postsBySlug = new Map(posts.map((post) => [post.slug, post]))
