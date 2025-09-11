'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, createContext, useContext, useState } from 'react';

// Mock session context for development when auth isn't configured
type MockSession = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
} | null;

type MockSessionContextType = {
  data: MockSession;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signOut: () => void;
};

const MockSessionContext = createContext<MockSessionContextType>({
  data: null,
  status: 'unauthenticated',
  signOut: () => {},
});

function MockSessionProvider({ children }: { children: ReactNode }) {
  const [session] = useState<MockSession>(null);
  
  const value: MockSessionContextType = {
    data: session,
    status: 'unauthenticated',
    signOut: () => {
      // Mock sign out - do nothing in dev
      console.log('Mock sign out - no action in development');
    },
  };

  return (
    <MockSessionContext.Provider value={value}>
      {children}
    </MockSessionContext.Provider>
  );
}

// Custom hook that works with mock or real session
export function useSessionSafe() {
  // Try to use real NextAuth session first
  try {
    const { useSession } = require('next-auth/react');
    return useSession();
  } catch {
    // Fall back to mock session if NextAuth fails
    return useContext(MockSessionContext);
  }
}

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  // Check if we have auth configured via public env var
  const hasAuth = process.env.NEXT_PUBLIC_GITHUB_AUTH_CONFIGURED === 'true';

  // Use mock provider in development without auth
  if (!hasAuth) {
    return <MockSessionProvider>{children}</MockSessionProvider>;
  }

  // Use real SessionProvider when auth is configured
  return <SessionProvider>{children}</SessionProvider>;
}
