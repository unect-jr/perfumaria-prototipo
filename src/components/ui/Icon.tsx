import { cn } from '../../lib/cn'

export type IconName = 'painel' | 'produto' | 'movimentacoes' | 'compra' | 'venda' | 'alerta'

/**
 * Ícone exportado do Figma (public/icons). Renderizado como máscara para herdar a cor
 * do texto (`currentColor`): use classes `text-*` para colorir.
 */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const mask = `url(/icons/${name}.svg) center / contain no-repeat`
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block size-4.5 shrink-0 bg-current', className)}
      style={{ mask, WebkitMask: mask }}
    />
  )
}
