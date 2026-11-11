import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

/** Cartão branco com borda e cantos arredondados (radius-lg). */
export function Card({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn('rounded-lg border border-line bg-surface', className)} {...rest} />
}
