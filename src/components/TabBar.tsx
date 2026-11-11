import { NavLink } from 'react-router'
import { cn } from '../lib/cn'
import { Icon, type IconName } from './ui/Icon'

const TABS: { to: string; label: string; icon: IconName; acao?: boolean }[] = [
  { to: '/', label: 'Início', icon: 'inicio' },
  { to: '/produtos', label: 'Produtos', icon: 'produto' },
  { to: '/movimentacoes', label: 'Histórico', icon: 'movimentacoes' },
  { to: '/registrar', label: 'Registrar', icon: 'plus', acao: true },
]

/** Barra inferior do layout mobile. "Registrar" é a ação (roxo cheio). */
export function TabBar() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-20 flex h-21 items-center border-t border-line bg-surface px-2 pt-2 pb-5 md:hidden"
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            cn(
              'flex h-12.25 min-w-0 flex-1 flex-col items-center gap-1 text-tab',
              isActive || tab.acao ? 'font-semibold text-brand' : 'text-fg-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'flex h-8 w-12 items-center justify-center rounded-lg transition-colors duration-120 ease-out',
                  tab.acao && 'bg-brand text-fg-inverse',
                  !tab.acao && isActive && 'bg-brand-subtle',
                )}
              >
                <Icon name={tab.icon} size={tab.acao ? 18 : 22} />
              </span>
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
