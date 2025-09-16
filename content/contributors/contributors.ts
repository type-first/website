/**
 * Contributors for the TypeScript Patterns article
 * Using the new lib/content system
 */

import { createContributor } from '@/lib/content/contributor.model'

export const typeFirstTeam = createContributor({
  slug: 'type-first-team',
  name: 'Type-First Team',
  blurb: 'A collective of TypeScript enthusiasts and React experts dedicated to advancing type-safe development practices.',
  tags: ['TypeScript', 'React', 'Type Safety', 'Best Practices', 'Architecture'] as const,
  profileImgUrl: '/images/contributors/type-first-team.jpg',
})

export const santiHerrera = createContributor({
  slug: 'santi-herrera',
  name: 'Santi Herrera',
  blurb: 'Fullstack developer and tech writer specializing in TypeScript, React, and modern web development.',
  tags: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Frontend', 'Backend'] as const,
  profileImgUrl: '/images/contributors/santi-herrera.jpg',
})
