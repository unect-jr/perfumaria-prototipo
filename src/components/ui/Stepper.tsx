import { cn } from '../../lib/cn'
import { formatNumber } from '../../lib/format'
import { getFieldTone } from './fieldTone'
import { Icon, type IconName } from './Icon'

type StepperProps = {
  id: string
  label: string
  valor: number
  min?: number
  max?: number
  onChange: (valor: number) => void
  error?: string
  warning?: string
  className?: string
}

function Passo({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: IconName
  label: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md bg-surface-subtle text-fg transition-[opacity,transform] duration-80 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon name={icon} size={18} />
    </button>
  )
}

export function Stepper({
  id,
  label,
  valor,
  min = 1,
  max = Infinity,
  onChange,
  error,
  warning,
  className,
}: StepperProps) {
  const messageId = `${id}-mensagem`
  const message = error ?? warning
  const tone = getFieldTone(error, warning)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span id={`${id}-rotulo`} className="text-label font-semibold">
        {label}
      </span>
      <div
        id={id}
        role="group"
        tabIndex={-1}
        aria-labelledby={`${id}-rotulo`}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          'flex h-14 items-center rounded-md border bg-surface px-1.5 outline-none transition-[border-color,box-shadow] duration-120 ease-out',
          tone === 'erro' && 'border-danger shadow-field-danger',
          tone === 'alerta' && 'border-warning shadow-field-warning',
          tone === 'padrao' && 'border-line-input',
        )}
      >
        <Passo
          icon="menos"
          label="Diminuir quantidade"
          disabled={valor <= min}
          onClick={() => onChange(Math.max(min, valor - 1))}
        />
        <output aria-live="polite" className="min-w-0 flex-1 text-center text-heading tabular-nums">
          {formatNumber(valor)}
        </output>
        <Passo
          icon="plus"
          label="Aumentar quantidade"
          disabled={valor >= max}
          onClick={() => onChange(Math.min(max, valor + 1))}
        />
      </div>
      {message && (
        <p
          id={messageId}
          className={cn('text-caption font-medium', tone === 'erro' ? 'text-danger' : 'text-warning')}
        >
          {message}
        </p>
      )}
    </div>
  )
}
