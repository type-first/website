import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { getDocPageBySlug, getDocBreadcrumbs, buildDocNavigation } from '@/lib/content/doc.model';
import { DocBreadcrumbs } from '@/lib/content/ui/doc/doc-breadcrumbs.cmp.iso';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { DocNavigation } from '@/lib/content/ui/doc/doc-navigation.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { Calendar, User } from 'lucide-react';
import { Intro } from '@/content/docs/typist/body';
import { installationSnippet } from '@/content/docs/typist/snippets/installation.yml';

export async function generateMetadata() {
  const library = getDocLibraryBySlug('typist');
  const page = getDocPageBySlug(library!, 'installation');
  
  return {
    title: `${page?.title} - ${library?.name}`,
    description: page?.description,
  };
}

export default function TypistInstallationPage() {
  const library = getDocLibraryBySlug('typist');
  
  if (!library) {
    notFound();
  }

  const page = getDocPageBySlug(library, 'installation');
  
  if (!page) {
    notFound();
  }

  const navigationPages = buildDocNavigation(library.pages);
  const breadcrumbs = getDocBreadcrumbs(library, page);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <DocBreadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              {library.name}
            </h3>
            <DocSidebar 
              librarySlug={library.slug} 
              pages={navigationPages}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3">
          <article className="max-w-4xl">
            {/* Page header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {page.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {page.description}
              </p>
              
              {/* Page metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" strokeWidth={1.8} />
                  {library.author.name}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" strokeWidth={1.8} />
                  Updated {new Date(page.updatedTs).toLocaleDateString()}
                </div>
              </div>
            </header>

            {/* Page content */}
            <div className="prose prose-lg max-w-none">
              <Intro />
              
              <h2>Prerequisites</h2>
              <p>
                Before installing typist, ensure your development environment meets these requirements:
              </p>
              
              <ul>
                <li><strong>TypeScript 4.5+</strong> - Required for optimal type inference and error reporting</li>
                <li><strong>Node.js 14+</strong> - For development and build tooling</li>
                <li><strong>A TypeScript-compatible editor</strong> - VS Code, WebStorm, or similar with TypeScript support</li>
              </ul>
              
              <h2>Package Installation</h2>
              <p>Install typist using your preferred package manager:</p>
              
              <Code language="bash">{installationSnippet}</Code>
              
              <h2>TypeScript Configuration</h2>
              <p>
                Typist works best with strict TypeScript settings. Add these recommended settings to your <code>tsconfig.json</code>:
              </p>
              
              <Code language="json">{`{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  }
}`}</Code>
              
              <h2>Verification</h2>
              <p>
                Verify your installation by creating a simple test file:
              </p>
              
              <Code language="typescript">{`// test-typist.ts
import { t_, $Equal, yes_ } from '@typefirst/typist';

// Create a phantom value
const stringValue = t_<string>();

// Test type equality
type StringsAreEqual = $Equal<string, string>;
yes_<StringsAreEqual>(); // ✅ Should compile without errors

console.log('Typist is working correctly!');`}</Code>
              
              <p>Run the verification:</p>
              
              <Code language="bash">{`npx tsc test-typist.ts --noEmit
node test-typist.js`}</Code>
              
              <h2>IDE Setup</h2>
              
              <h3>VS Code</h3>
              <p>
                For the best experience with typist in VS Code, install these recommended extensions:
              </p>
              
              <ul>
                <li><strong>TypeScript Importer</strong> - Auto-imports typist utilities</li>
                <li><strong>Error Lens</strong> - Inline type error display</li>
                <li><strong>TypeScript Hero</strong> - Enhanced TypeScript tooling</li>
              </ul>
              
              <h3>Settings</h3>
              <p>Add these settings to your VS Code workspace:</p>
              
              <Code language="json">{`{
  "typescript.preferences.strictNullChecks": "on",
  "typescript.preferences.noImplicitAny": "on",
  "typescript.displayPartsForJSDoc": true,
  "typescript.suggest.autoImports": "on"
}`}</Code>
              
              <h2>Project Integration</h2>
              
              <h3>Build Integration</h3>
              <p>
                Typist works seamlessly with all major build tools:
              </p>
              
              <ul>
                <li><strong>Webpack</strong> - Works out of the box with ts-loader</li>
                <li><strong>Vite</strong> - Native TypeScript support includes typist</li>
                <li><strong>esbuild</strong> - TypeScript transformation handles typist utilities</li>
                <li><strong>Rollup</strong> - Use with @rollup/plugin-typescript</li>
              </ul>
              
              <h3>Testing</h3>
              <p>
                Typist type assertions work great with testing frameworks:
              </p>
              
              <Code language="typescript">{`// In your test files
import { $Equal, yes_, no_ } from '@typefirst/typist';

describe('Type Tests', () => {
  it('should validate user type structure', () => {
    type User = { id: string; name: string };
    type ValidUser = { id: string; name: string };
    
    // This will cause a compile error if types don't match
    yes_<$Equal<User, ValidUser>>();
  });
});`}</Code>
              
              <h2>Troubleshooting</h2>
              
              <h3>Common Issues</h3>
              
              <h4>Module not found</h4>
              <p>
                If you see <code>Cannot find module '@typefirst/typist'</code>, ensure:
              </p>
              <ul>
                <li>The package is installed in your project</li>
                <li>Your <code>node_modules</code> directory is not corrupted</li>
                <li>TypeScript can resolve the module path</li>
              </ul>
              
              <h4>Type errors in strict mode</h4>
              <p>
                Typist is designed for strict TypeScript. If you're seeing unexpected type errors:
              </p>
              <ul>
                <li>Enable strict mode in your tsconfig.json</li>
                <li>Update to TypeScript 4.5 or later</li>
                <li>Check our <a href="/docs/typist/troubleshooting">Troubleshooting Guide</a></li>
              </ul>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-green-900 mt-0 mb-3">
                  ✅ Next Steps
                </h3>
                <p className="text-green-800 mb-0">
                  Installation complete! Head over to the <a href="/docs/typist/quick-start" className="text-green-700 underline">Quick Start Guide</a> to begin using typist in your project.
                </p>
              </div>
            </div>

            {/* Page navigation */}
            <DocNavigation 
              library={library} 
              currentPage={page}
              className="mt-12"
            />
          </article>
        </main>
      </div>
    </div>
  );
}