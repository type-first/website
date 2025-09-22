/**
 * Main Overview Content
 * Hero section content for the home page
 */

import { createMainOverview } from '@/lib/content/main.model'

export const mainOverview = createMainOverview({
  slug: 'hero',
  title: 'Type-First Development',
  subtitle: 'Where Types Meet Innovation',
  description: 'Explore cutting-edge TypeScript patterns, interactive experiments, and comprehensive guides that push the boundaries of type-safe development. Build better software with confidence through advanced typing techniques and real-world applications.',
  heroImageUrl: '/images/main/hero-typescript.jpg',
  callToAction: {
    text: 'Start Exploring',
    href: '/docs'
  }
})