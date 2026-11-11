/** Barra superior: título da página e avatar do usuário. */
export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex h-18 shrink-0 items-center gap-4 border-b border-line bg-surface px-4 md:px-8">
      <h1 className="text-title">{title}</h1>
      <div
        role="img"
        aria-label="Cliente"
        className="ml-auto flex size-9 items-center justify-center rounded-full bg-brand-subtle text-body leading-normal font-semibold text-brand"
      >
        CL
      </div>
    </header>
  )
}
