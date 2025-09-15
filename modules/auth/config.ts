import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

// Prefer AUTH_SECRET, but fall back to NEXTAUTH_SECRET for compatibility.
// In development, provide a static fallback to avoid runtime errors.
const secret = process.env.AUTH_SECRET
  || process.env.NEXTAUTH_SECRET
  || (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-me' : undefined);

const ghId = process.env.GITHUB_ID || process.env.AUTH_GITHUB_ID;
const ghSecret = process.env.GITHUB_SECRET || process.env.AUTH_GITHUB_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Add GitHub provider with the credentials from .env.local
    GitHub({ 
      clientId: ghId!, 
      clientSecret: ghSecret! 
    }),
  ],
  session: { strategy: 'jwt' },
  trustHost: true,
  secret,
  pages: {
    // Custom pages to handle missing providers gracefully
    signIn: '/auth/signin',
    error: '/auth/error',
  },
});
