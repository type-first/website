import React from 'react';

interface LabStatusProps {
  status: 'active' | 'experimental' | 'archived';
  className?: string;
}

export function LabStatus({ status, className = '' }: LabStatusProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    experimental: {
      label: 'Experimental',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    archived: {
      label: 'Archived',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}
