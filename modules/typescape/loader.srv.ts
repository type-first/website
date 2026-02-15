import fs from 'fs/promises';
import path from 'path';

export type ScenarioFile = {
  path: string;
  content: string;
};

/**
 * Load all TypeScript files from a scenario's src directory
 * @param slug The scenario slug/identifier
 * @returns Array of files with their contents
 */
export const loadScenarioFiles = async (slug: string): Promise<ScenarioFile[]> => {
  const baseDir = path.join(process.cwd(), `modules/typescape/examples/${slug}/src`);
  
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