import { formatCurrency } from '../lib/format'
import { AnimatedNumber } from './ui/AnimatedNumber'

/** Cartão roxo "Lucro obtido no mês" do Início (mobile). */
export function ProfitHighlight({ lucro, detalhe }: { lucro: number; detalhe: string }) {
  return (
    <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-2xl bg-brand px-4.5 py-5.5">
      <img
        src="/ilustracoes/frascos-claro.svg"
        alt=""
        width={150}
        height={105}
        className="pointer-events-none absolute top-7.5 -right-3.5"
      />
      <p className="relative text-label text-brand-fg-muted">Lucro obtido no mês</p>
      <AnimatedNumber
        value={lucro}
        format={formatCurrency}
        className="relative text-kpi whitespace-nowrap text-fg-inverse tabular-nums"
      />
      <p className="relative text-caption leading-normal text-brand-fg-muted">{detalhe}</p>
    </div>
  )
}
