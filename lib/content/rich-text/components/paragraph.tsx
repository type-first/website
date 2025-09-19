/**
 * Paragraph component
 * For structured paragraph content with CSS-only spacing
 */

import React from 'react'

interface ParagraphProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'lead' | 'small'
}

export function Paragraph({ 
  children, 
  className = '',
  variant = 'default'
}: ParagraphProps) {
  const variantClasses = {
    default: 'text-gray-700 text-lg leading-relaxed',
    lead: 'text-xl text-gray-800 leading-relaxed font-light',
    small: 'text-base text-gray-600 leading-relaxed'
  }
  
  return (
    <p className={`${variantClasses[variant]} mb-4 ${className}`}>
      {children}
    </p>
  )
}
