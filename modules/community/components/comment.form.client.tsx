"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function CommentForm({ 
  postSlug, 
  parentId, 
  onCancel,
  placeholder = "Write your comment..."
}: { 
  postSlug: string; 
  parentId?: string;
  onCancel?: () => void;
  placeholder?: string;
}) {
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
        body: JSON.stringify({ body: text, parentId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to add comment');
      }
      setBody('');
      if (onCancel) onCancel(); // Close reply form after successful post
      startTransition(() => router.refresh());
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    }
  }

  return (
    <div className={`border border-gray-200 rounded-md bg-white ${parentId ? 'border-gray-300 bg-gray-50' : ''}`}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        className={`w-full border-0 rounded-t-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          parentId ? 'bg-gray-50' : 'bg-white'
        }`}
        rows={parentId ? 3 : 4} // Smaller for replies
      />
      {error && <div className="px-3 py-2 text-sm text-red-600 bg-red-50 border-t border-red-200">{error}</div>}
      <div className="px-3 py-3 bg-gray-50 border-t border-gray-200 rounded-b-md flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {parentId ? 'Replying to comment' : 'Use markdown formatting'}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={pending || !body.trim()}
            className="px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {pending ? 'Posting...' : (parentId ? 'Reply' : 'Comment')}
          </button>
        </div>
      </div>
    </div>
  );
}

