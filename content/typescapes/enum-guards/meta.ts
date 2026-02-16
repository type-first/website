import { scenario } from '@/modules/typescapes/model.iso'

export default scenario
 ({ slug: 'enum-guards',
    name: 'enum & runtime guards',
    blurb: 'enum patterns, runtime type guards, and integration between compile-time type checking and runtime validation.',
    tags: ['typist', 'enums', 'guards'] as const,
    difficulty: 'intermediate',
    explanation: 'custom enum constructor with static and runtime validation',
    files: 
      [ { alias:'main.ts', 
          path:'@/content/typescapes/enum-guards/main.ts' },
        { alias:'typist.lib.ts', 
          path:'@/content/typescapes/enum-guards/typist.lib.ts' } ] })
