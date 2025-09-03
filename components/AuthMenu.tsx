import { auth, signOut } from '@/auth';
import dynamic from 'next/dynamic';

export default async function AuthMenu() {
  const session = await auth();
  const user = session?.user as { name?: string | null; email?: string | null; image?: string | null } | undefined;
  const AuthPopupButtons = dynamic(() => import('./AuthPopupButtons'), { ssr: false });

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
        // Client-side popup buttons
        <AuthPopupButtons />
      )}
    </div>
  );
}
