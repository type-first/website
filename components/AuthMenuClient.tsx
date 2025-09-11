'use client';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import AuthPopupButtons from './AuthPopupButtons';

type Variant = 'inline' | 'sidebar';

export default function AuthMenuClient({ variant = 'inline' }: { variant?: Variant } = {}) {
  const { data: session, status } = useSession();
  const user = session?.user as { name?: string | null; email?: string | null; image?: string | null } | undefined;

  // Show loading state during hydration to prevent mismatch
  if (status === 'loading') {
    return (
      <div className={variant === 'sidebar' 
        ? "flex w-full items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2" 
        : "flex items-center gap-3"
      }>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

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
      <button 
        onClick={() => signOut()}
        className="text-sm text-gray-600 hover:text-gray-900"
        type="button"
      >
        Sign out
      </button>
    </>
  ) : (
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
