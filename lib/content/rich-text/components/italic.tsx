/**
 * Italic/Emphasis inline text component
 * For emphasizing text with italic styling
 */

import React from 'react'

interface ItalicProps {
  children: React.ReactNode
  className?: string
}

export function Italic({ children, className = '' }: ItalicProps) {
  return (
    <>
      {' '}
      <em className={`italic mx-1 ${className}`}>
        {children}
      </em>
      {' '}
    </>
  )
}