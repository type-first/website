"use client";

// Chat state management
let chatState = { isOpen: false };
const subscribers = new Set<(isOpen: boolean) => void>();

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

// Subscribe to chat state changes
export function subscribeToChatState(callback: (isOpen: boolean) => void) {
  if (typeof window === 'undefined') return () => {};
  
  subscribers.add(callback);
  // Send current state immediately
  callback(chatState.isOpen);
  
  return () => {
    subscribers.delete(callback);
  };
}

// Internal function to update chat state and notify subscribers
export function updateChatState(isOpen: boolean) {
  if (typeof window === 'undefined') return;
  
  chatState.isOpen = isOpen;
  subscribers.forEach(callback => callback(isOpen));
}

