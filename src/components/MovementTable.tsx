import { motion } from 'motion/react'
import type { LinhaHistorico } from '../lib/calc'
import { cn } from '../lib/cn'
import { formatCurrency, formatDayMonth, formatNumber } from '../lib/format'
import { EASE, STAGGER } from '../lib/motion'
import { MovementTag } from './MovementTag'
import { Card } from './ui/Card'

const COLUNAS_VALOR = [
  { rotulo: 'Qtd.', largura: 'w-19' },
  { rotulo: 'Valor un.', largura: 'w-34' },
  { rotulo: 'Total', largura: 'w-34' },
  { rotulo: 'Lucro', largura: 'w-38 pr-4' },
]

type MovementTableProps = {
  linhas: LinhaHistorico[]
  destaqueId?: string | null
}

export function MovementTable({ linhas, destaqueId }: MovementTableProps) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-surface-muted text-caption leading-normal text-fg-muted">
            <th scope="col" className="w-21.5 py-3 pl-4 font-semibold">
              Data
            </th>
            <th scope="col" className="w-31.5 py-3 pl-4 font-semibold">
              Tipo
            </th>
            <th scope="col" className="py-3 pl-4 font-semibold">
              Produto
            </th>
            {COLUNAS_VALOR.map((coluna) => (
              <th
                key={coluna.rotulo}
                scope="col"
                className={cn('py-3 pl-4 text-right font-semibold', coluna.largura)}
              >
                {coluna.rotulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map(({ movimentacao, produto, total, lucro }, i) => (
            <motion.tr
              key={movimentacao.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 12) * STAGGER, duration: 0.25, ease: EASE }}
              className={cn(
                'border-b border-line-subtle text-body leading-normal tabular-nums transition-colors ease-out',
                movimentacao.id === destaqueId
                  ? 'bg-brand-highlight duration-120'
                  : 'duration-700 hover:bg-surface-muted hover:duration-120',
              )}
            >
              <td className="py-3.5 pl-4">{formatDayMonth(movimentacao.data)}</td>
              <td className="py-3.5 pl-4">
                <MovementTag tipo={movimentacao.tipo} />
              </td>
              <td className="truncate py-3.5 pl-4">{produto?.nome}</td>
              <td className="py-3.5 pl-4 text-right">{formatNumber(movimentacao.quantidade)}</td>
              <td className="py-3.5 pl-4 text-right">{formatCurrency(movimentacao.valorUnitario)}</td>
              <td className="py-3.5 pl-4 text-right">{formatCurrency(total)}</td>
              <td
                className={cn(
                  'py-3.5 pr-4 pl-4 text-right',
                  lucro === null && 'text-fg-muted',
                  lucro !== null && 'font-semibold',
                  lucro !== null && (lucro < 0 ? 'text-danger' : 'text-success'),
                )}
              >
                {lucro === null ? '—' : formatCurrency(lucro)}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
