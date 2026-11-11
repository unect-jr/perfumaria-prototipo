import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon, type IconName } from './Icon'

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  /** Primário: ação principal (1 por área). Secundário: ações de apoio (Cancelar, Repor). */
  variant?: 'primario' | 'secundario' | 'suave'
  size?: 'md' | 'sm'
  icon?: IconName
  /** Cor do ícone quando difere do texto (ex.: `text-fg-muted` no secundário). */
  iconClassName?: string
  children: ReactNode
}

const VARIANTS = {
  primario: 'bg-brand text-fg-inverse hover:bg-brand/90',
  secundario: 'border border-line bg-surface text-fg hover:bg-page',
  suave: 'bg-brand-subtle text-brand hover:bg-brand-soft/60',
}

const SIZES = {
  md: 'h-11 gap-2 px-4 text-body',
  sm: 'h-8 gap-1.5 px-3 text-label',
}

export function Button({
  variant = 'primario',
  size = 'md',
  icon,
  iconClassName,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.08, ease: 'easeOut' }}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md font-semibold whitespace-nowrap transition-colors duration-120 ease-out disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} className={iconClassName} />}
      {children}
    </motion.button>
  )
}
