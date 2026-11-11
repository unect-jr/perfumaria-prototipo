import { useAnimate } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import type { ResumoCompra, ResumoVenda } from '../lib/calc'
import { cn } from '../lib/cn'
import { formatCurrency, formatNumber, formatUnidades } from '../lib/format'
import { AnimatedNumber } from './ui/AnimatedNumber'

type MovimentacaoResumoProps =
  | { tipo: 'venda'; resumo: ResumoVenda; quantidade: number }
  | { tipo: 'compra'; resumo: ResumoCompra }

function formatEstoqueApos(valor: number): string {
  const arredondado = Math.round(valor)
  return arredondado < 0 ? `Faltam ${formatNumber(-arredondado)} un.` : formatUnidades(arredondado)
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 text-body leading-normal">
      <span className="text-fg-muted">{rotulo}</span>
      <span className="font-semibold tabular-nums">{children}</span>
    </div>
  )
}

function LinhaDestaque({ rotulo, valor }: { rotulo: string; valor: number }) {
  const negativo = valor < 0
  const [escopo, animar] = useAnimate<HTMLSpanElement>()
  const anterior = useRef(negativo)

  useEffect(() => {
    if (anterior.current === negativo) return
    anterior.current = negativo
    animar(escopo.current, { scale: [1, 1.06, 1] }, { duration: 0.3 })
  }, [negativo, animar, escopo])

  return (
    <div className="flex items-center justify-between gap-4 border-t border-line pt-2.5 text-total">
      <span>{rotulo}</span>
      <span
        ref={escopo}
        className={cn(
          'inline-block tabular-nums transition-colors',
          negativo ? 'text-danger' : 'text-success',
        )}
      >
        <AnimatedNumber value={valor} format={formatCurrency} />
      </span>
    </div>
  )
}

export function MovimentacaoResumo(props: MovimentacaoResumoProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-block bg-page p-4">
      {props.tipo === 'venda' ? (
        <>
          <Linha rotulo="Total da venda">
            <AnimatedNumber value={props.resumo.total} format={formatCurrency} />
          </Linha>
          <Linha rotulo={`Custo (valor de compra × ${formatNumber(props.quantidade)})`}>
            <AnimatedNumber value={props.resumo.custo} format={formatCurrency} />
          </Linha>
          <Linha rotulo="Estoque após a venda">
            <AnimatedNumber
              value={props.resumo.estoqueApos}
              format={formatEstoqueApos}
              className={cn('transition-colors', props.resumo.estoqueApos < 0 && 'text-danger')}
            />
          </Linha>
          <LinhaDestaque rotulo="Lucro da venda" valor={props.resumo.lucro} />
        </>
      ) : (
        <>
          <Linha rotulo="Total da compra">
            <AnimatedNumber value={props.resumo.total} format={formatCurrency} />
          </Linha>
          <Linha rotulo="Estoque após a compra">
            <AnimatedNumber value={props.resumo.estoqueApos} format={formatEstoqueApos} />
          </Linha>
          <Linha rotulo="Custo médio">
            {Math.abs(props.resumo.custoMedioDepois - props.resumo.custoMedioAntes) >= 0.005 && (
              <span className="font-normal text-fg-muted">
                {formatCurrency(props.resumo.custoMedioAntes)} →{' '}
              </span>
            )}
            <AnimatedNumber value={props.resumo.custoMedioDepois} format={formatCurrency} />
          </Linha>
          <LinhaDestaque rotulo="Lucro por un. a partir de agora" valor={props.resumo.lucroUnitario} />
          <p className="text-caption text-fg-muted">
            O custo médio é recalculado com a média ponderada entre o estoque atual e esta compra.
          </p>
        </>
      )}
    </div>
  )
}
