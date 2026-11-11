import { cn } from '../../lib/cn'

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3 text-label font-semibold whitespace-nowrap transition-colors duration-160 ease-out',
        selected
          ? 'border-inverse bg-inverse text-fg-inverse'
          : 'border-line bg-surface text-fg-muted hover:bg-page hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
