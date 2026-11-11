import { useId, type ComponentProps } from 'react'
import { cn } from '../../lib/cn'
import { Field } from './Field'
import { getFieldTone } from './fieldTone'
import { Icon } from './Icon'

type SelectFieldProps = Omit<ComponentProps<'select'>, 'className' | 'value'> & {
  label: string
  value: string
  placeholder: string
  opcoes: { valor: string; rotulo: string }[]
  help?: string
  error?: string
  warning?: string
  className?: string
}

export function SelectField({
  label,
  value,
  placeholder,
  opcoes,
  help,
  error,
  warning,
  className,
  id,
  ...rest
}: SelectFieldProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  const messageId = `${selectId}-mensagem`
  const message = error ?? warning ?? help
  const tone = getFieldTone(error, warning)

  return (
    <Field
      label={label}
      htmlFor={selectId}
      messageId={messageId}
      message={message}
      tone={tone}
      className={className}
    >
      <select
        id={selectId}
        value={value}
        aria-invalid={tone === 'erro' || undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          'absolute inset-0 cursor-pointer appearance-none truncate bg-transparent pr-9 pl-3 text-body outline-none',
          value === '' ? 'text-fg-placeholder' : 'text-fg',
        )}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor} className="text-fg">
            {opcao.rotulo}
          </option>
        ))}
      </select>
      <Icon name="seta-baixo" size={16} className="pointer-events-none ml-auto text-fg-muted" />
    </Field>
  )
}
