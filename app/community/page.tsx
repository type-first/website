import Link from 'next/link';
import { auth } from '@/modules/auth/config';
import { listCommunityPosts } from '@/modules/db/v0/community';
import RequireAuthButton from '@/modules/auth/components/require-auth-button';
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

      <div className="mt-8 divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-white">
        {posts.map((p) => (
          <div key={p.id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1 text-gray-600 min-w-[50px]">
              <RequireAuthButton isAuthed={isAuthed} className="p-1 rounded hover:bg-gray-100 hover:text-orange-500 transition-colors">
                <ChevronUp className="w-5 h-5" strokeWidth={1.8} />
              </RequireAuthButton>
              <div className="text-sm font-bold text-gray-900">{p.votes}</div>
              <RequireAuthButton isAuthed={isAuthed} className="p-1 rounded hover:bg-gray-100 hover:text-blue-500 transition-colors">
                <ChevronDown className="w-5 h-5" strokeWidth={1.8} />
              </RequireAuthButton>
            </div>

            {/* Content Section */}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                <Link className="hover:text-blue-600 transition-colors" href={`/community/${p.id}`}>
                  {p.title}
                </Link>
              </h2>
              <p className="text-gray-700 mt-2 line-clamp-3 text-sm leading-relaxed">{p.body}</p>
              
              {/* Post metadata */}
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                <span className="hover:underline cursor-pointer">by <strong className="text-blue-600">{p.author}</strong></span>
                <span>•</span>
                <Link href={`/community/${p.id}`} className="hover:underline">
                  {p.commentsCount ?? 0} {(p.commentsCount ?? 0) === 1 ? 'comment' : 'comments'}
                </Link>
                <span>•</span>
                <span>Share</span>
                <span>•</span>
                <span>Save</span>
              </div>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <div className="text-lg font-medium mb-2">No posts yet</div>
            <p>Be the first to start a discussion in the community!</p>
          </div>
        )}
      </div>
    </div>
  );
}
