import { AnimatePresence, motion } from 'motion/react'
import { useId, type ComponentProps } from 'react'
import { cn } from '../../lib/cn'

type TextFieldProps = Omit<ComponentProps<'input'>, 'className' | 'size' | 'value'> & {
  label: string
  value: string
  help?: string
  error?: string
  warning?: string
  suffix?: string
  className?: string
}

export function TextField({
  label,
  value,
  help,
  error,
  warning,
  suffix,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-mensagem`
  const message = error ?? warning ?? help
  const tone = error ? 'erro' : warning ? 'alerta' : 'padrao'

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="text-label font-semibold whitespace-nowrap">
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
        <input
          id={inputId}
          value={value}
          aria-invalid={tone === 'erro' || undefined}
          aria-describedby={message ? messageId : undefined}
          className="min-w-0 flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-placeholder"
          {...rest}
        />
        {suffix && value !== '' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-body whitespace-pre"
          >
            <span className="invisible">{value}</span> {suffix}
          </span>
        )}
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
