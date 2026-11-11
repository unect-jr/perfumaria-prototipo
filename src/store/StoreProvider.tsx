import { useMemo, useReducer, type ReactNode } from 'react'
import { movimentacoesSeed, produtosSeed } from '../data/seed'
import { StoreContext } from './context'
import { reducer } from './reducer'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, {
    produtos: produtosSeed,
    movimentacoes: movimentacoesSeed,
  })
  const value = useMemo(() => ({ estado, dispatch }), [estado])
  return <StoreContext value={value}>{children}</StoreContext>
}
