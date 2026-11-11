import { cn } from '../lib/cn'
import { AnimatedNumber } from './ui/AnimatedNumber'
import { Card } from './ui/Card'

type StatCardProps = {
  rotulo: string
  valor: number
  format: (valor: number) => string
  /** Alerta = laranja (estoque baixo). */
  tom?: 'padrao' | 'alerta'
}

/** Card de número do Início (mobile), usado em grade de 2 colunas. */
export function StatCard({ rotulo, valor, format, tom = 'padrao' }: StatCardProps) {
  return (
    <Card className="flex h-18 min-w-0 flex-col gap-1 p-3.5 whitespace-nowrap">
      <p className="text-caption font-medium text-fg-muted">{rotulo}</p>
      <AnimatedNumber
        value={valor}
        format={format}
        className={cn('text-stat tabular-nums', tom === 'alerta' && 'text-warning')}
      />
    </Card>
  )
}
