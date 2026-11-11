import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  createLucideIcon,
  House,
  LayoutGrid,
  Pencil,
  Plus,
  Search,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const Frasco = createLucideIcon('Frasco', [
  ['rect', { x: '9', y: '2', width: '6', height: '3.5', rx: '1', key: 'tampa' }],
  ['path', { d: 'M10.5 5.5v2M13.5 5.5v2', key: 'gargalo' }],
  ['rect', { x: '5', y: '7.5', width: '14', height: '14.5', rx: '3.5', key: 'corpo' }],
  ['path', { d: 'M8.5 14h7', key: 'rotulo' }],
])

const ICONS = {
  painel: LayoutGrid,
  inicio: House,
  produto: Frasco,
  movimentacoes: ArrowRightLeft,
  compra: ArrowDownLeft,
  venda: ArrowUpRight,
  alerta: TriangleAlert,
  plus: Plus,
  busca: Search,
  editar: Pencil,
  voltar: ChevronLeft,
  avancar: ChevronRight,
  fechar: X,
  'seta-baixo': ChevronDown,
  calendario: Calendar,
  check: Check,
  erro: CircleAlert,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export type IconSize = 14 | 16 | 18 | 20 | 22

export function Icon({
  name,
  size = 18,
  className,
}: {
  name: IconName
  size?: IconSize
  className?: string
}) {
  const Component = ICONS[name]
  return (
    <Component
      aria-hidden="true"
      size={size}
      strokeWidth={1.75}
      absoluteStrokeWidth
      className={cn('shrink-0', className)}
    />
  )
}
