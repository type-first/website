/**
 * Bold/Strong inline text component
 * For emphasizing important text within paragraphs
 */

import React from 'react'

interface BoldProps {
  children: React.ReactNode
  className?: string
}

export function Bold({ children, className = '' }: BoldProps) {
  return (
    <>
      {' '}
      <strong className={`font-semibold mx-1 ${className}`}>
        {children}
      </strong>
      {' '}
    </>
  )
}
