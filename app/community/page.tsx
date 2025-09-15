import Link from 'next/link';
import { auth } from '@/lib/auth/config';
import { listCommunityPosts } from '@/lib/db/v0/community';
import RequireAuthButton from '@/lib/auth/components/require-auth-button';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'Community',
  description: 'Public forum for discussions and ideas.'
};

export default async function CommunityPage() {
  const session = await auth();
  const isAuthed = !!session?.user;
  const posts = await listCommunityPosts();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="mt-2 text-gray-600">Browse discussions. Sign in to post and vote.</p>
        </div>
        <RequireAuthButton
          isAuthed={isAuthed}
          href="/community/new"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" strokeWidth={1.8} />
          New Post
        </RequireAuthButton>
      </div>

      <div className="mt-8 divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
        {posts.map((p) => (
          <div key={p.id} className="p-5 flex gap-4">
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <RequireAuthButton isAuthed={isAuthed} className="p-1 rounded hover:bg-gray-100">
                <ChevronUp className="w-5 h-5" strokeWidth={1.8} />
              </RequireAuthButton>
              <div className="text-sm font-medium text-gray-900">{p.votes}</div>
              <RequireAuthButton isAuthed={isAuthed} className="p-1 rounded hover:bg-gray-100">
                <ChevronDown className="w-5 h-5" strokeWidth={1.8} />
              </RequireAuthButton>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                <Link className="hover:text-blue-700" href={`/community/${p.id}`}>{p.title}</Link>
              </h2>
              <p className="text-gray-700 mt-1 line-clamp-2">{p.body}</p>
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-4">
                <span>by {p.author}</span>
                <span>•</span>
                <span>{p.commentsCount ?? 0} comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
