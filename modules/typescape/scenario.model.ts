import fs from 'fs/promises';
import path from 'path'

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

// --- 

export type ScenarioFile
  = { path: string
      content: string }

// --- loaders

export const importScenarioMeta 
  = async (slug:ScenarioMeta['slug']):Promise<ScenarioMeta> => 
  { const metaModule = await import(`./examples/${slug}/meta.ts`)
    const scenario:ScenarioMeta = metaModule.default
    if (!isScenario(scenario)) 
      throw 'no-scenario-default-export'
    return scenario } 

export const loadScenarioFiles
  = async (slug:ScenarioMeta['slug']):Promise<ScenarioFile[]> => 
  { const baseDir 
      = path.join(process.cwd(), )
  
  async function exists(p: string) {
    try { 
      await fs.access(p); 
      return true; 
    } catch { 
      return false; 
    }
  }
  
  if (!(await exists(baseDir))) return [];
  
  const out: ScenarioFile[] = [];
  
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (/\.(tsx?|d\.ts)$/.test(e.name)) {
        const rel = path.relative(baseDir, full).split(path.sep).join('/');
        const content = await fs.readFile(full, 'utf8');
        // Ensure path starts with file:///src/ to match rootDir
        const filePath = rel === 'index.ts' ? 'file:///src/index.ts' : `file:///src/${rel}`;
        out.push({ path: filePath, content });
      }
    }
  }
  
  await walk(baseDir);
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}