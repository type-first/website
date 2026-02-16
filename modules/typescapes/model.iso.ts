import type { ContentMeta } from '@/lib/content/content.model'

export const SCENARIO_KIND 
  = 'typescape-scenario' as const

export type ScenarioMeta
  = ContentMeta<typeof SCENARIO_KIND> 
  & { difficulty:'beginner'|'intermediate'|'advanced'
      explanation:string 
      files:
      { path:`@/${string}` 
        alias:string }[] }

export const scenario
  = (data:Omit<ScenarioMeta,'kind'>):ScenarioMeta => 
    ({ kind:SCENARIO_KIND, ...data })

// @todo use swiss, extend isContent
export const isScenario
  = (x:unknown):x is ScenarioMeta => 
    typeof x === 'object' && 
    (x as any).kind === SCENARIO_KIND