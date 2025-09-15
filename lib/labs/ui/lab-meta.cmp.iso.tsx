import React from 'react';

interface LabMetaProps {
  addedAt?: Date;
  status?: 'active' | 'experimental' | 'archived';
  className?: string;
}

export function LabMeta({ addedAt, status, className = '' }: LabMetaProps) {
  return (
    <div className={`flex items-center gap-3 text-sm text-gray-500 ${className}`}>
      {addedAt && (
        <time dateTime={addedAt.toISOString()}>
          Added {addedAt.toLocaleDateString()}
        </time>
      )}
      {status && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          status === 'active' 
            ? 'bg-green-100 text-green-800'
            : status === 'experimental'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )}
    </div>
  );
}
