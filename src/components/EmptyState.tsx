import type { ReactNode } from 'react'
import { Card } from './ui/Card'

export function EmptyState({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <img src="/ilustracoes/frascos.svg" alt="" width={86} height={60} />
      <p className="text-body font-semibold">{titulo}</p>
      {children}
    </Card>
  )
}
