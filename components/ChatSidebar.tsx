"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function ChatSidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);
      return () => clearTimeout(t);
    }
  }, [open, messages.length]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    const next: Msg[] = [...messages, { role: 'user' as const, content: q }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error('Chat API error');
      const data = await res.json();
      const reply = (data?.reply as string) || 'Sorry, I could not respond.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'There was an error talking to the model.' }]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  const pill = useMemo(() => (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-40 shadow-lg bg-blue-600 text-white rounded-full px-4 py-2 text-sm hover:bg-blue-700"
      aria-label="Open chat assistant"
    >
      Chat
    </button>
  ), []);

  return (
    <>
      {!open && pill}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl border-l border-gray-200 flex flex-col">
            <header className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="font-medium text-gray-900">Assistant</div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </header>
            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-sm text-gray-600">
                  Ask me about the site, Next.js, React, or TypeScript.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-900'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left">
                  <div className="inline-block px-3 py-2 rounded-lg text-sm bg-white border text-gray-500">Thinking…</div>
                </div>
              )}
            </div>
            <form className="p-3 border-t border-gray-200 bg-white" onSubmit={(e) => { e.preventDefault(); void send(); }}>
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Type a message…"
                  rows={2}
                  className="flex-1 resize-none text-sm p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="submit"
                  disabled={loading || input.trim().length === 0}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
