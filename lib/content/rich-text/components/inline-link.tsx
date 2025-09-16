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
  space?: 'before' | 'after' | 'both' | 'none'
}

export function InlineLink({ href, children, className = '', external, space = 'both' }: InlineLinkProps) {
  const baseClasses = 'text-blue-600 hover:text-blue-800 underline'
  const finalClasses = `${baseClasses} ${className}`
  
  const beforeSpace = space === 'before' || space === 'both' ? ' ' : ''
  const afterSpace = space === 'after' || space === 'both' ? ' ' : ''
  
  const isExternal = external || href.startsWith('http')
  
  if (isExternal) {
    return (
      <>
        {beforeSpace}
        <a 
          href={href} 
          className={finalClasses}
          target="_blank" 
          rel="noopener noreferrer"
        >
          {children}
        </a>
        {afterSpace}
      </>
    )
  }
  
  return (
    <>
      {beforeSpace}
      <NextLink href={href} className={finalClasses}>
        {children}
      </NextLink>
      {afterSpace}
    </>
  )
}
