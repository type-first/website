import { auth, signIn, signOut } from '@/auth';

export default async function AuthMenu() {
  const session = await auth();
  const user = session?.user as { name?: string | null; email?: string | null; image?: string | null } | undefined;

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <div className="flex items-center gap-2">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name || 'User'} className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200" />
            )}
            <span className="text-sm text-gray-700 max-w-[12rem] truncate">{user.name || user.email}</span>
          </div>
          <form action={async () => { 'use server'; await signOut(); }}>
            <button className="text-sm text-gray-600 hover:text-gray-900" type="submit">Sign out</button>
          </form>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <form action={async () => { 'use server'; await signIn('github'); }}>
            <button type="submit" className="text-sm text-gray-600 hover:text-gray-900">Sign in with GitHub</button>
          </form>
          <span className="text-gray-300">|</span>
          <form action={async () => { 'use server'; await signIn('google'); }}>
            <button type="submit" className="text-sm text-gray-600 hover:text-gray-900">Sign in with Google</button>
          </form>
        </div>
      )}
    </div>
  );
}

