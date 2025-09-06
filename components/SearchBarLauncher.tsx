"use client";

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchDialog from '@/components/SearchDialog';
import { openChat } from '@/components/chatControls';

export default function SearchBarLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="hidden md:flex h-[60px] items-center justify-between px-6 border-b border-gray-200 bg-white">
        <Breadcrumbs />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open chat"
            title="Open chat"
            onClick={() => openChat()}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7.5 8.25h9m-9 3.75h6.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-5.25 5.25L12 21l-3.75-3.75"/></svg>
          </button>
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
      </div>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
