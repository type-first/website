/**
 * Typist Documentation Pages
 * Page structure and navigation for typist library
 */

import { createDocPage, type DocPageMeta } from '@/lib/content/doc.model';

export const pages: DocPageMeta[] = [
  createDocPage({
    slug: 'introduction',
    title: 'Introduction',
    description: 'Get started with typist - a type-level programming toolkit for TypeScript',
    path: ['introduction'],
    order: 1,
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['getting-started', 'overview']
  }),

  createDocPage({
    slug: 'installation',
    title: 'Installation',
    description: 'Install and set up typist in your TypeScript project',
    path: ['installation'],
    order: 2,
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['setup', 'npm']
  }),

  createDocPage({
    slug: 'quick-start',
    title: 'Quick Start',
    description: 'Jump into typist with practical examples and basic usage patterns',
    path: ['quick-start'],
    order: 3,
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['tutorial', 'examples']
  }),

  createDocPage({
    slug: 'phantom-types',
    title: 'Phantom Types',
    description: 'Create nominal types without runtime overhead using phantom type patterns',
    path: ['core-concepts', 'phantom-types'],
    order: 4,
    parentSlug: 'core-concepts',
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['phantom-types', 'nominal-typing']
  }),

  createDocPage({
    slug: 'verdicts',
    title: 'Verdict System',
    description: 'Compile-time validation and error reporting through TypeScript\'s type system',
    path: ['core-concepts', 'verdicts'],
    order: 5,
    parentSlug: 'core-concepts',
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['verdicts', 'validation']
  }),

  createDocPage({
    slug: 'operators',
    title: 'Type Operators',
    description: 'Utility operators for type-level comparisons and transformations',
    path: ['core-concepts', 'operators'],
    order: 6,
    parentSlug: 'core-concepts',
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['operators', 'comparisons']
  }),

  createDocPage({
    slug: 'assertions',
    title: 'Type Assertions',
    description: 'Static assertions for compile-time type validation and testing',
    path: ['core-concepts', 'assertions'],
    order: 7,
    parentSlug: 'core-concepts',
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['assertions', 'testing']
  }),

  createDocPage({
    slug: 'advanced-patterns',
    title: 'Advanced Patterns',
    description: 'Complex type-level programming patterns and real-world applications',
    path: ['advanced', 'patterns'],
    order: 8,
    parentSlug: 'advanced',
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['advanced', 'patterns', 'examples']
  }),

  createDocPage({
    slug: 'best-practices',
    title: 'Best Practices',
    description: 'Guidelines and recommendations for effective type-level programming',
    path: ['advanced', 'best-practices'],
    order: 9,
    parentSlug: 'advanced',
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['best-practices', 'guidelines']
  }),

  createDocPage({
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions when working with typist',
    path: ['troubleshooting'],
    order: 10,
    updatedTs: new Date('2024-09-19').getTime(),
    tags: ['troubleshooting', 'faq']
  })
];