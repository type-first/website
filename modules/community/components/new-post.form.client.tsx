"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function submit() {
    setError(null);
    const t = title.trim();
    const b = body.trim();
    if (!t) return setError('Title is required');
    if (!b) return setError('Body is required');
    setSubmitting(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t, body: b }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to create post');
      const slug = data.slug as string;
      router.push(`/community/${encodeURIComponent(slug)}`);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What would you like to discuss?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={8}
          placeholder="Give more details to start the discussion..."
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create Post'}
        </button>
      </div>
    </div>
  );
}

