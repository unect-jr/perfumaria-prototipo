import { useMemo, useState } from 'react'
import {
  getEstoqueBaixo,
  getHistorico,
  getLucroDoMes,
  getMes,
  getMesesAte,
  getPosicoes,
  getRankingDoMes,
  getResumoDoMes,
  getResumoEstoque,
  getVariacao,
} from '../lib/calc'
import { useStore } from './context'

const MESES_NO_GRAFICO = 6
const ITENS_NO_RANKING = 5
const ULTIMAS_MOVIMENTACOES = 2

/** Seletores derivados do Painel (web) e do Início (mobile), todos a partir das movimentações. */
export function usePainel() {
  const { estado } = useStore()
  const [mes] = useState(() => getMes(new Date()))

  return useMemo(() => {
    const { produtos, movimentacoes } = estado
    const posicoes = getPosicoes(produtos, movimentacoes)
    const lucroPorMes = getMesesAte(mes, MESES_NO_GRAFICO).map((m) => ({
      mes: m,
      lucro: getLucroDoMes(movimentacoes, m),
    }))
    const resumo = getResumoDoMes(movimentacoes, mes)
    const anterior = lucroPorMes[lucroPorMes.length - 2]

    return {
      mes,
      resumo,
      /** Variação do lucro em relação ao mês anterior. */
      variacao: {
        mesAnterior: anterior.mes,
        valor: getVariacao(resumo.lucro, anterior.lucro),
      },
      estoque: getResumoEstoque(posicoes),
      lucroPorMes,
      estoqueBaixo: getEstoqueBaixo(produtos, posicoes),
      ranking: getRankingDoMes(produtos, movimentacoes, mes).slice(0, ITENS_NO_RANKING),
      ultimas: getHistorico(produtos, movimentacoes, ULTIMAS_MOVIMENTACOES),
    }
  }, [estado, mes])
}

export type DadosPainel = ReturnType<typeof usePainel>
