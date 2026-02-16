import Link from 'next/link';
import { ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import { auth } from '@/modules/auth/config';
import { getCommunityPostBySlug } from '@/modules/db/v0/community';
import RequireAuthButton from '@/modules/auth/components/require-auth-button';
import CommentForm from '@/modules/community/components/comment.form.client';
import CommentThread from '@/modules/community/components/comment-thread';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const post = await getCommunityPostBySlug(id);
  return {
    title: post ? `${post.title} – Community` : 'Post – Community',
  };
}

export default async function PostPage({ params }: Params) {
  const { id } = await params;
  const session = await auth();
  const isAuthed = !!session?.user;
  const post = await getCommunityPostBySlug(id);
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-gray-600">Post not found.</p>
        <Link href="/community" className="text-blue-700 underline mt-4 inline-block">Back to community</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link href="/community" className="text-sm text-blue-600 hover:underline font-medium">
          ← Back to community
        </Link>
      </div>
      
      {/* Main Post Card */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center min-w-[50px] pt-2">
              <RequireAuthButton isAuthed={isAuthed} className="p-2 rounded hover:bg-gray-100 hover:text-orange-500 transition-colors">
                <ChevronUp className="w-6 h-6" strokeWidth={2} />
              </RequireAuthButton>
              <div className="text-lg font-bold text-gray-900 py-1">{post.votes}</div>
              <RequireAuthButton isAuthed={isAuthed} className="p-2 rounded hover:bg-gray-100 hover:text-blue-500 transition-colors">
                <ChevronDown className="w-6 h-6" strokeWidth={2} />
              </RequireAuthButton>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h1>
              <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
                <span>Posted by</span>
                <span className="font-medium text-blue-600 hover:underline cursor-pointer">{post.author}</span>
                <span className="text-gray-400">•</span>
                <span>2 hours ago</span>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.body}</div>
            </div>
          </div>

          {/* Post Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments.length} comments</span>
            </span>
            <button className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              Share
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              Save
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              Hide
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Comments ({post.comments.length})
          </h2>
        </div>
        
        <div className="p-4">
          {/* Add Comment Form */}
          {isAuthed ? (
            <div className="mb-6">
              <CommentForm postSlug={post.id} />
            </div>
          ) : (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
              <p className="text-gray-600 mb-3">Sign in to leave a comment</p>
              <RequireAuthButton isAuthed={false} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium">
                Sign In
              </RequireAuthButton>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map(comment => (
              <CommentThread
                key={comment.id}
                comment={comment}
                postSlug={post.id}
                isAuthed={isAuthed}
              />
            ))}
            {post.comments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <div className="text-lg font-medium mb-2">No comments yet</div>
                <p>Be the first to start the discussion!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
