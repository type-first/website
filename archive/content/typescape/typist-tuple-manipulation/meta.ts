/**
 * Typist Tuple Manipulation Scenario - Meta Definition
 * Advanced tuple manipulation and type-level programming with typist
 */

import { createScenario } from '@/lib/content/scenario.model';

export const typistTupleManipulationScenario = createScenario({
  slug: 'typist-tuple-manipulation',
  name: 'Typist: Advanced Tuple Manipulation',
  blurb: 'Master advanced tuple operations and union manipulation. Build sophisticated type-level algorithms for splitting, joining, and transforming tuples.',
  tags: ['Typist', 'TypeScript', 'Advanced', 'Tuples', 'Union Types', 'Type-level Programming', 'Algorithms'] as const,
  difficulty: 'advanced',
  prerequisites: ['Advanced TypeScript knowledge', 'Understanding of conditional types', 'Experience with recursive types', 'Template literal types'] as const,
  learningGoals: [
    'Implement tuple splitting and joining algorithms',
    'Master union explosion and distribution patterns',
    'Build type-level arithmetic operations',
    'Create sophisticated tuple transformation utilities',
    'Understand overload distribution patterns',
    'Practice advanced recursive type patterns'
  ] as const
});