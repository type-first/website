"use client";

import Link from 'next/link';
import { useState } from 'react';
import SearchDialog from '@/components/SearchDialog';
import { openChat } from '@/components/chatControls';
import { Menu, MessageSquare, Search, X } from 'lucide-react';

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
            <Menu className="w-5 h-5" strokeWidth={1.8} />
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
              <MessageSquare className="w-5 h-5" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Search"
              title="Search"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
            >
              <Search className="w-5 h-5" strokeWidth={1.8} />
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
                <X className="h-5 w-5" strokeWidth={1.8} />
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
