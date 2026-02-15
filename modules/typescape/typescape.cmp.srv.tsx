import TypeExplorer, { type ExplorerFile } from '@/modules/typescape/editor.cmp.cli'
import { importScenarioMeta } from './scenario.model.iso';
import { loadScenarioFiles } from './loader.srv';

interface TypescapeProps {
  scenarioId: string;
}

export async function Typescape({ scenarioId }: TypescapeProps) {
  const [files, scenario] = await Promise.all([
    loadScenarioFiles(scenarioId),
    importScenarioMeta(scenarioId)
  ]);
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Typescape Header */}
      <header className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            typescape
          </h1>
        </div>
        <span className="text-sm text-gray-500 font-medium">Interactive TypeScript Playground</span>
      </header>
      
      {/* Scenario Introduction */}
      {scenario && (
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {scenario.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {scenario.blurb}
          </p>
          
          <div className="prose prose-lg max-w-none">
            <p 
              className="text-gray-700 leading-relaxed text-lg font-light"
              dangerouslySetInnerHTML={{
                __html: scenario.explanation.replace(
                  /`([^`]+)`/g, 
                  '<code class="px-1.5 py-0.5 text-sm bg-gray-100 text-gray-800 rounded font-mono">$1</code>'
                )
              }}
            />
          </div>
        </div>
      )}
      
      <TypeExplorer initialFiles={files} scenarioId={scenarioId} />
    </div>
  );
}

