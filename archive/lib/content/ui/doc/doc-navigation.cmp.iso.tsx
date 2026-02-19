import React from 'react';
import Link from 'next/link';
import type { DocLibraryMeta, DocPageMeta } from '@/lib/content/doc.model';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DocNavigationProps {
  library: DocLibraryMeta;
  currentPage?: DocPageMeta;
  className?: string;
}

function flattenPages(pages: DocPageMeta[]): DocPageMeta[] {
  const result: DocPageMeta[] = [];
  
  function traverse(pageList: DocPageMeta[]) {
    for (const page of pageList) {
      result.push(page);
      if (page.children) {
        traverse(page.children);
      }
    }
  }
  
  traverse(pages);
  return result.sort((a, b) => a.order - b.order);
}

export function DocNavigation({ library, currentPage, className = '' }: DocNavigationProps) {
  if (!currentPage) {
    return null;
  }

  const allPages = flattenPages(library.pages);
  const currentIndex = allPages.findIndex(page => page.slug === currentPage.slug);
  
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  if (!prevPage && !nextPage) {
    return null;
  }

  return (
    <nav className={`flex justify-between items-center pt-8 mt-8 border-t border-gray-200 ${className}`}>
      <div className="flex-1">
        {prevPage && (
          <Link
            href={`/docs/${library.slug}/${prevPage.path.join('/')}`}
            className="group flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" strokeWidth={1.8} />
            <div>
              <div className="text-xs uppercase tracking-wide font-medium text-gray-400 group-hover:text-gray-500">
                Previous
              </div>
              <div className="font-medium text-gray-900 group-hover:text-blue-600">
                {prevPage.title}
              </div>
            </div>
          </Link>
        )}
      </div>
      
      <div className="flex-1 text-right">
        {nextPage && (
          <Link
            href={`/docs/${library.slug}/${nextPage.path.join('/')}`}
            className="group flex items-center justify-end text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide font-medium text-gray-400 group-hover:text-gray-500">
                Next
              </div>
              <div className="font-medium text-gray-900 group-hover:text-blue-600">
                {nextPage.title}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={1.8} />
          </Link>
        )}
      </div>
    </nav>
  );
}