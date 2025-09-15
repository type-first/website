import React from 'react';

interface ListProps {
  children: React.ReactNode;
  className?: string;
  ordered?: boolean;
}

export function List({ children, className = '', ordered = false }: ListProps) {
  const ListComponent = ordered ? 'ol' : 'ul';
  
  return (
    <ListComponent className={className}>
      {children}
    </ListComponent>
  );
}
