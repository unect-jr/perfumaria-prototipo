import { cn } from '../../lib/cn'

export type IconName =
  | 'painel'
  | 'inicio'
  | 'produto'
  | 'movimentacoes'
  | 'compra'
  | 'venda'
  | 'alerta'
  | 'plus'

/**
 * Tamanhos exportados do Figma. O traço é 1.75 em cada tamanho, por isso há um arquivo
 * por tamanho: 18 em public/icons, 20 e 22 em public/icons/20 e public/icons/22.
 */
export type IconSize = 18 | 20 | 22

const SIZE_CLASS: Record<IconSize, string> = {
  18: 'size-4.5',
  20: 'size-5',
  22: 'size-5.5',
}

/**
 * Ícone exportado do Figma, renderizado como máscara para herdar a cor do texto
 * (`currentColor`): use classes `text-*` para colorir.
 */
export function Icon({
  name,
  size = 18,
  className,
}: {
  name: IconName
  size?: IconSize
  className?: string
}) {
  const src = size === 18 ? `/icons/${name}.svg` : `/icons/${size}/${name}.svg`
  const mask = `url(${src}) center / contain no-repeat`
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0 bg-current', SIZE_CLASS[size], className)}
      style={{ mask, WebkitMask: mask }}
    />
  )
}
