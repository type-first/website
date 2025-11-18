/**
 * Typist Phantom Types Basics Scenario - Meta Definition
 * A beginner-friendly scenario introducing typist's phantom type system
 */

import { createScenario } from '@/lib/content/scenario.model';

export const typistPhantomTypesBasicsScenario = createScenario({
  slug: 'typist-phantom-types-basics',
  name: 'Typist: Phantom Types Basics',
  blurb: 'Learn the fundamentals of phantom types and type-level programming with typist. Discover how to create and work with phantom values.',
  tags: ['Typist', 'TypeScript', 'Beginner', 'Phantom Types', 'Type-level', 'Static Analysis'] as const,
  difficulty: 'beginner',
  prerequisites: ['Basic TypeScript knowledge', 'Understanding of types and interfaces'] as const,
  learningGoals: [
    'Understand what phantom types are and why they\'re useful',
    'Create phantom values using t_<T>() function',
    'Work with type-level values in TypeScript',
    'Use phantom types for nominal typing and brand types',
    'Build simple type-safe abstractions with phantom types'
  ] as const
});