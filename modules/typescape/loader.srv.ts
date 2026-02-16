import fs from 'fs/promises';
import path from 'path';
import { isScenario, ScenarioMeta } from './model.iso';

export type ScenarioFile 
  = { path: string
      content: string }

export const importScenarioMeta 
  = async (slug:ScenarioMeta['slug'])
  : Promise<ScenarioMeta> => 
  { try
    { const module = await import(`./examples/${slug}/meta.ts`)
      const scenario:ScenarioMeta = module.default
      if (!isScenario(scenario)) throw 'no-scenario-default-export'
      return scenario } 
    catch (e) { throw `scenario-not-found:${slug}` } }

export const loadScenarioFiles 
  = async (slug:string)
  : Promise<ScenarioFile[]> => 
  { const baseDir = path.join
      ( process.cwd(), 
        `modules/typescape/examples/${slug}/src` )
  
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
  };