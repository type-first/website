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
    <em className={`italic ${getMarginClass()} ${className}`}>
      {children}
    </em>
  )
}