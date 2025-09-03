import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

// Prefer AUTH_SECRET, but fall back to NEXTAUTH_SECRET for compatibility.
// In development, provide a static fallback to avoid runtime errors.
const secret = process.env.AUTH_SECRET
  || process.env.NEXTAUTH_SECRET
  || (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-me' : undefined);

const ghId = process.env.GITHUB_ID || process.env.AUTH_GITHUB_ID;
const ghSecret = process.env.GITHUB_SECRET || process.env.AUTH_GITHUB_SECRET;
const googleId = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID || process.env.AUTH_GOOGLE_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET || process.env.AUTH_GOOGLE_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ghId && ghSecret ? GitHub({ clientId: ghId, clientSecret: ghSecret }) : GitHub,
    googleId && googleSecret ? Google({ clientId: googleId, clientSecret: googleSecret }) : Google,
  ],
  session: { strategy: 'jwt' },
  trustHost: true,
  secret,
});
