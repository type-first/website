/**
 * Italic/Emphasis inline text component
 * For emphasizing text with italic styling
 */

import React from 'react'

interface ItalicProps {
  children: React.ReactNode
  className?: string
  space?: 'before' | 'after' | 'both' | 'none'
}

export function Italic({ children, className = '', space = 'both' }: ItalicProps) {
  const beforeSpace = space === 'before' || space === 'both' ? ' ' : ''
  const afterSpace = space === 'after' || space === 'both' ? ' ' : ''
  
  return (
    <>
      {beforeSpace}
      <em className={`italic ${className}`}>
        {children}
      </em>
      {afterSpace}
    </>
  )
}