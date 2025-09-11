"use client";

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchDialog from '@/components/SearchDialog';
import { openChat } from '@/components/chatControls';
import { MessageSquare, Search } from 'lucide-react';

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
            <MessageSquare className="w-5 h-5" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Search"
            title="Search"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Search className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
