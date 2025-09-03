"use client";

export default function AuthPopupButtons() {
  function openPopup() {
    const w = 520;
    const h = 650;
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
    const left = dualScreenLeft + Math.max(0, (width - w) / 2);
    const top = dualScreenTop + Math.max(0, (height - h) / 2);

    const callbackUrl = new URL('/auth/popup-complete', window.location.origin).toString();
    // In Auth.js v5, direct provider endpoints require POST.
    // Open the built-in sign-in page (GET), which will handle provider POST inside the popup.
    const url = new URL(`/api/auth/signin`, window.location.origin);
    url.searchParams.set('callbackUrl', callbackUrl);

    const popup = window.open(
      url.toString(),
      'auth_popup',
      `scrollbars=yes,width=${w},height=${h},top=${top},left=${left}`
    );
    if (!popup) return;

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if ((event.data as any)?.type === 'auth:complete') {
        window.removeEventListener('message', onMessage);
        try { popup?.close(); } catch {}
        // Refresh to update server components that depend on session
        window.location.reload();
      }
    }

    window.addEventListener('message', onMessage);

    const timer = window.setInterval(() => {
      try {
        if (popup?.closed) {
          clearInterval(timer);
          window.removeEventListener('message', onMessage);
        }
      } catch {
        // ignore cross-origin access errors while navigating
      }
    }, 500);
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => openPopup()} className="text-sm text-gray-600 hover:text-gray-900">
        Sign in with GitHub
      </button>
    </div>
  );
}
