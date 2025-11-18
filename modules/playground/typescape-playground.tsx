import fs from 'fs/promises';
import path from 'path';
import TypeExplorer, { type ExplorerFile } from '@/modules/playground/components/type-explorer.client';

interface TypescapePlaygroundProps {
  scenarioId: string;
}

// Import all scenario metadata
const scenarioMeta = {
  'typist-intro': {
    name: 'Typist: Introduction & Fundamentals',
    blurb: 'Learn typist fundamentals through practical examples. Explore assertions, type relationships, and domain modeling with compile-time validation.',
    explanation: 'This scenario introduces you to the core concepts of typist through hands-on examples. You\'ll start with basic type assertions like `is_` and `extends_`, then build up to sophisticated domain models with `User` and `Admin` hierarchies. The examples demonstrate how to combine compile-time type checking with runtime validation, showing patterns for positive and negative testing. By the end, you\'ll understand how typist enables you to write more reliable TypeScript code through static type proofs and phantom type patterns.'
  },
  'typist-tuple-manipulation': {
    name: 'Tuple Manipulation & Algorithms',
    blurb: 'Master advanced tuple operations including join, split, union explosion, and sophisticated type algorithms using typist.',
    explanation: 'Dive deep into TypeScript\'s tuple system with advanced manipulation techniques. This scenario covers complex algorithms like tuple `join` and `split` operations, union type distribution, and intersection patterns. You\'ll learn how to implement type-level arithmetic, work with recursive tuple operations, and understand how unions can be "exploded" into tuple form using `explodeUnion`. These patterns are essential for building sophisticated type-level computations and generic utilities.'
  },
  'typist-get-operations': {
    name: 'Get Operations & Path Access',
    blurb: 'Explore type-safe path traversal with get operations, deep property access, and sophisticated path validation patterns using typist.',
    explanation: 'Learn to build type-safe property access systems that work at both compile-time and runtime. This scenario demonstrates how to create `GetAtPath` utilities that can traverse complex nested object structures with full type safety. You\'ll see how to handle arrays, unions, and optional properties while maintaining strict type checking through the `get` function. These patterns are crucial for building robust APIs that work with complex data structures.'
  },
  'typist-enum-guards': {
    name: 'Enum & Runtime Guards',
    blurb: 'Master enum patterns, runtime type guards, and integration between compile-time type checking and runtime validation.',
    explanation: 'Bridge the gap between compile-time types and runtime validation with custom enum patterns. This scenario shows how to build a robust `Enum` class that provides both type safety and runtime checking through methods like `is()` and `is_()`. You\'ll learn to create type guards that work seamlessly with TypeScript\'s control flow analysis, enabling safe handling of unknown data while maintaining full type information in different execution contexts.'
  },
  'typist-omit-utilities': {
    name: 'Omit & Utility Types',
    blurb: 'Advanced object manipulation with omit patterns, utility type creation, and sophisticated type transformation techniques.',
    explanation: 'Master the art of type-safe object manipulation through custom utility types. This scenario focuses on building robust `omit` implementations that preserve type safety while providing runtime functionality. You\'ll learn how to create utilities that can selectively remove properties from objects using functions like `keys` and type-level `Omit`, ensuring the resulting types are correctly inferred and validated. These patterns are essential for building flexible APIs that need to transform data shapes.'
  },
  'typist-registry-patterns': {
    name: 'Registry & Type Indexing',
    blurb: 'Master complex type registry patterns, key-based indexing, and advanced type lookup systems for scalable type architectures.',
    explanation: 'Explore advanced patterns for building type-safe registry systems that scale with your application. This scenario demonstrates how to create registries with `RIndex` and `REntry` types that provide both runtime functionality and compile-time type guarantees. You\'ll learn to build systems where adding new entries through the `Registry` class automatically updates the type system, enabling powerful lookup patterns and ensuring that your registry remains type-safe as it grows. These patterns are invaluable for plugin systems, configuration management, and modular architectures.'
  }
} as const;

async function loadScenarioFiles(scenarioId: string): Promise<ExplorerFile[]> {
  const baseDir = path.join(process.cwd(), `content/typescape/${scenarioId}/src`);
  
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

export async function TypescapePlayground({ scenarioId }: TypescapePlaygroundProps) {
  const files = await loadScenarioFiles(scenarioId);
  const scenario = scenarioMeta[scenarioId as keyof typeof scenarioMeta];
  
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
      
      <TypeExplorer initialFiles={files} />
    </div>
  );
}