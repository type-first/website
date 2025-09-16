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
  space?: 'before' | 'after' | 'both' | 'none'
}

export function InlineCode({ children, syntax, className = '', space = 'both' }: InlineCodeProps) {
  const beforeSpace = space === 'before' || space === 'both' ? ' ' : ''
  const afterSpace = space === 'after' || space === 'both' ? ' ' : ''
  
  return (
    <>
      {beforeSpace}
      <code className={`bg-gray-100 px-1 py-0.5 rounded text-sm font-mono ${className}`}>
        {children}
      </code>
      {afterSpace}
    </>
  )
}
