import { motion } from 'motion/react'
import { Link } from 'react-router'
import { MobileHeader } from '../../components/MobileHeader'
import { MovementItem } from '../../components/MovementItem'
import { ProfitHighlight } from '../../components/ProfitHighlight'
import { StatCard } from '../../components/StatCard'
import {
  formatCurrency,
  formatMonthLong,
  formatPercent,
  formatSignedPercent,
  formatUnidades,
} from '../../lib/format'
import { EASE, STAGGER } from '../../lib/motion'
import type { DadosPainel } from '../../store/usePainel'

const formatProdutos = (n: number) => {
  const inteiro = Math.round(n)
  return `${inteiro} ${inteiro === 1 ? 'produto' : 'produtos'}`
}

/** Início (mobile): mesmo estado do Painel, com a apresentação do Figma mobile. */
export function InicioMobile({ dados }: { dados: DadosPainel }) {
  const { mes, resumo, variacao, estoque, estoqueBaixo, ultimas } = dados
  const detalhe = [
    `Margem média de ${formatPercent(resumo.margem)}`,
    variacao.valor !== null &&
      `${formatSignedPercent(variacao.valor)} vs. ${formatMonthLong(variacao.mesAnterior)}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="md:hidden">
      <MobileHeader saudacao="Olá, Cliente" title={`Resumo de ${formatMonthLong(mes)}`} />
      <div className="flex flex-col gap-3.5 px-5 pt-1 pb-5">
        <ProfitHighlight lucro={resumo.lucro} detalhe={detalhe} />

        <div className="grid grid-cols-2 gap-3">
          <StatCard rotulo="Total investido" valor={resumo.totalInvestido} format={formatCurrency} />
          <StatCard rotulo="Total vendido" valor={resumo.totalVendido} format={formatCurrency} />
          <StatCard rotulo="Em estoque" valor={estoque.unidades} format={formatUnidades} />
          <StatCard
            rotulo="Estoque baixo"
            valor={estoqueBaixo.length}
            format={formatProdutos}
            tom={estoqueBaixo.length > 0 ? 'alerta' : 'padrao'}
          />
        </div>

        <div className="flex items-center pt-1">
          <h2 className="text-heading">Últimas movimentações</h2>
          <Link to="/movimentacoes" className="ml-auto text-label font-semibold text-brand">
            Ver tudo
          </Link>
        </div>
        <ul className="flex flex-col gap-3.5">
          {ultimas.map(({ movimentacao, produto, total, lucro }, i) => (
            <motion.li
              key={movimentacao.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * STAGGER, duration: 0.25, ease: EASE }}
            >
              <MovementItem
                tipo={movimentacao.tipo}
                nomeProduto={produto?.nome ?? ''}
                quantidade={movimentacao.quantidade}
                data={movimentacao.data}
                total={total}
                lucro={lucro}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}
