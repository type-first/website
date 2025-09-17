/**
 * Type Explorer Lab - Content Definition
 * Interactive TypeScript type exploration and learning environment
 */

import { createLab } from '@/lib/content/lab.model';

export const typeExplorerLab = createLab({
  slug: 'type-explorer',
  name: 'Type Explorer Lab',
  blurb: 'Interactive TypeScript type system explorer for learning advanced type patterns, utility types, and complex type relationships through hands-on experimentation.',
  tags: ['TypeScript', 'Types', 'Interactive', 'Learning', 'Advanced', 'Type System'] as const,
  iconUrl: '/icons/type-lab.svg'
});
