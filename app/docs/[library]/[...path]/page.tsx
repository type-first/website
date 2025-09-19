import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { getDocPageByPath, getDocBreadcrumbs, buildDocNavigation } from '@/lib/content/doc.model';
import { DocBreadcrumbs } from '@/lib/content/ui/doc/doc-breadcrumbs.cmp.iso';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { DocNavigation } from '@/lib/content/ui/doc/doc-navigation.cmp.iso';
import { Calendar, User } from 'lucide-react';

interface DocPageProps {
  params: Promise<{
    library: string;
    path: string[];
  }>;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { library: librarySlug, path } = await params;
  const library = getDocLibraryBySlug(librarySlug);
  
  if (!library) {
    return {
      title: 'Library Not Found',
    };
  }

  const page = getDocPageByPath(library, path);
  
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

export default async function DocPage({ params }: DocPageProps) {
  const { library: librarySlug, path } = await params;
  const library = getDocLibraryBySlug(librarySlug);
  
  if (!library) {
    notFound();
  }

  const page = getDocPageByPath(library, path);
  
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
              {/* Placeholder for actual page content */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Content Coming Soon
                </h3>
                <p className="text-gray-600">
                  This documentation page is being prepared. The content will be 
                  loaded from the library's UI component.
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