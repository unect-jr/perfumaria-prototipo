import { Avatar } from './Avatar'

/** Barra superior do layout web: título da página e avatar. No mobile cada tela tem seu cabeçalho. */
export function Topbar({ title }: { title: string }) {
  return (
    <header className="hidden h-18 shrink-0 items-center gap-4 border-b border-line bg-surface px-8 md:flex">
      <h1 className="text-title">{title}</h1>
      <Avatar className="ml-auto" />
    </header>
  )
}
