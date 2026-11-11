import type { TipoMovimentacao } from '../data/types'
import { Icon } from './ui/Icon'
import { Tag } from './ui/Tag'

export function MovementTag({ tipo }: { tipo: TipoMovimentacao }) {
  return (
    <Tag tone={tipo}>
      <Icon name={tipo} size={14} />
      {tipo === 'venda' ? 'Venda' : 'Compra'}
    </Tag>
  )
}
