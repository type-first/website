/**
 * Main Sections Content
 * Content for each major area of the website
 */

import { createMainSection } from '@/lib/content/main.model'

export const sections = [
  createMainSection({
    slug: 'articles',
    name: 'Expert Articles',
    blurb: 'Deep-dive technical content exploring advanced TypeScript patterns and modern development practices.',
    description: 'Comprehensive guides and tutorials covering everything from basic TypeScript concepts to advanced patterns like phantom types, branded types, and complex generic manipulations. Each article includes real-world examples and practical applications.',
    tags: ['TypeScript', 'React', 'Patterns', 'Best Practices'],
    order: 1,
    iconName: 'BookOpen',
    href: '/articles',
    imageUrl: '/images/main/articles-preview.jpg',
    features: [
      'Advanced TypeScript patterns',
      'Real-world examples',
      'Step-by-step tutorials',
      'Production-ready code'
    ]
  }),

  createMainSection({
    slug: 'labs',
    name: 'Interactive Labs',
    blurb: 'Hands-on experiments and interactive tools to explore TypeScript concepts in real-time.',
    description: 'Interactive playground environments where you can experiment with TypeScript features, test advanced patterns, and see immediate results. Perfect for learning complex concepts through experimentation.',
    tags: ['Interactive', 'Playground', 'Experiments', 'Learning'],
    order: 2,
    iconName: 'Flask',
    href: '/labs',
    imageUrl: '/images/main/labs-preview.jpg',
    features: [
      'Live code execution',
      'Interactive tutorials',
      'Type exploration tools',
      'Real-time feedback'
    ]
  }),

  createMainSection({
    slug: 'docs',
    name: 'Documentation',
    blurb: 'Comprehensive documentation for our TypeScript utilities and advanced typing libraries.',
    description: 'Complete API references, getting started guides, and detailed documentation for all our open-source TypeScript utilities. Includes the Typist library for advanced type manipulations.',
    tags: ['Documentation', 'API', 'Reference', 'Typist'],
    order: 3,
    iconName: 'FileText',
    href: '/docs',
    imageUrl: '/images/main/docs-preview.jpg',
    features: [
      'Complete API reference',
      'Getting started guides',
      'Type utility documentation',
      'Migration guides'
    ]
  }),

  createMainSection({
    slug: 'community',
    name: 'Community Hub',
    blurb: 'Connect with other TypeScript enthusiasts, share knowledge, and collaborate on projects.',
    description: 'Join our growing community of TypeScript developers. Share your projects, ask questions, contribute to discussions, and collaborate on open-source initiatives focused on advancing type-safe development.',
    tags: ['Community', 'Discussion', 'Collaboration', 'Open Source'],
    order: 4,
    iconName: 'Users',
    href: '/community',
    imageUrl: '/images/main/community-preview.jpg',
    features: [
      'Discussion forums',
      'Project showcases',
      'Knowledge sharing',
      'Open source collaboration'
    ]
  })
] as const