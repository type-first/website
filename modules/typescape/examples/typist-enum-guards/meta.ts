import { scenario } from '@/modules/typescape/model.iso';

export const typistEnumGuardsScenario = scenario({
  slug: 'typist-enum-guards',
  name: 'Typist: Enum & Runtime Guards',
  blurb: 'Master enum patterns, runtime type guards, and integration between compile-time type checking and runtime validation.',
  tags: ['Typist', 'TypeScript', 'Enums', 'Runtime Guards', 'Type Validation', 'Intermediate'] as const,
  difficulty: 'intermediate',
  explanation: 'Build custom Enum classes with runtime validation'
});

export default typistEnumGuardsScenario