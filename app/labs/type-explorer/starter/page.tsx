import fs from 'fs/promises';
import path from 'path';
import TypeExplorer, { type ExplorerFile } from '@/components/TypeExplorer';
import TypeExplorerLabIntro from '@/content/labs/type-explorer/intro';
import { typeExplorerLabData } from '@/content/labs/type-explorer/content.data';
import { generateLabMetadata } from '@/lib/labs/metadata.logic';

export const metadata = generateLabMetadata({
  ...typeExplorerLabData,
  title: 'Type Explorer — Starter',
  description: 'Starter (minimal multi-file) scenario',
});

async function loadLocalScenario(): Promise<ExplorerFile[]> {
  const baseDir = path.join(process.cwd(), 'app', 'labs', 'type-explorer', 'scenarios', 'starter', 'src');
  async function exists(p: string) {
    try { await fs.access(p); return true; } catch { return false; }
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
        out.push({ path: 'file:///' + rel, content });
      }
    }
  }
  await walk(baseDir);
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

export default async function StarterScenarioPage() {
  const files = await loadLocalScenario();
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <TypeExplorerLabIntro />
      <TypeExplorer initialFiles={files} />
    </div>
  );
}

