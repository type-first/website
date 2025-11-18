import fs from 'fs/promises';
import path from 'path';
import TypeExplorer, { type ExplorerFile } from '@/modules/playground/components/type-explorer.client';
import { basicTypesAndFunctionsScenario } from '@/content/typescape/basic-types-and-functions/meta';
import { OverviewContent } from '@/content/typescape/basic-types-and-functions/body';

export const metadata = {
  title: `${basicTypesAndFunctionsScenario.name} - TypeScript Scenario`,
  description: basicTypesAndFunctionsScenario.blurb,
};

async function loadScenarioFiles(): Promise<ExplorerFile[]> {
  const baseDir = path.join(process.cwd(), 'content/typescape/basic-types-and-functions/src');
  
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
        out.push({ path: 'file:///' + rel, content });
      }
    }
  }
  
  await walk(baseDir);
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

// Scenario intro component
function ScenarioIntro() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {basicTypesAndFunctionsScenario.name}
      </h1>
      <div className="prose prose-gray max-w-none">
        <OverviewContent />
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Learning Goals:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          {basicTypesAndFunctionsScenario.learningGoals.map((goal, index) => (
            <li key={index}>• {goal}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default async function BasicTypesAndFunctionsScenarioPage() {
  const files = await loadScenarioFiles();
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <ScenarioIntro />
      <TypeExplorer initialFiles={files} />
    </div>
  );
}