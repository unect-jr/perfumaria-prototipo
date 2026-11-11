import type { ComponentProps } from 'react'
import { formatCurrency } from '../../lib/format'
import { TextField } from './TextField'

type CurrencyFieldProps = Omit<ComponentProps<typeof TextField>, 'value' | 'onChange' | 'suffix'> & {
  value: number | null
  onChange: (value: number | null) => void
}

export function CurrencyField({ value, onChange, ...rest }: CurrencyFieldProps) {
  return (
    <TextField
      inputMode="numeric"
      autoComplete="off"
      value={value === null ? '' : formatCurrency(value)}
      onChange={(e) => {
        const digitos = e.target.value.replace(/\D/g, '').slice(0, 9)
        onChange(digitos === '' ? null : Number(digitos) / 100)
      }}
      {...rest}
    />
  )
}
