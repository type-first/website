import { auth, signOut } from '@/auth';
import AuthPopupButtons from './AuthPopupButtons';

type Variant = 'inline' | 'sidebar';

export default async function AuthMenu({ variant = 'inline' }: { variant?: Variant } = {}) {
  const session = await auth();
  const user = session?.user as { name?: string | null; email?: string | null; image?: string | null } | undefined;
  // Client popup buttons are a client component, imported directly

  const content = user ? (
    <>
      <div className="flex items-center gap-2 min-w-0">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name || 'User'} className="w-6 h-6 rounded-full flex-none" />
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
  );

  if (variant === 'sidebar') {
    return (
      <div className="flex w-full items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2">
        {content}
      </div>
    );
  }

  return <div className="flex items-center gap-3">{content}</div>;
}
