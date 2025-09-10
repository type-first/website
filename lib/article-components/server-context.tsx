import React, { ReactNode } from 'react';

export type Modality = undefined | 'markdown';

interface ModalityContextType {
  modality: Modality;
}

// Server-compatible context (no "use client" directive)
const ModalityContext = React.createContext<ModalityContextType>({ modality: undefined });

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
  const context = React.useContext(ModalityContext);
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
