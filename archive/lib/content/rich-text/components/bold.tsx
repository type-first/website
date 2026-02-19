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
  const getMarginClass = () => {
    switch (space) {
      case 'before': return 'ml-1'
      case 'after': return 'mr-1' 
      case 'both': return 'mx-1'
      case 'none': return ''
      default: return 'mx-1'
    }
  }

  return (
    <strong className={`font-semibold ${getMarginClass()} ${className}`}>
      {children}
    </strong>
  )
}
