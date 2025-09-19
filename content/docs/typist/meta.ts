/**
 * Typist Documentation Library - Metadata
 * Comprehensive documentation for the type-level toolkit
 */

import { createDocLibrary } from '@/lib/content/doc.model';
import { typeFirstTeam } from '../../contributors/contributors';

export const library = createDocLibrary({
  name: 'Typist',
  slug: 'typist',
  blurb: 'A minimal, compositional, and debug-friendly suite of type-level utilities for TypeScript.',
  description: 'Master type-level programming with typist - a powerful toolkit for static analysis, symbolic testing, and phantom type operations. Build type-safe applications with confidence using composable constraints and static proofs.',
  tags: ['TypeScript', 'type-level', 'utilities', 'phantom-types', 'static-analysis', 'testing'],
  author: typeFirstTeam,
  createdTs: new Date('2024-09-19').getTime(),
  updatedTs: new Date('2024-09-19').getTime(),
  coverImgUrl: '/images/docs/typist-cover.png',
  githubUrl: 'https://github.com/type-first/typist',
  npmPackage: '@type-first/typist',
  version: '1.0.0',
  pages: [
    {
      slug: 'introduction',
      title: 'Introduction',
      description: 'Welcome to typist! Learn what makes this type-level toolkit special.',
      path: ['introduction'],
      order: 1,
      updatedTs: new Date('2024-09-19').getTime(),
    },
    {
      slug: 'installation',
      title: 'Installation',
      description: 'Get started by installing and setting up typist in your project.',
      path: ['installation'],
      order: 2,
      updatedTs: new Date('2024-09-19').getTime(),
    },
    {
      slug: 'quick-start',
      title: 'Quick Start',
      description: 'Jump right in with practical examples and common patterns.',
      path: ['quick-start'],
      order: 3,
      updatedTs: new Date('2024-09-19').getTime(),
    },
    {
      slug: 'core-concepts',
      title: 'Core Concepts',
      description: 'Essential concepts for understanding typist\'s approach to type-level programming.',
      path: ['concepts'],
      order: 4,
      updatedTs: new Date('2024-09-19').getTime(),
      children: [
        {
          slug: 'phantom-types',
          title: 'Phantom Types',
          description: 'Understanding phantom values and type-as-value programming.',
          path: ['concepts', 'phantom-types'],
          order: 1,
          parentSlug: 'core-concepts',
          updatedTs: new Date('2024-09-19').getTime(),
        },
        {
          slug: 'verdicts',
          title: 'Verdicts',
          description: 'Symbolic markers for encoding type comparison results.',
          path: ['concepts', 'verdicts'],
          order: 2,
          parentSlug: 'core-concepts',
          updatedTs: new Date('2024-09-19').getTime(),
        },
        {
          slug: 'assertions',
          title: 'Assertions',
          description: 'Static type assertions for testing and validation.',
          path: ['concepts', 'assertions'],
          order: 3,
          parentSlug: 'core-concepts',
          updatedTs: new Date('2024-09-19').getTime(),
        }
      ]
    },
    {
      slug: 'api-reference',
      title: 'API Reference',
      description: 'Complete API documentation for all typist modules.',
      path: ['api'],
      order: 5,
      updatedTs: new Date('2024-09-19').getTime(),
      children: [
        {
          slug: 'operators',
          title: 'Operators',
          description: 'Core operators for type manipulation and phantom value creation.',
          path: ['api', 'operators'],
          order: 1,
          parentSlug: 'api-reference',
          updatedTs: new Date('2024-09-19').getTime(),
        },
        {
          slug: 'verdicts',
          title: 'Verdicts',
          description: 'Verdict types and their symbolic representation.',
          path: ['api', 'verdicts'],
          order: 2,
          parentSlug: 'api-reference',
          updatedTs: new Date('2024-09-19').getTime(),
        },
        {
          slug: 'comparators',
          title: 'Comparators',
          description: 'Type-level comparison utilities for structural analysis.',
          path: ['api', 'comparators'],
          order: 3,
          parentSlug: 'api-reference',
          updatedTs: new Date('2024-09-19').getTime(),
        },
        {
          slug: 'assertions',
          title: 'Assertions',
          description: 'Runtime stubs for static type assertions and testing.',
          path: ['api', 'assertions'],
          order: 4,
          parentSlug: 'api-reference',
          updatedTs: new Date('2024-09-19').getTime(),
        },
        {
          slug: 'patterns',
          title: 'Patterns',
          description: 'Test patterns and symbolic evaluation frameworks.',
          path: ['api', 'patterns'],
          order: 5,
          parentSlug: 'api-reference',
          updatedTs: new Date('2024-09-19').getTime(),
        }
      ]
    },
    {
      slug: 'examples',
      title: 'Examples',
      description: 'Real-world examples and advanced patterns.',
      path: ['examples'],
      order: 6,
      updatedTs: new Date('2024-09-19').getTime(),
      children: [
        {
          slug: 'basic-usage',
          title: 'Basic Usage',
          description: 'Simple examples to get you started.',
          path: ['examples', 'basic-usage'],
          order: 1,
          parentSlug: 'examples',
          updatedTs: new Date('2024-09-19').getTime(),
        },
        {
          slug: 'type-testing',
          title: 'Type Testing',
          description: 'Building robust type-level test suites.',
          path: ['examples', 'type-testing'],
          order: 2,
          parentSlug: 'examples',
          updatedTs: new Date('2024-09-19').getTime(),
        },
        {
          slug: 'advanced-patterns',
          title: 'Advanced Patterns',
          description: 'Complex type-level programming techniques.',
          path: ['examples', 'advanced-patterns'],
          order: 3,
          parentSlug: 'examples',
          updatedTs: new Date('2024-09-19').getTime(),
        }
      ]
    },
    {
      slug: 'migration-guide',
      title: 'Migration Guide',
      description: 'Upgrading from previous versions and integrating with existing codebases.',
      path: ['migration'],
      order: 7,
      updatedTs: new Date('2024-09-19').getTime(),
    },
    {
      slug: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and solutions when working with typist.',
      path: ['troubleshooting'],
      order: 8,
      updatedTs: new Date('2024-09-19').getTime(),
    }
  ]
});