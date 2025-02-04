'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface ConditionalRenderProps {
  excludePaths: string[]
  children: ReactNode
}

export function ConditionalRender({ excludePaths, children }: ConditionalRenderProps) {
  const pathname = usePathname()

  if (excludePaths.includes(pathname)) {
    return null
  }

  return <>{children}</>
}

