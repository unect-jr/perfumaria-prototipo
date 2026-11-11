import { useMemo } from 'react'
import { getHistorico } from '../lib/calc'
import { useStore } from './context'

export function useHistorico() {
  const { estado } = useStore()
  return useMemo(() => getHistorico(estado.produtos, estado.movimentacoes), [estado])
}
