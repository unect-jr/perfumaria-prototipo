import { cn } from '../../lib/cn'
import { formatNumber } from '../../lib/format'
import { IconButton } from './IconButton'

const PAGINAS_VISIVEIS = 5

function getJanela(pagina: number, totalPaginas: number): number[] {
  const tamanho = Math.min(PAGINAS_VISIVEIS, totalPaginas)
  const inicio = Math.min(
    Math.max(1, pagina - Math.floor(tamanho / 2)),
    totalPaginas - tamanho + 1,
  )
  return Array.from({ length: tamanho }, (_, i) => inicio + i)
}

type PaginationProps = {
  pagina: number
  porPagina: number
  total: number
  rotulo: string
  onChange: (pagina: number) => void
  className?: string
}

export function Pagination({ pagina, porPagina, total, rotulo, onChange, className }: PaginationProps) {
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina))
  if (totalPaginas <= 1) return null

  const primeiro = (pagina - 1) * porPagina + 1
  const ultimo = Math.min(pagina * porPagina, total)

  return (
    <nav
      aria-label="Paginação"
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
    >
      <p className="text-label text-fg-muted tabular-nums">
        {`${formatNumber(primeiro)}–${formatNumber(ultimo)} de ${formatNumber(total)} ${rotulo}`}
      </p>
      <div className="flex items-center gap-1.5">
        <IconButton
          icon="voltar"
          label="Página anterior"
          disabled={pagina === 1}
          onClick={() => onChange(pagina - 1)}
        />
        {getJanela(pagina, totalPaginas).map((numero) => {
          const atual = numero === pagina
          return (
            <button
              key={numero}
              type="button"
              aria-label={`Página ${numero}`}
              aria-current={atual ? 'page' : undefined}
              onClick={() => onChange(numero)}
              className={cn(
                'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-label tabular-nums transition-colors duration-120 ease-out',
                atual
                  ? 'bg-brand-subtle font-semibold text-brand'
                  : 'text-fg-muted hover:bg-surface hover:text-fg',
              )}
            >
              {numero}
            </button>
          )
        })}
        <IconButton
          icon="avancar"
          label="Próxima página"
          disabled={pagina === totalPaginas}
          onClick={() => onChange(pagina + 1)}
        />
      </div>
    </nav>
  )
}
