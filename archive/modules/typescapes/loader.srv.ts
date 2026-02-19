import fs from 'fs/promises'
import path from 'path'
import { isScenario, ScenarioMeta } from './model.iso'
import { readFileSync } from 'fs'

// Resolve @/ alias to absolute path (mirrors tsconfig paths)
const resolveAlias = (aliasPath: string) => 
  path.resolve(process.cwd(), aliasPath.replace('@/', ''));

export type ScenarioFile 
  = { path: string
      content: string }

export const importScenarioMeta
  = async (slug:ScenarioMeta['slug'])
  : Promise<ScenarioMeta> => 
  { try
    { const module = await import(`@/content/typescapes/${slug}/meta.ts`)
      const scenario:ScenarioMeta = module.default
      if (!isScenario(scenario)) 
        throw 'no-default-export:${slug}'
      else return scenario } 
    catch (e) { throw `not-found:${slug}` } }

export const loadScenarioFiles 
  = async (scenario:ScenarioMeta)
  : Promise<ScenarioFile[]> => 
    scenario.files.map(conf => 
    { const abspath = resolveAlias(conf.path)
      const content = readFileSync(abspath, 'utf8')
      const path = `file:///src/${conf.alias}`
      return { path, content } } )