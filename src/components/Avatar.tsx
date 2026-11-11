import { cn } from '../lib/cn'

/** Avatar do usuário logado ("CL", Cliente). */
export function Avatar({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Cliente"
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-body leading-normal font-semibold text-brand',
        className,
      )}
    >
      CL
    </div>
  )
}
