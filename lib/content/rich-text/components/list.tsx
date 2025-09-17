/**
 * List component
 * For structured bullet point lists with soft line breaks
 */

import React from 'react'
import { LineBreak } from './line-break'

interface ListProps {
  children: React.ReactNode
  break?: 'before' | 'after' | 'both' | 'none'
}

export function List({ children, break: breakProp = 'both' }: ListProps) {
  const shouldBreakBefore = breakProp === 'before' || breakProp === 'both'
  const shouldBreakAfter = breakProp === 'after' || breakProp === 'both'
  
  return (
    <>
      {shouldBreakBefore && <LineBreak soft />}
      <div>
        {children}
      </div>
      {shouldBreakAfter && <LineBreak soft />}
    </>
  )
}

interface ListItemProps {
  children: React.ReactNode
  label?: string
  marker?: 'bullet' | 'number'
}

export function ListItem({ children, label, marker = 'bullet' }: ListItemProps) {
  const markerSymbol = marker === 'bullet' ? '• ' : '1. '
  const keySegment = label ? `${label}: ` : ''
  return (
    <>
      <>{markerSymbol}</>
      <>{keySegment}</>
      <>{children}</>
      <LineBreak soft />
    </>
  )
}
