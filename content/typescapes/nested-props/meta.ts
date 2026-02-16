import { scenario } from '@/modules/typescapes/model.iso'

export default scenario
 ({ slug: 'nested-props',
    name: 'path-based property access',
    blurb: 'type-safe object property accessors with compile-time path validation and runtime safeguards for deep immutable object traversal.',
    tags: ['typist', 'immutable', 'utility', 'primitive'] as const,
    difficulty: 'intermediate',
    explanation: 'compile-time validated path access utilities',
    files: 
      [ { alias:'main.ts',
          path:'@/content/typescapes/nested-props/main.ts' } ,
        { alias:'typist.lib.ts',
          path:'@/content/typescapes/nested-props/typist.lib.ts' } ] })
