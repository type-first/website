/**
 * Inline link component
 * For links within text content (internal and external)
 */

import React from 'react'
import NextLink from 'next/link'

interface InlineLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

export function InlineLink({ href, children, className = '', external }: InlineLinkProps) {
  const baseClasses = 'text-blue-600 hover:text-blue-800 underline mx-1'
  const finalClasses = `${baseClasses} ${className}`
  
  const isExternal = external || href.startsWith('http')
  
  if (isExternal) {
    return (
      <>
        {' '}
        <a 
          href={href} 
          className={finalClasses}
          target="_blank" 
          rel="noopener noreferrer"
        >
          {children}
        </a>
        {' '}
      </>
    )
  }
  
  return (
    <>
      {' '}
      <NextLink href={href} className={finalClasses}>
        {children}
      </NextLink>
      {' '}
    </>
  )
}
