/**
 * Getting Started Documentation Library - Metadata
 * Essential guides for new users
 */

import { createDocLibrary } from '@/lib/content/doc.model';
import { typeFirstTeam } from '../../contributors/contributors';

export const library = createDocLibrary({
  name: 'Getting Started',
  slug: 'getting-started',
  blurb: 'Essential guides to help you get started quickly and effectively.',
  description: 'Comprehensive getting started guides covering installation, basic concepts, and your first steps. Perfect for developers new to our platform.',
  tags: ['beginner', 'tutorial', 'setup', 'guide'],
  author: typeFirstTeam,
  createdTs: new Date('2024-01-15').getTime(),
  updatedTs: new Date('2024-09-15').getTime(),
  coverImgUrl: '/images/docs/getting-started-cover.png',
  githubUrl: 'https://github.com/type-first/getting-started',
  version: '1.2.0',
  pages: [
    {
      slug: 'introduction',
      title: 'Introduction',
      description: 'Welcome to our platform! Learn what makes us special.',
      path: ['introduction'],
      order: 1,
      updatedTs: new Date('2024-09-10').getTime(),
    },
    {
      slug: 'installation',
      title: 'Installation',
      description: 'Step-by-step installation guide for all platforms.',
      path: ['installation'],
      order: 2,
      updatedTs: new Date('2024-09-12').getTime(),
    },
    {
      slug: 'quick-start',
      title: 'Quick Start',
      description: 'Get up and running in 5 minutes with our quick start guide.',
      path: ['quick-start'],
      order: 3,
      updatedTs: new Date('2024-09-15').getTime(),
    },
    {
      slug: 'basic-concepts',
      title: 'Basic Concepts',
      description: 'Core concepts you need to understand.',
      path: ['concepts'],
      order: 4,
      updatedTs: new Date('2024-09-08').getTime(),
      children: [
        {
          slug: 'type-system',
          title: 'Type System',
          description: 'Understanding our powerful type system.',
          path: ['concepts', 'type-system'],
          order: 1,
          parentSlug: 'basic-concepts',
          updatedTs: new Date('2024-09-08').getTime(),
        },
        {
          slug: 'components',
          title: 'Components',
          description: 'How to work with components effectively.',
          path: ['concepts', 'components'],
          order: 2,
          parentSlug: 'basic-concepts',
          updatedTs: new Date('2024-09-08').getTime(),
        }
      ]
    },
    {
      slug: 'examples',
      title: 'Examples',
      description: 'Real-world examples and use cases.',
      path: ['examples'],
      order: 5,
      updatedTs: new Date('2024-09-05').getTime(),
    },
    {
      slug: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and how to solve them.',
      path: ['troubleshooting'],
      order: 6,
      updatedTs: new Date('2024-09-01').getTime(),
    }
  ]
});