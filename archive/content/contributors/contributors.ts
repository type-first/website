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

export const santiagoElustondo = createContributor({
  slug: 'santiago-elustondo',
  name: 'Santiago Elustondo',
  blurb: 'Senior full-stack developer and search systems architect with expertise in TypeScript, React, and advanced search technologies including vector search and semantic AI.',
  tags: ['TypeScript', 'React', 'Search', 'Vector Search', 'AI', 'Architecture', 'Full-Stack'] as const,
  profileImgUrl: '/images/contributors/santiago-elustondo.jpg',
})

export const jameelKassam = createContributor({
  slug: 'jameel-kassam',
  name: 'Jameel Kassam',
  blurb: 'TypeScript expert and React consultant focused on advanced type patterns, developer experience, and building scalable type-safe applications.',
  tags: ['TypeScript', 'React', 'Type Patterns', 'DX', 'Consulting', 'Scalability'] as const,
  profileImgUrl: '/images/contributors/jameel-kassam.jpg',
})
