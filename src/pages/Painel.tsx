import { KpiCard } from '../components/KpiCard'
import { LowStockCard } from '../components/LowStockCard'
import { ProfitBars } from '../components/ProfitBars'
import { ProfitRanking } from '../components/ProfitRanking'
import { Button } from '../components/ui/Button'
import {
  formatCurrency,
  formatMonthLong,
  formatMonthShort,
  formatNumber,
  formatPercent,
  formatUnidades,
  pluralUnidade,
} from '../lib/format'
import { usePainel } from '../store/usePainel'

export function Painel() {
  const { mes, resumo, estoque, lucroPorMes, estoqueBaixo, ranking } = usePainel()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-heading">Resumo de {formatMonthLong(mes)}</h2>
        {/* TODO: abrir o registro de movimentação (modal) quando a tela existir */}
        <Button variant="secundario" icon="compra" iconClassName="text-fg-muted">
          Registrar compra
        </Button>
        <Button icon="venda">Registrar venda</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
          className="sm:col-span-2 xl:col-span-3"
          barras={lucroPorMes.map(({ mes: m, lucro }, i) => ({
            chave: `${m.ano}-${m.mes}`,
            rotulo: formatMonthShort(m),
            valor: lucro,
            atual: i === lucroPorMes.length - 1,
          }))}
        />
        <LowStockCard className="sm:col-span-2 xl:col-span-1" itens={estoqueBaixo} />
        <ProfitRanking className="sm:col-span-2 xl:col-span-4" itens={ranking} />
      </div>
    </div>
  )
}
