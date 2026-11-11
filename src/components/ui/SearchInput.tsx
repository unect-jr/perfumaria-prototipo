import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}) {
  return (
    <label
      className={cn(
        'flex h-11 items-center gap-2 rounded-md border border-line-input bg-surface px-3.5 transition-colors duration-120 ease-out focus-within:border-brand',
        className,
      )}
    >
      <Icon name="busca" className="text-fg-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-placeholder [&::-webkit-search-cancel-button]:hidden"
      />
    </label>
  )
}
