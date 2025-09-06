import Link from 'next/link';
import { auth } from '@/auth';
import { getCommunityPostBySlug } from '@/lib/db/community';
import RequireAuthButton from '@/components/RequireAuthButton';
import CommentForm from '@/components/community/CommentForm';

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params) {
  const post = await getCommunityPostBySlug(params.id);
  return {
    title: post ? `${post.title} – Community` : 'Post – Community',
  };
}

export default async function PostPage({ params }: Params) {
  const session = await auth();
  const isAuthed = !!session?.user;
  const post = await getCommunityPostBySlug(params.id);
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-gray-600">Post not found.</p>
        <Link href="/community" className="text-blue-700 underline mt-4 inline-block">Back to community</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-6">
        <Link href="/community" className="text-sm text-blue-700 hover:underline">← Back to community</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
      <div className="mt-2 text-sm text-gray-500">by {post.author}</div>
      <p className="mt-4 text-gray-800 whitespace-pre-wrap">{post.body}</p>

      <div className="mt-6 flex items-center gap-3">
        <RequireAuthButton isAuthed={isAuthed} className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
          Upvote
        </RequireAuthButton>
        <RequireAuthButton isAuthed={isAuthed} className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
          Downvote
        </RequireAuthButton>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Discussion ({post.comments.length})</h2>
        <div className="mt-4 space-y-4">
          {post.comments.map(c => (
            <div key={c.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="text-sm text-gray-500">{c.author}</div>
              <p className="text-gray-800 mt-1">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          {isAuthed ? (
            <CommentForm postSlug={post.id} />
          ) : (
            <RequireAuthButton isAuthed={false} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Write a comment
            </RequireAuthButton>
          )}
        </div>
      </section>
    </div>
  );
}
