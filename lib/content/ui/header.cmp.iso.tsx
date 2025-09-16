import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function Header({ children, className = '' }: HeaderProps) {
  return (
    <header className={className}>
      {children}
    </header>
  );
}
