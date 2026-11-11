import { motion } from 'motion/react'
import type { Produto } from '../data/types'
import { cn } from '../lib/cn'
import { pluralUnidade } from '../lib/format'
import { EASE, STAGGER } from '../lib/motion'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Icon } from './ui/Icon'

type LowStockCardProps = {
  itens: { produto: Produto; estoque: number }[]
  onRepor?: (produto: Produto) => void
  className?: string
}

/** Cartão "Estoque baixo" do Painel, com o botão "Repor" por produto. */
export function LowStockCard({ itens, onRepor, className }: LowStockCardProps) {
  return (
    <Card className={cn('flex flex-col gap-2 overflow-hidden p-5', className)}>
      <h3 className="text-heading">Estoque baixo</h3>
      <p className="text-label leading-normal text-fg-muted">
        Produtos que chegaram ao alerta de estoque
      </p>
      <ul className="flex flex-col gap-2">
        {itens.map(({ produto, estoque }, i) => (
          <motion.li
            key={produto.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * STAGGER, duration: 0.25, ease: EASE }}
            className="flex items-start gap-3 border-b border-line-subtle py-3"
          >
            <Icon name="alerta" className="text-warning" />
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-y-2">
              <div className="flex flex-col gap-0.5 leading-normal">
                <p className="text-body leading-normal font-semibold">{produto.nome}</p>
                <p className="text-label leading-normal text-fg-muted">
                  {estoque === 1 ? 'Resta' : 'Restam'} {estoque} {pluralUnidade(estoque)}
                </p>
              </div>
              <Button
                variant="secundario"
                size="sm"
                aria-label={`Repor ${produto.nome}`}
                onClick={() => onRepor?.(produto)}
              >
                Repor
              </Button>
            </div>
          </motion.li>
        ))}
      </ul>
    </Card>
  )
}
