import { Avatar } from './Avatar'
import { LogoSymbol } from './LogoSymbol'

/** Cabeçalho do Início (mobile): símbolo, saudação, título e avatar. Fixo no topo ao rolar. */
export function MobileHeader({ saudacao, title }: { saudacao: string; title: string }) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 bg-page px-5 pt-5 pb-3 md:hidden">
      <LogoSymbol />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-label text-fg-muted">{saudacao}</p>
        <h1 className="text-title-lg">{title}</h1>
      </div>
      <Avatar className="ml-auto" />
    </header>
  )
}
