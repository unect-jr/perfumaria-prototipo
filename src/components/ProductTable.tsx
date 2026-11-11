import { motion } from 'motion/react'
import type { ItemCatalogo } from '../lib/calc'
import { cn } from '../lib/cn'
import { formatCurrency, formatNumber, formatPercent } from '../lib/format'
import { EASE, STAGGER } from '../lib/motion'
import { Card } from './ui/Card'
import { IconButton } from './ui/IconButton'
import { Tag } from './ui/Tag'

const COLUNAS = [
  { rotulo: 'Estoque', largura: 'w-41.5' },
  { rotulo: 'Valor de compra', largura: 'w-36.5' },
  { rotulo: 'Valor de venda', largura: 'w-36.5' },
  { rotulo: 'Lucro por un.', largura: 'w-34' },
  { rotulo: 'Margem', largura: 'w-21.5' },
]

export function ProductTable({ itens }: { itens: ItemCatalogo[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-surface-muted text-caption leading-normal text-fg-muted">
            <th scope="col" className="py-3 pl-4 font-semibold">
              Produto
            </th>
            {COLUNAS.map((coluna) => (
              <th
                key={coluna.rotulo}
                scope="col"
                className={cn('py-3 pl-4 text-right font-semibold', coluna.largura)}
              >
                {coluna.rotulo}
              </th>
            ))}
            <th scope="col" className="w-17 py-3 pr-4 pl-4">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item, i) => (
            <motion.tr
              key={item.produto.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * STAGGER, duration: 0.25, ease: EASE }}
              className="border-b border-line-subtle text-body leading-normal tabular-nums transition-colors duration-120 ease-out hover:bg-surface-muted"
            >
              <td className="py-3.5 pl-4">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-semibold">{item.produto.nome}</span>
                  <span className="truncate text-label leading-normal text-fg-muted">
                    {item.produto.familiaOlfativa}
                  </span>
                </div>
              </td>
              <td className="py-3.5 pl-4">
                <div className="flex items-center justify-end gap-2">
                  {item.baixo && <Tag tone="baixo">Baixo</Tag>}
                  {formatNumber(item.estoque)}
                </div>
              </td>
              <td className="py-3.5 pl-4 text-right">{formatCurrency(item.custoMedio)}</td>
              <td className="py-3.5 pl-4 text-right">{formatCurrency(item.produto.precoVenda)}</td>
              <td
                className={cn(
                  'py-3.5 pl-4 text-right font-semibold',
                  item.lucroUnitario < 0 ? 'text-danger' : 'text-success',
                )}
              >
                {formatCurrency(item.lucroUnitario)}
              </td>
              <td className={cn('py-3.5 pl-4 text-right', item.margem < 0 && 'text-danger')}>
                {formatPercent(item.margem)}
              </td>
              <td className="py-3.5 pr-4 pl-4">
                <IconButton
                  icon="editar"
                  label={`Editar ${item.produto.nome}`}
                  to={`/produtos/${item.produto.id}`}
                  className="ml-auto"
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
