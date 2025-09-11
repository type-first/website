'use client';

import AuthProvider from './AuthProvider';
import AuthMenu from './AuthMenu';

type Variant = 'inline' | 'sidebar';

export default function AuthWrapper({ variant = 'inline' }: { variant?: Variant } = {}) {
  return (
    <AuthProvider>
      <AuthMenu variant={variant} />
    </AuthProvider>
  );
}
