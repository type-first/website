/**
 * Inline code component
 * For highlighting code snippets, types, and technical terms
 */

import React from 'react'

export type CodeSyntax = 'typescript' | 'javascript' | 'json' | 'bash' | 'yaml'

interface InlineCodeProps {
  children: React.ReactNode
  syntax?: CodeSyntax
  className?: string
}

export function InlineCode({ children, syntax, className = '' }: InlineCodeProps) {
  return (
    <>
      {' '}
      <code className={`bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-sm font-mono font-medium border border-blue-200 mx-1 ${className}`}>
        {children}
      </code>
      {' '}
    </>
  )
}
