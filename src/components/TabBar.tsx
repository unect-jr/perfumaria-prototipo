import { NavLink } from 'react-router'
import { cn } from '../lib/cn'
import { useRegistrar } from '../store/registrar'
import { Icon, type IconName } from './ui/Icon'

const TABS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Início', icon: 'inicio' },
  { to: '/produtos', label: 'Produtos', icon: 'produto' },
  { to: '/movimentacoes', label: 'Histórico', icon: 'movimentacoes' },
]

const ITEM = 'flex h-12.25 min-w-0 flex-1 flex-col items-center gap-1 text-tab'
const ICONE = 'flex h-8 w-12 items-center justify-center rounded-lg transition-colors duration-120 ease-out'

export function TabBar() {
  const { abrir } = useRegistrar()

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
          className={({ isActive }) => cn(ITEM, isActive ? 'font-semibold text-brand' : 'text-fg-muted')}
        >
          {({ isActive }) => (
            <>
              <span className={cn(ICONE, isActive && 'bg-brand-subtle')}>
                <Icon name={tab.icon} size={22} />
              </span>
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={() => abrir()}
        className={cn(ITEM, 'cursor-pointer font-semibold text-brand')}
      >
        <span className={cn(ICONE, 'bg-brand text-fg-inverse')}>
          <Icon name="plus" size={18} />
        </span>
        Registrar
      </button>
    </nav>
  )
}
