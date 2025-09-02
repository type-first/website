'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchDialog from '@/components/SearchDialog';

export default function SearchBarLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <Breadcrumbs />
        <button
          type="button"
          aria-label="Search"
          title="Search"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.245 12.03l4.237 4.236a.75.75 0 1 0 1.06-1.06l-4.236-4.237A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

