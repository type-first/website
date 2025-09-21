/**
 * Typist Advanced Patterns Scenario - Meta Definition
 * A advanced scenario showcasing complex type-level programming patterns with typist
 */

import { createScenario } from '@/lib/content/scenario.model';

export const typistAdvancedPatternsScenario = createScenario({
  slug: 'typist-advanced-patterns',
  name: 'Typist: Advanced Type-Level Patterns',
  blurb: 'Explore advanced type-level programming patterns with typist. Build complex type computations, state machines, and compile-time proofs.',
  tags: ['Typist', 'TypeScript', 'Advanced', 'Type-level Programming', 'State Machines', 'Proofs'] as const,
  difficulty: 'advanced',
  prerequisites: ['Advanced TypeScript knowledge', 'Understanding of conditional types', 'Experience with mapped types and template literals'] as const,
  learningGoals: [
    'Build complex type-level computations and algorithms',
    'Create type-safe state machines with phantom types',
    'Implement compile-time proofs and verification',
    'Use recursive types for complex data transformations',
    'Design type-level DSLs and query builders',
    'Master advanced phantom type patterns'
  ] as const
});