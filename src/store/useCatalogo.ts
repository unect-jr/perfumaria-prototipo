import { useMemo } from 'react'
import { getCatalogo, getPosicoes } from '../lib/calc'
import { useStore } from './context'

export function useCatalogo() {
  const { estado } = useStore()
  return useMemo(
    () => getCatalogo(estado.produtos, getPosicoes(estado.produtos, estado.movimentacoes)),
    [estado],
  )
}
