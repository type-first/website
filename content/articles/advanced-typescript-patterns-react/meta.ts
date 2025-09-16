/**
 * Advanced TypeScript Patterns for React Applications - Article Metadata
 * Lightweight metadata for bundle optimization
 */

import { createArticle } from '@/lib/content'
import { typeFirstTeam } from '../../contributors/contributors'

export const article = createArticle({
  name: 'Advanced TypeScript Patterns for React Applications',
  slug: 'advanced-typescript-patterns-react',
  blurb: 'Master advanced TypeScript patterns to build type-safe, maintainable React applications with confidence.',
  tags: ['TypeScript', 'React', 'Advanced', 'Patterns', 'Type Safety'],
  author: typeFirstTeam,
  publishedTs: new Date('2024-03-15').getTime(),
  coverImgUrl: '/images/covers/advanced-typescript-patterns-react.png'
})
