import { motion } from 'motion/react'
import { Link } from 'react-router'
import type { ItemCatalogo } from '../lib/calc'
import { cn } from '../lib/cn'
import { formatCurrency, formatLucroUnitario, formatUnidades } from '../lib/format'
import { Icon } from './ui/Icon'

const MotionLink = motion.create(Link)

export function ProductItem({ item }: { item: ItemCatalogo }) {
  const { produto, estoque, baixo, lucroUnitario } = item
  return (
    <MotionLink
      to={`/produtos/${produto.id}`}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.08, ease: 'easeOut' }}
      className="flex h-16.5 items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-3"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-subtle text-brand">
        <Icon name="produto" size={20} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body font-semibold">{produto.nome}</p>
        <p className={cn('truncate text-caption', baixo ? 'text-warning' : 'text-fg-muted')}>
          {formatUnidades(estoque)}
          {baixo && ' · baixo'}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 whitespace-nowrap tabular-nums">
        <p className="text-body font-semibold">{formatCurrency(produto.precoVenda)}</p>
        <p
          className={cn(
            'text-caption font-medium',
            lucroUnitario < 0 ? 'text-danger' : 'text-success',
          )}
        >
          {formatLucroUnitario(lucroUnitario)}
        </p>
      </div>
    </MotionLink>
  )
}
