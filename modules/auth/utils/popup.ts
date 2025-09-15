/**
 * Opens auth popup window with proper positioning and messaging
 */
export function openAuthPopup() {
  const w = 520;
  const h = 650;
  const dualScreenLeft = (window as any).screenLeft ?? window.screenX;
  const dualScreenTop = (window as any).screenTop ?? window.screenY;
  const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const left = dualScreenLeft + Math.max(0, (width - w) / 2);
  const top = dualScreenTop + Math.max(0, (height - h) / 2);
  
  const url = new URL(`/auth/start-github.html`, window.location.origin);
  
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
      window.location.reload();
    }
  }
  
  window.addEventListener('message', onMessage);
  
  // Monitor popup close
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
