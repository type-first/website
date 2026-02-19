'use client';

import AuthProvider from './auth-provider';
import AuthMenu from './auth-menu';

type Variant = 'inline' | 'sidebar' | 'avatar';

export default function AuthWrapper({ variant = 'inline' }: { variant?: Variant } = {}) {
  return (
    <AuthProvider>
      <AuthMenu variant={variant} />
    </AuthProvider>
  );
}
