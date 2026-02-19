import { scenario } from '@/modules/typescapes/model.iso'

export default scenario
 ({ slug: 'typist-fundamentals',
    name: 'typist fundamentals',
    blurb: 'learn typist fundamentals through practical examples. explore assertions, type relationships, and domain modeling with compile-time validation.',
    tags: ['typist', 'assertions', 'type-safety', 'utility', 'primitive'] as const,
    difficulty: 'beginner',
    explanation: [
      'master basic typist assertions and type checking. ',
      'understand the typeof/t_ flexibility pattern. ',
      'build type-safe domain models with user hierarchies. ',
      'use type guards with compile-time validation. ',
      'create feedback systems with exclusive reactions. ',
      'practice positive and negative testing patterns. '
    ].join('\n'),
    files: 
      [ { alias:'main.ts',
          path:'@/content/typescapes/typist-fundamentals/main.ts' } ,
        { alias:'typist.lib.ts',
          path:'@/content/typescapes/typist-fundamentals/typist.lib.ts' } ] })