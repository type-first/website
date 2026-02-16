import { scenario } from '@/modules/typescapes/model.iso'

export default scenario
 ({ slug: 'enum-guards',
    name: 'Enum & Runtime Guards',
    blurb: 'Master enum patterns, runtime type guards, and integration between compile-time type checking and runtime validation.',
    tags: ['Typist', 'TypeScript', 'Enums', 'Runtime Guards', 'Type Validation', 'Intermediate'] as const,
    difficulty: 'intermediate',
    explanation: 'Build custom Enum classes with runtime validation',
    files: 
      [ { alias:'main.ts', 
          path:'@/content/typescapes/enum-guards/main.ts' },
        { alias:'typist.lib.ts', 
          path:'@/content/typescapes/enum-guards/typist.lib.ts' } ] })
