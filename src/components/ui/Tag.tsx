import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

const TONES = {
  baixo: 'bg-warning-subtle text-warning',
  venda: 'bg-success-subtle text-success',
  compra: 'bg-brand-subtle text-brand',
}

export function Tag({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-caption font-semibold whitespace-nowrap',
        TONES[tone],
      )}
    >
      {children}
    </span>
  )
}
