import { motion } from 'motion/react'
import type { ItemRanking } from '../lib/calc'
import { cn } from '../lib/cn'
import { formatCurrency, formatNumber } from '../lib/format'
import { EASE, STAGGER } from '../lib/motion'
import { Card } from './ui/Card'

// Colunas numéricas: 100px e 160px de conteúdo no Figma + 16px de espaço entre colunas.
const TH = 'px-2 py-3 text-caption leading-normal font-semibold text-fg-muted first:pl-4 last:pr-4'
const TD = 'px-2 py-3.5 text-body leading-normal tabular-nums first:pl-4 last:pr-4'

/** Tabela "Produtos que mais deram lucro" do Painel (web). */
export function ProfitRanking({ itens, className }: { itens: ItemRanking[]; className?: string }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <h3 className="px-5 pt-5 pb-3 text-heading">Produtos que mais deram lucro</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-xl border-collapse text-left">
          <thead className="bg-surface-muted">
            <tr className="border-b border-line">
              <th scope="col" className={TH}>Produto</th>
              <th scope="col" className={cn(TH, 'w-29 text-right')}>Unidades</th>
              <th scope="col" className={cn(TH, 'w-44 text-right')}>Total vendido</th>
              <th scope="col" className={cn(TH, 'w-44 text-right')}>Lucro</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, i) => (
              <motion.tr
                key={item.produto.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * STAGGER, duration: 0.25, ease: EASE }}
                className="border-b border-line-subtle"
              >
                <td className={TD}>{item.produto.nome}</td>
                <td className={cn(TD, 'text-right')}>{formatNumber(item.unidades)}</td>
                <td className={cn(TD, 'text-right')}>{formatCurrency(item.total)}</td>
                <td
                  className={cn(
                    TD,
                    'text-right font-semibold',
                    item.lucro < 0 ? 'text-danger' : 'text-success',
                  )}
                >
                  {formatCurrency(item.lucro)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
