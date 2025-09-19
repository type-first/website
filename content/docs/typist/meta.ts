/**
 * Typist Documentation Library - Metadata
 * Lightweight metadata for bundle optimization
 */

import { createDocLibrary } from '@/lib/content/doc.model';
import { typeFirstTeam } from '../../contributors/contributors';
import { pages } from './pages';

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
  pages // Pages defined in pages.ts
});