import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Field } from './Field'
import { getFieldTone } from './fieldTone'

type TextFieldProps = Omit<ComponentProps<'input'>, 'className' | 'size' | 'value'> & {
  label: string
  value: string
  help?: string
  error?: string
  warning?: string
  suffix?: string
  icon?: ReactNode
  className?: string
  inputClassName?: string
}

export function TextField({
  label,
  value,
  help,
  error,
  warning,
  suffix,
  icon,
  className,
  inputClassName,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-mensagem`
  const message = error ?? warning ?? help
  const tone = getFieldTone(error, warning)

  return (
    <Field
      label={label}
      htmlFor={inputId}
      messageId={messageId}
      message={message}
      tone={tone}
      className={className}
    >
      <input
        id={inputId}
        value={value}
        aria-invalid={tone === 'erro' || undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-placeholder',
          inputClassName,
        )}
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
      {icon}
    </Field>
  )
}
