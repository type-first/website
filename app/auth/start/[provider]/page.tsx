"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function AuthStartProviderPage() {
  const params = useParams<{ provider: string }>();
  const provider = (params?.provider || '').toString();

  useEffect(() => {
    (async () => {
      const valid = provider === 'github';
      const action = valid ? `/api/auth/signin/${provider}` : '/api/auth/signin';
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = action;
      form.style.display = 'none';
      form.target = '_self';

      // callback url hidden input
      const cb = document.createElement('input');
      cb.type = 'hidden';
      cb.name = 'callbackUrl';
      cb.value = new URL('/auth/complete.html', window.location.origin).toString();
      form.appendChild(cb);

      // Fetch CSRF token and include it if present
      try {
        const res = await fetch('/api/auth/csrf', { credentials: 'same-origin' });
        if (res.ok) {
          const data: any = await res.json();
          const token = data?.csrfToken || data?.csrf || data?.token;
          if (typeof token === 'string' && token.length > 0) {
            const csrf = document.createElement('input');
            csrf.type = 'hidden';
            csrf.name = 'csrfToken';
            csrf.value = token;
            form.appendChild(csrf);
          }
        }
      } catch {
        // If csrf fetch fails, let Auth.js handle defaults (may still work depending on config)
      }

      document.body.appendChild(form);
      form.submit();
    })();
  }, [provider]);

  return (
    <div className="p-6 text-sm text-gray-700">
      Redirecting to provider…
      <noscript>
        <p>
          JavaScript is required. Continue to
          <a href="/api/auth/signin" className="underline"> sign in</a>.
        </p>
      </noscript>
    </div>
  );
}
