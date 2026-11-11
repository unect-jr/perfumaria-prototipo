import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { FieldTone } from './fieldTone'

type FieldProps = {
  label: string
  htmlFor: string
  messageId: string
  message?: string
  tone: FieldTone
  className?: string
  children: ReactNode
}

export function Field({ label, htmlFor, messageId, message, tone, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-label font-semibold whitespace-nowrap">
        {label}
      </label>
      <div
        className={cn(
          'relative flex h-11 items-center gap-2 rounded-md border bg-surface px-3 transition-[border-color,box-shadow] duration-120 ease-out',
          tone === 'erro' && 'border-danger shadow-field-danger',
          tone === 'alerta' && 'border-warning shadow-field-warning',
          tone === 'padrao' &&
            'border-line-input hover:border-line-hover focus-within:border-brand focus-within:shadow-field-focus hover:focus-within:border-brand',
        )}
      >
        {children}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {message && (
          <motion.p
            key={`${tone}-${message}`}
            id={messageId}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'text-caption',
              tone === 'erro' && 'font-medium text-danger',
              tone === 'alerta' && 'font-medium text-warning',
              tone === 'padrao' && 'text-fg-muted',
            )}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
