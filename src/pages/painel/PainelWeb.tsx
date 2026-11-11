import { KpiCard } from '../../components/KpiCard'
import { LowStockCard } from '../../components/LowStockCard'
import { ProfitBars } from '../../components/ProfitBars'
import { ProfitRanking } from '../../components/ProfitRanking'
import { Button } from '../../components/ui/Button'
import {
  formatCurrency,
  formatMonthLong,
  formatMonthShort,
  formatNumber,
  formatPercent,
  formatUnidades,
  pluralUnidade,
} from '../../lib/format'
import { useRegistrar } from '../../store/registrar'
import type { DadosPainel } from '../../store/usePainel'

/** Painel (web, a partir de md). */
export function PainelWeb({ dados }: { dados: DadosPainel }) {
  const { mes, resumo, estoque, lucroPorMes, estoqueBaixo, ranking } = dados
  const { abrir } = useRegistrar()

  return (
    <div className="hidden flex-col gap-6 p-8 md:flex">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-heading">Resumo de {formatMonthLong(mes)}</h2>
        <Button
          variant="secundario"
          icon="compra"
          iconClassName="text-fg-muted"
          onClick={() => abrir({ tipo: 'compra' })}
        >
          Registrar compra
        </Button>
        <Button icon="venda" onClick={() => abrir({ tipo: 'venda' })}>
          Registrar venda
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        <KpiCard
          rotulo="Total investido"
          valor={resumo.totalInvestido}
          format={formatCurrency}
          detalhe="Tudo o que você pagou pelos produtos"
        />
        <KpiCard
          rotulo="Total vendido"
          valor={resumo.totalVendido}
          format={formatCurrency}
          detalhe={`${formatNumber(resumo.unidadesVendidas)} ${pluralUnidade(resumo.unidadesVendidas)} ${resumo.unidadesVendidas === 1 ? 'vendida' : 'vendidas'}`}
        />
        <KpiCard
          rotulo="Lucro obtido"
          valor={resumo.lucro}
          format={formatCurrency}
          detalhe={`Margem média de ${formatPercent(resumo.margem)}`}
          tom={resumo.lucro < 0 ? 'negativo' : 'positivo'}
        />
        <KpiCard
          rotulo="Em estoque"
          valor={estoque.unidades}
          format={formatUnidades}
          detalhe={`Valor em estoque: ${formatCurrency(estoque.valor)}`}
        />

        <ProfitBars
          className="col-span-2 xl:col-span-3"
          barras={lucroPorMes.map(({ mes: m, lucro }, i) => ({
            chave: `${m.ano}-${m.mes}`,
            rotulo: formatMonthShort(m),
            valor: lucro,
            atual: i === lucroPorMes.length - 1,
          }))}
        />
        <LowStockCard
          className="col-span-2 xl:col-span-1"
          itens={estoqueBaixo}
          onRepor={(produto) => abrir({ tipo: 'compra', produtoId: produto.id })}
        />
        <ProfitRanking className="col-span-2 xl:col-span-4" itens={ranking} />
      </div>
    </div>
  )
}
