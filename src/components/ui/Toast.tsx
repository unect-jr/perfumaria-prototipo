import { motion } from 'motion/react'
import { LogoSymbol } from '../LogoSymbol'
import { cn } from '../../lib/cn'
import { Button } from './Button'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import type { ToastDados } from './toastContext'

type ToastProps = {
  dados: ToastDados
  onFechar: () => void
  onPausar: (pausado: boolean) => void
}

export function Toast({ dados, onFechar, onPausar }: ToastProps) {
  const { tom, titulo, detalhe, acao } = dados

  return (
    <motion.div
      role={tom === 'erro' ? 'alert' : 'status'}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.34, 1.56, 0.64, 1] } }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.2, ease: 'easeIn' } }}
      onMouseEnter={() => onPausar(true)}
      onMouseLeave={() => onPausar(false)}
      onFocus={() => onPausar(true)}
      onBlur={() => onPausar(false)}
      className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-line bg-surface py-3 pr-3 pl-4 shadow-floating md:w-110"
    >
      <LogoSymbol />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="flex items-center gap-1.5 text-subheading font-semibold">
          <Icon
            name={tom === 'erro' ? 'erro' : 'check'}
            size={16}
            className={cn(tom === 'erro' ? 'text-danger' : 'text-success')}
          />
          {titulo}
        </p>
        <p className="text-label leading-5 text-fg-muted">{detalhe}</p>
        {acao && (
          <div className="flex pt-2">
            <Button
              variant="suave"
              size="sm"
              onClick={() => {
                acao.onClick()
                onFechar()
              }}
            >
              {acao.rotulo}
            </Button>
          </div>
        )}
      </div>
      <IconButton icon="fechar" label="Fechar notificação" size="sm" onClick={onFechar} />
    </motion.div>
  )
}
