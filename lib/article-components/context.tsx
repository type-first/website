"use client";

import React, { createContext, useContext, ReactNode } from 'react';

type Modality = undefined | 'markdown';

interface ModalityContextType {
  modality: Modality;
}

const ModalityContext = createContext<ModalityContextType>({ modality: undefined });

interface ModalityProviderProps {
  children: ReactNode;
  modality?: Modality;
}

export function ModalityProvider({ children, modality }: ModalityProviderProps) {
  return (
    <ModalityContext.Provider value={{ modality }}>
      {children}
    </ModalityContext.Provider>
  );
}

export function useModality(): Modality {
  const context = useContext(ModalityContext);
  return context.modality;
}

// Convenience components for cleaner usage
export const Modality = {
  Markdown: ({ children }: { children: ReactNode }) => (
    <ModalityProvider modality="markdown">{children}</ModalityProvider>
  ),
  HTML: ({ children }: { children: ReactNode }) => (
    <ModalityProvider modality={undefined}>{children}</ModalityProvider>
  )
};

// Base interface for multimodal components
export interface MultiModalComponent {
  renderAsHtml(): ReactNode;
  renderAsMarkdown(): string;
  renderAsPlaintext(): string;
  renderAsJson(): object;
}
