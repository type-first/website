"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

type Suggestion = { title: string; slug: string; snippet: string };
type Msg = { role: 'user' | 'assistant'; content: string; suggestions?: Suggestion[] };

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

  // Seed intro message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: "Hi! What topics are you interested in? I can suggest relevant articles." },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok) throw new Error('Chat API error');
      const data = await res.json();
      const reply = (data?.reply as string) || 'Sorry, I could not respond.';
      const suggestions = Array.isArray(data?.suggestions) ? (data.suggestions as Suggestion[]) : [];
      setMessages((m) => [...m, { role: 'assistant', content: reply, suggestions }]);
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

  // External open/close/toggle controls via window events
  useEffect(() => {
    function onOpen() { setOpen(true); }
    function onClose() { setOpen(false); }
    function onToggle() { setOpen((v) => !v); }
    window.addEventListener('chat:open', onOpen as EventListener);
    window.addEventListener('chat:close', onClose as EventListener);
    window.addEventListener('chat:toggle', onToggle as EventListener);
    return () => {
      window.removeEventListener('chat:open', onOpen as EventListener);
      window.removeEventListener('chat:close', onClose as EventListener);
      window.removeEventListener('chat:toggle', onToggle as EventListener);
    };
  }, []);

  return (
    <>
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
                    {renderContent(m)}
                  </div>
                  {m.role === 'assistant' && m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2 text-left">
                      <div className="text-xs font-medium text-gray-700 mb-1">Suggested articles</div>
                      <ul className="space-y-1">
                        {m.suggestions.map((s, idx) => (
                          <li key={idx} className="text-sm">
                            <a href={`/article/${s.slug}`} className="text-blue-700 underline hover:text-blue-900">{s.title}</a>
                            <div className="text-gray-600 text-xs line-clamp-2">{s.snippet.replace(/<[^>]+>/g, '')}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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

function renderContent(m: Msg) {
  // Minimal linkification for /article/... and http(s) links
  const text = m.content;
  const parts: Array<string | { href: string; label: string }> = [];
  const urlRe = /(https?:\/\/[^\s)]+)|(\/articles\/[a-z0-9-]+)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = urlRe.exec(text)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) parts.push(text.slice(lastIndex, idx));
    const href = match[0];
    parts.push({ href, label: href });
    lastIndex = idx + href.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <a key={i} href={p.href} className="underline text-blue-700 hover:text-blue-900" target={p.href.startsWith('http') ? '_blank' : undefined} rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
            {p.label}
          </a>
        )
      )}
    </>
  );
}
