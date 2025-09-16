/**
 * Bold/Strong inline text component
 * For emphasizing important text within paragraphs
 */

import React from 'react'

interface BoldProps {
  children: React.ReactNode
  className?: string
  space?: 'before' | 'after' | 'both' | 'none'
}

export function Bold({ children, className = '', space = 'both' }: BoldProps) {
  const beforeSpace = space === 'before' || space === 'both' ? ' ' : ''
  const afterSpace = space === 'after' || space === 'both' ? ' ' : ''
  
  return (
    <>
      {beforeSpace}
      <strong className={`font-semibold ${className}`}>
        {children}
      </strong>
      {afterSpace}
    </>
  )
}
