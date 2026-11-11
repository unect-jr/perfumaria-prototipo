import { motion } from 'motion/react'
import { useId, useRef, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'

type SegmentedProps<T extends string> = {
  label: string
  opcoes: readonly { valor: T; rotulo: string }[]
  valor: T
  onChange: (valor: T) => void
  className?: string
}

export function Segmented<T extends string>({
  label,
  opcoes,
  valor,
  onChange,
  className,
}: SegmentedProps<T>) {
  const indicadorId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const navegar = (e: KeyboardEvent, indice: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const passo = e.key === 'ArrowRight' ? 1 : -1
    const proximo = (indice + passo + opcoes.length) % opcoes.length
    onChange(opcoes[proximo].valor)
    refs.current[proximo]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('grid h-11 grid-flow-col auto-cols-fr rounded-lg bg-surface-subtle p-1', className)}
    >
      {opcoes.map((opcao, i) => {
        const ativo = opcao.valor === valor
        return (
          <button
            key={opcao.valor}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            aria-selected={ativo}
            tabIndex={ativo ? 0 : -1}
            onClick={() => onChange(opcao.valor)}
            onKeyDown={(e) => navegar(e, i)}
            className={cn(
              'relative flex cursor-pointer items-center justify-center rounded-md text-body transition-colors duration-120 ease-out',
              ativo ? 'font-semibold text-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {ativo && (
              <motion.span
                layoutId={indicadorId}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="absolute inset-0 rounded-md bg-surface shadow-subtle"
              />
            )}
            <span className="relative">{opcao.rotulo}</span>
          </button>
        )
      })}
    </div>
  )
}
