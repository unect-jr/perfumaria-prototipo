import { createContext, useContext, type Dispatch } from 'react'
import type { Acao, EstadoApp } from './reducer'

export type StoreValue = { estado: EstadoApp; dispatch: Dispatch<Acao> }

export const StoreContext = createContext<StoreValue | null>(null)

export function useStore(): StoreValue {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore precisa estar dentro de <StoreProvider>')
  return store
}
