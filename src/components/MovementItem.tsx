import type { TipoMovimentacao } from '../data/types'
import { cn } from '../lib/cn'
import { formatCurrency, formatRelativeDay, formatSignedCurrency, formatUnidades } from '../lib/format'
import { Card } from './ui/Card'
import { Icon } from './ui/Icon'

type MovementItemProps = {
  tipo: TipoMovimentacao
  nomeProduto: string
  quantidade: number
  data: string
  total: number
  /** Lucro da venda; compras mostram "investido". */
  lucro: number | null
}

/** Linha de compra/venda (mobile). Venda mostra o lucro em verde; compra mostra "investido". */
export function MovementItem({ tipo, nomeProduto, quantidade, data, total, lucro }: MovementItemProps) {
  const venda = tipo === 'venda'
  return (
    <Card className="flex h-16.5 items-center gap-3 px-3.5 py-3">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-md',
          venda ? 'bg-success-subtle text-success' : 'bg-brand-subtle text-brand',
        )}
      >
        <Icon name={venda ? 'venda' : 'compra'} size={20} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body font-semibold">{nomeProduto}</p>
        <p className="truncate text-caption text-fg-muted">
          {venda ? 'Venda' : 'Compra'} · {formatUnidades(quantidade)} · {formatRelativeDay(data)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 whitespace-nowrap tabular-nums">
        <p className="text-body font-semibold">{formatCurrency(total)}</p>
        {lucro === null ? (
          <p className="text-caption font-medium text-fg-muted">investido</p>
        ) : (
          <p className={cn('text-caption font-medium', lucro < 0 ? 'text-danger' : 'text-success')}>
            {formatSignedCurrency(lucro)}
          </p>
        )}
      </div>
    </Card>
  )
}
