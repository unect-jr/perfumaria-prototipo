import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Toast } from './Toast'
import { ToastContext, type ToastDados } from './toastContext'

const DURACAO_MS = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [atual, setAtual] = useState<{ id: number; dados: ToastDados } | null>(null)
  const [pausado, setPausado] = useState(false)

  const mostrar = useCallback((dados: ToastDados) => {
    setAtual((anterior) => ({ id: (anterior?.id ?? 0) + 1, dados }))
    setPausado(false)
  }, [])

  const fechar = useCallback(() => setAtual(null), [])

  useEffect(() => {
    if (!atual || pausado) return
    const timer = window.setTimeout(() => setAtual(null), DURACAO_MS)
    return () => window.clearTimeout(timer)
  }, [atual, pausado])

  const value = useMemo(() => ({ mostrar, fechar }), [mostrar, fechar])

  return (
    <ToastContext value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-25 z-60 flex justify-end md:inset-x-auto md:right-6 md:bottom-6">
        <AnimatePresence mode="wait">
          {atual && (
            <Toast key={atual.id} dados={atual.dados} onFechar={fechar} onPausar={setPausado} />
          )}
        </AnimatePresence>
      </div>
    </ToastContext>
  )
}
