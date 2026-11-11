import { createContext, useContext, type ReactNode } from 'react'

export type ToastDados = {
  tom: 'sucesso' | 'erro'
  titulo: string
  detalhe: ReactNode
  acao?: { rotulo: string; onClick: () => void }
}

export type ToastValue = { mostrar: (dados: ToastDados) => void; fechar: () => void }

export const ToastContext = createContext<ToastValue | null>(null)

export function useToast(): ToastValue {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast precisa estar dentro de <ToastProvider>')
  return toast
}
