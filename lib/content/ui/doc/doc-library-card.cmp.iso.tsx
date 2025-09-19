'use client';

import React from 'react';
import Link from 'next/link';
import type { DocLibraryMeta } from '@/lib/content/doc.model';
import { ArrowUpRight, Book, ExternalLink, Package } from 'lucide-react';

interface DocLibraryCardProps {
  library: DocLibraryMeta;
  className?: string;
}

export function DocLibraryCard({ library, className = '' }: DocLibraryCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {library.coverImgUrl && (
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
          <img 
            src={library.coverImgUrl} 
            alt={library.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Book className="h-6 w-6 text-blue-600 flex-shrink-0" strokeWidth={1.8} />
          <div className="flex gap-2 ml-2">
            {library.githubUrl && (
              <a 
                href={library.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
              </a>
            )}
            {library.npmPackage && (
              <a 
                href={`https://www.npmjs.com/package/${library.npmPackage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Package className="h-4 w-4" strokeWidth={1.8} />
              </a>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          <Link 
            href={`/docs/${library.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {library.name}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {library.description}
        </p>
        
        {library.tags && library.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {library.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {library.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{library.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{library.pages.length} pages</span>
          {library.version && (
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              v{library.version}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}