/**
 * Plain text component
 * For rendering plain text content with optional spacing
 */

import React from 'react'

interface PlainProps {
  children: React.ReactNode
  space?: 'before' | 'after' | 'both' | 'none'
}

export function Plain({ children, space = 'both' }: PlainProps) {
  return (
    <>
      {(space === 'before' || space === 'both') && ' '}
      {children}
      {(space === 'after' || space === 'both') && ' '}
    </>
  )
}
