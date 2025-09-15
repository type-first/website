import React from 'react';

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function ListItem({ children, className = '' }: ListItemProps) {
  return (
    <li className={className}>
      {children}
    </li>
  );
}
