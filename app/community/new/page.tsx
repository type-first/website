import Link from 'next/link';
import { auth } from '@/auth';
import RequireAuthButton from '@/components/RequireAuthButton';
import NewPostForm from '@/components/community/NewPostForm';

export const metadata = {
  title: 'New Post – Community',
};

export default async function NewCommunityPostPage() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-6">
        <Link href="/community" className="text-sm text-blue-700 hover:underline">← Back to community</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Create a new post</h1>
      <p className="mt-2 text-gray-600">Share an idea or start a discussion.</p>

      <div className="mt-6">
        {isAuthed ? (
          <NewPostForm />
        ) : (
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <p className="text-gray-700">You need to sign in to create a post.</p>
            <div className="mt-4">
              <RequireAuthButton isAuthed={false} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Sign in to continue
              </RequireAuthButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
