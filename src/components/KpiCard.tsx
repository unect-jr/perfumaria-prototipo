import { cn } from '../lib/cn'
import { AnimatedNumber } from './ui/AnimatedNumber'
import { Card } from './ui/Card'

type KpiCardProps = {
  rotulo: string
  valor: number
  format: (valor: number) => string
  detalhe: string
  /** Positivo: lucro em verde com os frascos ao fundo. Negativo: valor em vermelho. */
  tom?: 'neutro' | 'positivo' | 'negativo'
}

/** Indicador do Painel (web): rótulo, valor (Display/KPI) e detalhe. */
export function KpiCard({ rotulo, valor, format, detalhe, tom = 'neutro' }: KpiCardProps) {
  return (
    <Card className="relative flex flex-col gap-1.5 overflow-hidden p-4 whitespace-nowrap transition-shadow duration-200 hover:shadow-card">
      {tom === 'positivo' && (
        <img
          src="/ilustracoes/frascos.svg"
          alt=""
          width={86}
          height={60}
          className="pointer-events-none absolute -right-1.25 -bottom-1.75"
        />
      )}
      <p className="text-label leading-4 font-medium text-fg-muted">{rotulo}</p>
      <AnimatedNumber
        value={valor}
        format={format}
        className={cn(
          'text-kpi tabular-nums',
          tom === 'positivo' && 'text-success',
          tom === 'negativo' && 'text-danger',
        )}
      />
      <p className="text-caption text-fg-muted">{detalhe}</p>
    </Card>
  )
}
