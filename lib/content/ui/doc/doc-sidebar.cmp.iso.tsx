'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { DocPageMeta } from '@/lib/content/doc.model';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface DocSidebarProps {
  librarySlug: string;
  pages: DocPageMeta[];
  className?: string;
}

interface DocNavItemProps {
  page: DocPageMeta;
  librarySlug: string;
  currentPath: string;
  level?: number;
}

function DocNavItem({ page, librarySlug, currentPath, level = 0 }: DocNavItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const href = `/docs/${librarySlug}/${page.path.join('/')}`;
  const isActive = currentPath === href;
  const hasChildren = page.children && page.children.length > 0;
  
  const indentClass = level === 0 ? '' : `ml-${Math.min(level * 4, 12)}`;
  
  return (
    <div>
      <div className={`flex items-center group ${indentClass}`}>
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded transition-colors mr-1"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={1.8} />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" strokeWidth={1.8} />
            )}
          </button>
        )}
        
        <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" strokeWidth={1.8} />
        
        <Link
          href={href}
          className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
            isActive 
              ? 'bg-blue-50 text-blue-700 font-medium' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {page.title}
        </Link>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {page.children!.map((child) => (
            <DocNavItem
              key={child.slug}
              page={child}
              librarySlug={librarySlug}
              currentPath={currentPath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocSidebar({ librarySlug, pages, className = '' }: DocSidebarProps) {
  const pathname = usePathname();
  
  if (pages.length === 0) {
    return null;
  }

  return (
    <nav className={`space-y-1 ${className}`} aria-label="Documentation navigation">
      {pages.map((page) => (
        <DocNavItem
          key={page.slug}
          page={page}
          librarySlug={librarySlug}
          currentPath={pathname}
        />
      ))}
    </nav>
  );
}