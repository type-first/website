'use client';

import { SessionProvider } from 'next-auth/react';
import AuthMenu from './AuthMenu';

type Variant = 'inline' | 'sidebar';

export default function AuthWrapper({ variant = 'inline' }: { variant?: Variant } = {}) {
  return (
    <SessionProvider>
      <AuthMenu variant={variant} />
    </SessionProvider>
  );
}
