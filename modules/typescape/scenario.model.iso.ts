import type { ContentMeta } from '@/lib/content/content.model'

// --- content meta model

export const SCENARIO_KIND 
  = 'typescape-scenario' as const

export type ScenarioMeta
  = ContentMeta<typeof SCENARIO_KIND> 
  & { difficulty:'beginner'|'intermediate'|'advanced'
      explanation:string }

export const scenario
  = (data:Omit<ScenarioMeta,'kind'>):ScenarioMeta => 
    ({ kind:SCENARIO_KIND, ...data })

// @todo use swiss, extend isContent
export const isScenario
  = (x:unknown):x is ScenarioMeta => 
    typeof x === 'object' && 
    (x as any).kind === SCENARIO_KIND

// --- meta loader (isomorphic - can run in browser or server)

export const importScenarioMeta 
  = async (slug:ScenarioMeta['slug']):Promise<ScenarioMeta> => 
  { const metaModule = await import(`./examples/${slug}/meta.ts`)
    const scenario:ScenarioMeta = metaModule.default
    if (!isScenario(scenario)) 
      throw 'no-scenario-default-export'
    return scenario }