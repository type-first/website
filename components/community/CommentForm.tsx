"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function CommentForm({ postSlug }: { postSlug: string }) {
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function submit() {
    setError(null);
    const text = body.trim();
    if (!text) return setError('Please write a comment.');
    try {
      const res = await fetch(`/api/community/posts/${encodeURIComponent(postSlug)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to add comment');
      }
      setBody('');
      startTransition(() => router.refresh());
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your comment..."
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  );
}

