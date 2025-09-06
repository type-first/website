"use client";

import Link from 'next/link';
import { useState } from 'react';
import SearchDialog from '@/components/SearchDialog';
import { openChat } from '@/components/chatControls';

export default function MobileTopBarClient({ menu }: { menu: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="md:hidden bg-white border-b border-gray-200">
        <div className="h-[60px] px-4 flex items-center justify-between">
          <button
            aria-label="Open menu"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
            onClick={() => setMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/></svg>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white text-[11px] font-semibold">tf</div>
            <span className="text-sm font-semibold text-gray-900">typefirst</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open chat"
              title="Open chat"
              onClick={() => openChat()}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7.5 8.25h9m-9 3.75h6.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-5.25 5.25L12 21l-3.75-3.75"/></svg>
            </button>
            <button
              type="button"
              aria-label="Search"
              title="Search"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.245 12.03l4.237 4.236a.75.75 0 1 0 1.06-1.06l-4.236-4.237A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-xl border-r border-gray-200">
            <div className="h-[60px] px-4 flex items-center justify-between border-b border-gray-200">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white text-[11px] font-semibold">tf</div>
                <span className="text-sm font-semibold text-gray-900">typefirst</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-gray-900" aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18 18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-4">
              {menu}
            </div>
          </aside>
        </div>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
