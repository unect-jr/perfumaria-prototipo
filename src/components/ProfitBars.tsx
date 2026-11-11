import { motion } from 'motion/react'
import { cn } from '../lib/cn'
import { formatNumber } from '../lib/format'
import { EASE, STAGGER } from '../lib/motion'
import { Card } from './ui/Card'

/** Altura da maior barra no Figma: gráfico de 216px menos rótulos e espaçamentos. */
const ALTURA_MAX_BARRA = 170

type Barra = { chave: string; rotulo: string; valor: number; atual: boolean }

/** Cartão "Lucro por mês": barras feitas à mão, a do mês corrente em destaque. */
export function ProfitBars({ barras, className }: { barras: Barra[]; className?: string }) {
  const maximo = Math.max(0, ...barras.map((b) => b.valor))

  return (
    <Card className={cn('flex flex-col gap-5 p-5', className)}>
      <div className="flex flex-col gap-1">
        <h3 className="text-heading">Lucro por mês</h3>
        <p className="text-label leading-normal text-fg-muted">Últimos 6 meses (R$)</p>
      </div>
      <ol className="flex h-54 items-end gap-2">
        {barras.map((barra, i) => {
          const altura = maximo > 0 ? (Math.max(0, barra.valor) / maximo) * ALTURA_MAX_BARRA : 0
          return (
            <li key={barra.chave} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span
                className={cn(
                  'text-caption leading-normal font-medium tabular-nums',
                  barra.valor < 0 ? 'text-danger' : 'text-fg-muted',
                )}
              >
                {formatNumber(barra.valor)}
              </span>
              <motion.div
                aria-hidden="true"
                className={cn(
                  'w-full max-w-18 origin-bottom rounded-t-sm transition-[height] duration-300 ease-out',
                  barra.atual ? 'bg-brand' : 'bg-brand-soft',
                )}
                style={{ height: altura }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * STAGGER * 1.5, duration: 0.4, ease: EASE }}
              />
              <span className="text-caption leading-normal text-fg-muted">{barra.rotulo}</span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
