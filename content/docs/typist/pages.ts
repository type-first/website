/**
 * Typist Documentation Pages
 * Page structure and navigation for typist library
 */

import { createDocPage, type DocPageMeta } from '@/lib/content/doc.model';

export const pages: DocPageMeta[] = [
  // Introduction - links back to typist home
  createDocPage({
    slug: 'introduction',
    title: 'Introduction',
    description: 'Typist overview and getting started guide',
    path: ['introduction'],
    order: 0,
    updatedTs: new Date('2024-11-24').getTime(),
    tags: ['introduction', 'overview']
  }),

  // Functional Groups - Core API Reference (these exist)
  createDocPage({
    slug: 'assertions',
    title: 'Assertions',
    description: 'Compile-time type assertion utilities for static validation, testing, and proof construction',
    path: ['assertions'],
    order: 1,
    updatedTs: new Date('2024-11-24').getTime(),
    tags: ['assertions', 'testing', 'functional-group']
  }),

  createDocPage({
    slug: 'comparators',
    title: 'Comparators',
    description: 'Type-level comparison utilities that resolve to verdicts - $Equal, $Extends for decidable type evaluations',
    path: ['comparators'],
    order: 2,
    updatedTs: new Date('2024-11-24').getTime(),
    tags: ['comparators', 'type-level', 'functional-group']
  }),

  createDocPage({
    slug: 'operators',
    title: 'Operators',
    description: 'Core phantom value operators and type manipulation utilities with zero runtime overhead',
    path: ['operators'],
    order: 3,
    updatedTs: new Date('2024-11-24').getTime(),
    tags: ['operators', 'phantom-types', 'functional-group']
  }),

  createDocPage({
    slug: 'verdicts',
    title: 'Verdicts',
    description: 'Boolean-like types ($Yes, $No) that represent the results of type-level computations and comparisons',
    path: ['verdicts'],
    order: 4,
    updatedTs: new Date('2024-11-24').getTime(),
    tags: ['verdicts', 'type-level', 'functional-group']
  }),

  createDocPage({
    slug: 'blocks',
    title: 'Blocks',
    description: 'Organizational utilities for structuring type tests and proof construction workflows',
    path: ['blocks'],
    order: 5,
    updatedTs: new Date('2024-11-24').getTime(),
    tags: ['blocks', 'organization', 'functional-group']
  }),

  // Core Concepts (these exist)
  createDocPage({
    slug: 'phantoms',
    title: 'Phantom Types',
    description: 'Create nominal types without runtime overhead using phantom type patterns',
    path: ['phantoms'],
    order: 6,
    updatedTs: new Date('2024-11-24').getTime(),
    tags: ['phantom-types', 'nominal-typing']
  }),

  // Guides (these exist)
  createDocPage({
    slug: 'guide',
    title: 'Interactive Guide',
    description: 'Comprehensive step-by-step guide to mastering typist through practical examples',
    path: ['guide'],
    order: 7,
    updatedTs: new Date('2024-11-24').getTime(),
    tags: ['tutorial', 'guide', 'examples']
  })
];