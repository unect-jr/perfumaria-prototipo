import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { EASE } from '../../lib/motion'
import { IconButton } from './IconButton'

type ModalProps = {
  aberto: boolean
  titulo: string
  tituloMobile?: string
  onFechar: () => void
  children: ReactNode
}

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({ aberto, titulo, tituloMobile, onFechar, children }: ModalProps) {
  const tituloId = useId()
  const painelRef = useRef<HTMLDivElement>(null)
  const onFecharRef = useRef(onFechar)

  useEffect(() => {
    onFecharRef.current = onFechar
  })

  useEffect(() => {
    if (!aberto) return
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const quadro = requestAnimationFrame(() => {
      const painel = painelRef.current
      const primeiro = painel?.querySelector<HTMLElement>('[data-autofocus]') ?? painel
      primeiro?.focus()
      if (document.activeElement !== primeiro) painel?.focus()
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onFecharRef.current()
        return
      }
      if (e.key !== 'Tab' || !painelRef.current) return
      const focaveis = [...painelRef.current.querySelectorAll<HTMLElement>(FOCAVEIS)]
      if (focaveis.length === 0) return
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primeiro.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(quadro)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      anterior?.focus()
    }
  }, [aberto])

  return createPortal(
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onFechar()
          }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-page md:bg-overlay md:p-4"
        >
          <motion.div
            ref={painelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="flex min-h-dvh w-full flex-col gap-3.5 self-start bg-page px-5 pb-5 outline-none md:my-auto md:min-h-0 md:max-w-140 md:gap-5 md:self-auto md:rounded-lg md:bg-surface md:p-7 md:shadow-modal"
          >
            <div className="sticky top-0 z-10 -mx-5 flex items-center gap-3 bg-page px-5 pt-5 pb-0.5 md:static md:mx-0 md:bg-transparent md:p-0">
              <div className="md:hidden">
                <IconButton icon="voltar" label="Voltar" size="lg" onClick={onFechar} />
              </div>
              <h2
                id={tituloId}
                className="flex-1 text-center text-total md:mr-auto md:flex-none md:text-left md:text-title"
              >
                <span className="md:hidden">{tituloMobile ?? titulo}</span>
                <span className="hidden md:inline">{titulo}</span>
              </h2>
              <span aria-hidden="true" className="size-11 shrink-0 md:hidden" />
              <div className="hidden md:block">
                <IconButton icon="fechar" label="Fechar" onClick={onFechar} />
              </div>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
