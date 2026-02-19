import { scenario } from '@/modules/typescapes/model.iso'

export default scenario
 ({ slug: 'registry-builder',
    name: 'registry builder',
    blurb: 'type-safe registry systems with compile-time key validation, advanced lookup patterns, and registry composition utilities.',
    tags: ['typist', 'registry', 'utility', 'advanced'] as const,
    difficulty: 'advanced',
    explanation: 'type-safe registry patterns with generics and key validation',
    files: 
      [ { alias:'main.ts', 
          path:'@/content/typescapes/registry-builder/main.ts' },
        { alias:'typist.lib.ts', 
          path:'@/content/typescapes/registry-builder/typist.lib.ts' } ] })