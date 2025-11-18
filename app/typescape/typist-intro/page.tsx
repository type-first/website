import fs from 'fs/promises';
import path from 'path';
import TypeExplorer, { type ExplorerFile } from '@/modules/playground/components/type-explorer.client';
import { typistIntroScenario } from '@/content/typescape/typist-intro/meta';

export const metadata = {
  title: `${typistIntroScenario.name} - TypeScript Scenario`,
  description: typistIntroScenario.blurb,
};

async function loadScenarioFiles(): Promise<ExplorerFile[]> {
  const baseDir = path.join(process.cwd(), 'content/typescape/typist-intro/src');
  
  async function exists(p: string) {
    try { 
      await fs.access(p); 
      return true; 
    } catch { 
      return false; 
    }
  }
  
  if (!(await exists(baseDir))) return [];
  
  const out: ExplorerFile[] = [];
  
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (/\.(tsx?|d\.ts)$/.test(e.name)) {
        const rel = path.relative(baseDir, full).split(path.sep).join('/');
        const content = await fs.readFile(full, 'utf8');
        out.push({ path: 'file:///src/' + rel, content });
      }
    }
  }
  
  await walk(baseDir);
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

import { TypescapePlayground } from "@/modules/playground/typescape-playground"

export default function TypistIntroPage() {
  return <TypescapePlayground scenarioId="typist-intro" />
}