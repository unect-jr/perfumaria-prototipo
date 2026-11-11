import { useMemo, useState } from 'react'
import {
  getEstoqueBaixo,
  getLucroDoMes,
  getMes,
  getMesesAte,
  getPosicoes,
  getRankingDoMes,
  getResumoDoMes,
  getResumoEstoque,
} from '../lib/calc'
import { useStore } from './context'

const MESES_NO_GRAFICO = 6
const ITENS_NO_RANKING = 5

/** Seletores derivados do Painel, todos calculados a partir das movimentações. */
export function usePainel() {
  const { estado } = useStore()
  const [mes] = useState(() => getMes(new Date()))

  return useMemo(() => {
    const { produtos, movimentacoes } = estado
    const posicoes = getPosicoes(produtos, movimentacoes)
    return {
      mes,
      resumo: getResumoDoMes(movimentacoes, mes),
      estoque: getResumoEstoque(posicoes),
      lucroPorMes: getMesesAte(mes, MESES_NO_GRAFICO).map((m) => ({
        mes: m,
        lucro: getLucroDoMes(movimentacoes, m),
      })),
      estoqueBaixo: getEstoqueBaixo(produtos, posicoes),
      ranking: getRankingDoMes(produtos, movimentacoes, mes).slice(0, ITENS_NO_RANKING),
    }
  }, [estado, mes])
}
