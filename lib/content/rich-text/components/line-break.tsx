/**
 * Line break component
 * For paragraph breaks and soft breaks within content
 */

import React from 'react'

interface LineBreakProps {
  soft?: boolean
}

export function LineBreak({ soft = false }: LineBreakProps) {
  if (soft) {
    return <br />
  }
  
  return (
    <>
      <br />
      <br />
    </>
  )
}
