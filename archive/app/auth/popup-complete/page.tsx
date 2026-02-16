"use client";

import { useEffect } from 'react';

export default function PopupCompletePage() {
  useEffect(() => {
    try {
      // Notify opener and close the popup
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'auth:complete' }, window.location.origin);
      }
      window.close();
    } catch {
      // If unable to close, leave a fallback
    }
  }, []);

  return (
    <div className="p-6 text-sm text-gray-700">
      Authentication complete. You can close this window.
    </div>
  );
}

