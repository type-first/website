"use client";

import { useState, useEffect } from 'react';
import Breadcrumbs from '@/modules/navigation/components/breadcrumbs.client';
import SearchDialog from './search-dialog.modal';
import { openChat, subscribeToChatState } from '@/modules/chat/utils/chat-controls.util';
import { MessageSquare, Search } from 'lucide-react';

export default function SearchBarLauncher() {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Subscribe to chat state changes
  useEffect(() => {
    const unsubscribe = subscribeToChatState((isOpen) => {
      setChatOpen(isOpen);
    });
    
    return unsubscribe;
  }, []);
  return (
    <>
      <div className="hidden md:flex h-[60px] items-center justify-between px-6 border-b border-gray-200 bg-white">
        <Breadcrumbs />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={chatOpen ? "Chat is open" : "Open chat"}
            title={chatOpen ? "Chat is open" : "Open chat"}
            onClick={() => openChat()}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-md border transition-colors ${
              chatOpen 
                ? 'border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'border-gray-300 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
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
