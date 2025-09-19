import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  name: string;
  href: string;
}

interface DocBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  className?: string;
}

export function DocBreadcrumbs({ breadcrumbs, className = '' }: DocBreadcrumbsProps) {
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={breadcrumb.href}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400" strokeWidth={1.8} />
            )}
            {isLast ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {breadcrumb.name}
              </span>
            ) : (
              <Link 
                href={breadcrumb.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}