import type { ReactNode } from 'react'
import type { ResumoNovoProduto } from '../lib/calc'
import { cn } from '../lib/cn'
import { formatCurrency, formatNumber, formatPercent } from '../lib/format'
import { AnimatedNumber } from './ui/AnimatedNumber'
import { Card } from './ui/Card'

type ProdutoResumoProps = {
  resumo: ResumoNovoProduto
  quantidade: number
  valorCompra: number
  children: ReactNode
  className?: string
}

export function ProdutoResumo({
  resumo,
  quantidade,
  valorCompra,
  children,
  className,
}: ProdutoResumoProps) {
  const negativo = resumo.lucroUnitario < 0

  return (
    <Card className={cn('relative flex flex-col gap-5 overflow-hidden px-6 py-7', className)}>
      <img
        src="/ilustracoes/laranja.svg"
        alt=""
        width={180}
        height={180}
        className="pointer-events-none absolute -top-15.25 -right-13.5"
      />
      <h2 className="relative text-heading">Resumo</h2>
      <div className="relative flex flex-col gap-3 leading-normal">
        <div className="flex items-center justify-between gap-4">
          <span className="text-body leading-normal text-fg-muted">Lucro por unidade</span>
          <AnimatedNumber
            value={resumo.lucroUnitario}
            format={formatCurrency}
            className={cn(
              'text-body leading-normal font-semibold tabular-nums transition-colors',
              negativo ? 'text-danger' : 'text-success',
            )}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-body leading-normal text-fg-muted">Margem</span>
          <AnimatedNumber
            value={resumo.margem}
            format={formatPercent}
            className={cn(
              'text-body leading-normal font-semibold tabular-nums transition-colors',
              negativo && 'text-danger',
            )}
          />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-2.5">
          <span className="text-heading">Investimento inicial</span>
          <AnimatedNumber
            value={resumo.investimento}
            format={formatCurrency}
            className="text-heading tabular-nums"
          />
        </div>
        <p className="text-caption leading-normal text-fg-muted">
          {formatNumber(quantidade)} un. × {formatCurrency(valorCompra)} (valor de compra)
        </p>
      </div>
      <div className="relative flex gap-3">{children}</div>
    </Card>
  )
}
