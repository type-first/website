/**
 * Typist Type Comparisons Scenario - Meta Definition
 * A scenario focused on type-level comparisons and verdicts system
 */

import { createScenario } from '@/lib/content/scenario.model';

export const typistTypeComparisonsScenario = createScenario({
  slug: 'typist-type-comparisons',
  name: 'Typist: Type Comparisons & Verdicts',
  blurb: 'Master type-level comparisons using $Equal, $Extends, and the verdict system. Learn to create compile-time assertions and type tests.',
  tags: ['Typist', 'TypeScript', 'Intermediate', 'Type Comparisons', 'Verdicts', 'Assertions'] as const,
  difficulty: 'intermediate',
  prerequisites: ['Understanding of TypeScript generics', 'Basic knowledge of conditional types', 'Familiarity with phantom types'] as const,
  learningGoals: [
    'Use $Equal<T1, T2> for exact type equality checks',
    'Apply $Extends<L, R> for assignability testing',
    'Understand the verdict system ($Yes/$No)',
    'Create compile-time assertions with yes_() and no_()',
    'Build type test suites using test_() patterns',
    'Debug type relationships using structured verdicts'
  ] as const
});