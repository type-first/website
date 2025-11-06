import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { getDocPageBySlug, getDocBreadcrumbs, buildDocNavigation } from '@/lib/content/doc.model';
import { DocBreadcrumbs } from '@/lib/content/ui/doc/doc-breadcrumbs.cmp.iso';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { DocNavigation } from '@/lib/content/ui/doc/doc-navigation.cmp.iso';
import { Calendar, User } from 'lucide-react';
import { Intro } from '@/content/docs/typist/body';

export async function generateMetadata() {
  const library = getDocLibraryBySlug('typist');
  
  if (!library) {
    return {
      title: 'Library Not Found',
    };
  }

  const page = getDocPageBySlug(library, 'introduction');
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `${page.title} - ${library.name}`,
    description: page.description,
  };
}

export default function TypistIntroductionPage() {
  const library = getDocLibraryBySlug('typist');
  
  if (!library) {
    notFound();
  }

  const page = getDocPageBySlug(library, 'introduction');
  
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
              
              <h2>What is Type-Level Programming?</h2>
              <p>
                Type-level programming is a paradigm where you write code that operates on types themselves, 
                rather than just values. TypeScript's powerful type system allows you to create types that 
                can perform computations, validations, and transformations at compile time.
              </p>
              
              <h2>Core Philosophy</h2>
              <p>
                Typist follows these key principles:
              </p>
              
              <ul>
                <li><strong>Minimal</strong> - Small, focused utilities that compose well together</li>
                <li><strong>Compositional</strong> - Building blocks that can be combined to create complex type-level logic</li>
                <li><strong>Debug-friendly</strong> - Clear error messages and introspectable type-level behavior</li>
                <li><strong>Zero runtime cost</strong> - All utilities operate at compile-time with no runtime overhead</li>
              </ul>
              
              <h2>Why Choose Typist?</h2>
              <p>
                Traditional TypeScript development often requires runtime checks and validation to ensure 
                type safety. Typist shifts this validation to compile-time, enabling you to:
              </p>
              
              <ul>
                <li>Catch type errors before they reach production</li>
                <li>Build more expressive and self-documenting APIs</li>
                <li>Create robust type-level test suites</li>
                <li>Eliminate runtime overhead for type checking</li>
                <li>Express complex domain constraints through the type system</li>
              </ul>
              
              <h2>Key Features</h2>
              
              <h3>Phantom Types</h3>
              <p>
                Create nominal types without runtime overhead, perfect for domain modeling and preventing 
                common mistakes like mixing up user IDs and product IDs.
              </p>
              
              <h3>Verdict System</h3>
              <p>
                Encode compile-time validation results that can be composed and reasoned about, providing 
                rich error information when types don't match expectations.
              </p>
              
              <h3>Type Assertions</h3>
              <p>
                Test assignability, identity, and structure in-place with utilities that provide immediate 
                feedback during development.
              </p>
              
              <h3>Symbolic Operations</h3>
              <p>
                Perform type-level comparisons and transformations with a rich set of operators that work 
                seamlessly with TypeScript's inference engine.
              </p>
              
              <h2>Getting Started</h2>
              <p>
                Ready to dive in? Check out our <a href="/docs/typist/installation">Installation Guide</a> 
                to set up typist in your project, or jump straight to the{' '}
                <a href="/docs/typist/quick-start">Quick Start</a> for hands-on examples.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-3">
                  💡 Pro Tip
                </h3>
                <p className="text-blue-800 mb-0">
                  Typist works best when you embrace type-first thinking. Start with the types 
                  you want to express, then use typist's utilities to encode and validate those 
                  type relationships.
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