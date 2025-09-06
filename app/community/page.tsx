import Link from 'next/link';
import { auth } from '@/auth';
import { listCommunityPosts } from '@/lib/db/community';
import RequireAuthButton from '@/components/RequireAuthButton';

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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          New Post
        </RequireAuthButton>
      </div>

      <div className="mt-8 divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
        {posts.map((p) => (
          <div key={p.id} className="p-5 flex gap-4">
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <RequireAuthButton isAuthed={isAuthed} className="p-1 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.5v15M5.25 12l6.75-7.5L18.75 12"/></svg>
              </RequireAuthButton>
              <div className="text-sm font-medium text-gray-900">{p.votes}</div>
              <RequireAuthButton isAuthed={isAuthed} className="p-1 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 19.5v-15M18.75 12 12 19.5 5.25 12"/></svg>
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
