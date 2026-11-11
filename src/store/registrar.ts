import { createContext, useContext } from 'react'
import type { TipoMovimentacao } from '../data/types'

export type OpcoesRegistro = { tipo?: TipoMovimentacao; produtoId?: string }

export type RegistrarValue = {
  abrir: (opcoes?: OpcoesRegistro) => void
  destaqueId: string | null
  destacar: (id: string | null) => void
}

export const RegistrarContext = createContext<RegistrarValue | null>(null)

export function useRegistrar(): RegistrarValue {
  const registrar = useContext(RegistrarContext)
  if (!registrar) throw new Error('useRegistrar precisa estar dentro de <RegistrarProvider>')
  return registrar
}
