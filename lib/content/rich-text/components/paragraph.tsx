/**
 * Paragraph component
 * For structured paragraph content with break control
 */

import React from 'react'
import { LineBreak } from './line-break'

interface ParagraphProps {
  children: React.ReactNode
  break?: 'before' | 'after' | 'both' | 'none'
}

export function Paragraph({ children, break: breakProp = 'both' }: ParagraphProps) {
  const shouldBreakBefore = breakProp === 'before' || breakProp === 'both'
  const shouldBreakAfter = breakProp === 'after' || breakProp === 'both'
  
  return (
    <>
      {shouldBreakBefore && <LineBreak />}
      <div>
        {children}
      </div>
      {shouldBreakAfter && <LineBreak />}
    </>
  )
}
