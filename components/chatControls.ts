"use client";

export function openChat() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('chat:open'));
}

export function closeChat() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('chat:close'));
}

export function toggleChat() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('chat:toggle'));
}

