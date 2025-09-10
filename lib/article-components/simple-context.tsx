import React, { ReactNode } from 'react';

// Simple server-side rendering without context
export type Modality = undefined | 'markdown';

// Create a global flag for server-side compilation
let currentModality: Modality = undefined;

export function setServerModality(modality: Modality) {
  currentModality = modality;
}

export function getServerModality(): Modality {
  return currentModality;
}

// Simplified components that check the global modality
interface ModalityProviderProps {
  children: ReactNode;
  modality?: Modality;
}

export function ModalityProvider({ children, modality }: ModalityProviderProps) {
  // For server compilation, set the global flag
  if (typeof window === 'undefined') {
    setServerModality(modality);
  }
  
  return <>{children}</>;
}

export function useModality(): Modality {
  // In server environment, use the global flag
  if (typeof window === 'undefined') {
    return getServerModality();
  }
  
  // In client environment, return undefined (for now)
  return undefined;
}

// Convenience components
export const Modality = {
  Markdown: ({ children }: { children: ReactNode }) => (
    <ModalityProvider modality="markdown">{children}</ModalityProvider>
  ),
  HTML: ({ children }: { children: ReactNode }) => (
    <ModalityProvider modality={undefined}>{children}</ModalityProvider>
  )
};
