import { NavLink } from 'react-router'
import { cn } from '../lib/cn'
import { Logo } from './Logo'
import { Icon, type IconName } from './ui/Icon'

const ITENS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Painel', icon: 'painel' },
  { to: '/produtos', label: 'Produtos', icon: 'produto' },
  { to: '/movimentacoes', label: 'Movimentações', icon: 'movimentacoes' },
]

/** Menu lateral do layout web. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-62 flex-col gap-1 border-r border-line bg-surface px-4 py-6 md:flex">
      <div className="flex justify-center px-2 pb-6">
        <Logo />
      </div>
      <nav aria-label="Principal">
        <ul className="flex flex-col gap-1">
          {ITENS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex h-9.5 items-center gap-3 rounded-md px-3 py-2 text-body transition-colors duration-120 ease-out',
                    isActive
                      ? 'bg-brand-subtle font-semibold text-brand'
                      : 'text-fg-muted hover:bg-page hover:text-fg',
                  )
                }
              >
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
